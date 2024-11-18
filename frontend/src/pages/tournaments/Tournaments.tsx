import { useState, useEffect } from "react";
import styles from "./Tournaments.module.scss";
import { 
    useGetTournaments, 
    useGetObjectTypes, 
    useGetUsersTournaments, 
    useJoinTournament, 
    useLeaveTournament, 
    JoinLeaveTournamentResponse,
    JoinLeaveTournamentErrorResponse
} from "./tournamentsService";
import { 
    Select, 
    MenuItem, 
    FormControl, 
    InputLabel, 
    CircularProgress, 
    Button, 
    SelectChangeEvent, 
    Snackbar, 
    Alert 
} from "@mui/material";
import { AxiosError } from "axios";

const Tournaments = () => {
    const [selectedObjectId, setSelectedObjectId] = useState<string>("all");
    const [isClient, setIsClient] = useState<boolean>(false);
    const [userId, setUserId] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showError, setShowError] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null); // Stan dla wiadomości sukcesu
    const [showSuccess, setShowSuccess] = useState<boolean>(false); // Stan dla widoczności sukcesu

    const { data: tournaments, isLoading: loadingTournaments } = useGetTournaments();
    const { data: objectTypes, isLoading: loadingObjectTypes } = useGetObjectTypes();
    const { data: usersTournaments, isLoading: loadingUsersTournaments, refetch: refetchUsersTournaments } = useGetUsersTournaments(userId || 0);
    const joinTournamentMutation = useJoinTournament();
    const leaveTournamentMutation = useLeaveTournament();

    useEffect(() => {
        const role = localStorage.getItem("role");
        const token = localStorage.getItem("token");
        const storedUserId = localStorage.getItem("userId");

        if (role === "CLIENT" && token && storedUserId) {
            setIsClient(true);
            setUserId(parseInt(storedUserId, 10));
        }
    }, []);

    const handleSelectChange = (event: SelectChangeEvent) => {
        setSelectedObjectId(event.target.value as string);
    };

    const filteredTournaments = selectedObjectId === "all" 
        ? tournaments 
        : tournaments?.filter(tournament => tournament.objectType.objectId.toString() === selectedObjectId);

    const isUserInTournament = (tournamentId: number): boolean => {
        return usersTournaments?.some(userTournament => userTournament.tournament.tournamentId === tournamentId) || false;
    };

    const handleJoinTournament = (tournamentId: number) => {
        if (userId) {
            joinTournamentMutation.mutate(
                { userId, tournamentId, isPaid: false },
                {
                    onSuccess: (data: JoinLeaveTournamentResponse) => {
                        console.log(`Successfully joined tournament ${tournamentId}`);
                        setSuccessMessage(data.message); // Ustawienie wiadomości sukcesu
                        setShowSuccess(true); // Wyświetlenie sukcesu
                        refetchUsersTournaments();
                    },
                    onError: (error: AxiosError<JoinLeaveTournamentErrorResponse>) => {
                        console.error(`Error joining tournament ${tournamentId}`, error);
                        if (error.response?.data?.error) {
                            setErrorMessage(error.response.data.error);
                            setShowError(true);
                        }
                    },
                }
            );
        }
    };

    const handleLeaveTournament = (tournamentId: number) => {
        if (userId) {
            leaveTournamentMutation.mutate(
                { userId, tournamentId },
                {
                    onSuccess: (data: JoinLeaveTournamentResponse) => {
                        console.log(`Successfully left tournament ${tournamentId}`);
                        setSuccessMessage(data.message); // Ustawienie wiadomości sukcesu
                        setShowSuccess(true); // Wyświetlenie sukcesu
                        refetchUsersTournaments();
                    },
                    onError: (error: AxiosError<JoinLeaveTournamentErrorResponse>) => {
                        console.error(`Error leaving tournament ${tournamentId}`, error);
                        if (error.response?.data?.error) {
                            setErrorMessage(error.response.data.error);
                            setShowError(true);
                        }
                    },
                }
            );
        }
    };

    const handleCloseSnackbar = () => {
        setShowError(false);
        setErrorMessage(null);
        setShowSuccess(false);
        setSuccessMessage(null);
    };

    if (loadingTournaments || loadingObjectTypes || loadingUsersTournaments) {
        return <div className={styles.loader}><CircularProgress /></div>;
    }

    return (
        <div className={styles.container}>
            {/* Snackbar for error messages */}
            <Snackbar 
                open={showError} 
                autoHideDuration={6000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="error" variant="filled">
                    {errorMessage}
                </Alert>
            </Snackbar>

            {/* Snackbar for success messages */}
            <Snackbar 
                open={showSuccess} 
                autoHideDuration={6000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" variant="filled">
                    {successMessage}
                </Alert>
            </Snackbar>

            <FormControl fullWidth className={styles.select}>
                <InputLabel id="object-filter-label">Filter by Object</InputLabel>
                <Select
                    labelId="object-filter-label"
                    value={selectedObjectId}
                    onChange={handleSelectChange}
                >
                    <MenuItem value="all">Show all tournaments</MenuItem>
                    {objectTypes?.map(objectType => (
                        <MenuItem key={objectType.objectId} value={objectType.objectId.toString()}>
                            Show tournaments for object {objectType.objectId}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <div className={styles.tournamentsList}>
                {filteredTournaments?.map(tournament => (
                    <div key={tournament.tournamentId} className={styles.tournamentCard}>
                        <h3>{tournament.sport}</h3>
                        <p><strong>Description:</strong> {tournament.description}</p>
                        <p><strong>Max Slots:</strong> {tournament.maxSlots}</p>
                        <p><strong>Occupied Slots:</strong> {tournament.occupiedSlots}</p>
                        <p><strong>Start Date:</strong> {new Date(tournament.startDate).toLocaleDateString()}</p>
                        <p><strong>End Date:</strong> {new Date(tournament.endDate).toLocaleDateString()}</p>
                        <p><strong>Object Type:</strong> {tournament.objectType.type}</p>
                        <img src={tournament.objectType.imageUrl} alt={tournament.objectType.type} className={styles.image} />
                        
                        {isClient && (
                            <div className={styles.buttons}>
                                {!isUserInTournament(tournament.tournamentId) ? (
                                    <Button 
                                        variant="contained" 
                                        color="primary"
                                        onClick={() => handleJoinTournament(tournament.tournamentId)}
                                    >
                                        Join
                                    </Button>
                                ) : (
                                    <Button 
                                        variant="outlined" 
                                        color="secondary"
                                        onClick={() => handleLeaveTournament(tournament.tournamentId)}
                                    >
                                        Leave
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tournaments;

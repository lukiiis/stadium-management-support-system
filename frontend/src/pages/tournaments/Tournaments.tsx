import { useState, useEffect } from "react";
import styles from "./Tournaments.module.scss";
import {
    useGetTournaments,
    useGetObjectTypes,
    useGetUsersTournaments,
    useJoinTournament,
    useLeaveTournament,
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
    Alert,
    AlertColor,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@mui/material";
import { AxiosError } from "axios";
import { ApiErrorResponse, ApiSuccessResponse } from "../../shared/types/api/apiResponse";

const Tournaments = () => {
    const [selectedObjectId, setSelectedObjectId] = useState<string>("all");
    const [isClient, setIsClient] = useState<boolean>(false);
    const [userId, setUserId] = useState<number | null>(null);

    const [snackbarSeverity, setSnackbarSeverity] = useState<string>("error")
    const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
    const [showSnackbar, setShowSnackbar] = useState<boolean>(false);

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
                    onSuccess: (data: ApiSuccessResponse) => {
                        setSnackbarSeverity("success");
                        setSnackbarMessage(data.message);
                        setShowSnackbar(true);
                        refetchUsersTournaments();
                    },
                    onError: (error: AxiosError<ApiErrorResponse>) => {
                        setSnackbarSeverity("error");
                        setSnackbarMessage(error.response?.data.error || "Failed to join tournament");
                        setShowSnackbar(true);
                    },
                }
            );
        }
    };

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedTournamentId, setSelectedTournamentId] = useState<number | null>(null);

    const handleLeaveTournament = (tournamentId: number) => {
        setSelectedTournamentId(tournamentId);
        setDialogOpen(true);
    };

    const confirmLeaveTournament = () => {
        if (selectedTournamentId && userId) {
            leaveTournamentMutation.mutate(
                { userId, tournamentId: selectedTournamentId },
                {
                    onSuccess: (data: ApiSuccessResponse) => {
                        setSnackbarSeverity("success");
                        setSnackbarMessage(data.message);
                        setShowSnackbar(true);
                        refetchUsersTournaments();
                    },
                    onError: (error: AxiosError<ApiErrorResponse>) => {
                        setSnackbarSeverity("error");
                        setSnackbarMessage(error.response?.data.error || "Failed to leave tournament");
                        setShowSnackbar(true);
                    },
                }
            );
        }
        setDialogOpen(false);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleCloseSnackbar = () => {
        setShowSnackbar(false);
        setSnackbarMessage(null);
    };

    if (loadingTournaments || loadingObjectTypes || loadingUsersTournaments) {
        return <div className={styles.loader}><CircularProgress /></div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <Snackbar
                    open={showSnackbar}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity as AlertColor} variant="filled">
                        {snackbarMessage}
                    </Alert>
                </Snackbar>

                <Dialog
                    open={dialogOpen}
                    onClose={handleCloseDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Confirm Leave Tournament"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to leave this tournament?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="primary">
                            No
                        </Button>
                        <Button onClick={confirmLeaveTournament} color="primary" autoFocus>
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>

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
        </div>
    );
};

export default Tournaments;

import { useState, useEffect } from "react";
import styles from "./Tournaments.module.scss";
import {
    useGetPaginatedTournaments,
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
    DialogTitle,
    Pagination,
    Typography
} from "@mui/material";
import { AxiosError } from "axios";
import { ApiErrorResponse, ApiSuccessResponse } from "../../shared/types/api/apiResponse";
import { AnimatePresence, motion } from "framer-motion";

const Tournaments = () => {
    const [selectedObjectId, setSelectedObjectId] = useState<string>("all");
    const [isClient, setIsClient] = useState<boolean>(false);
    const [userId, setUserId] = useState<number | null>(null);

    const [snackbarSeverity, setSnackbarSeverity] = useState<string>("error")
    const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
    const [showSnackbar, setShowSnackbar] = useState<boolean>(false);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedTournamentId, setSelectedTournamentId] = useState<number | null>(null);

    const [page, setPage] = useState(1);
    const [pageSize] = useState(9);

    const { data: tournaments, isLoading: loadingTournaments, refetch: refetchTournaments } = useGetPaginatedTournaments(page - 1, pageSize);
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

    const handleJoinTournament = (tournamentId: number) => {
        if (userId) {
            joinTournamentMutation.mutate(
                { userId, tournamentId, isPaid: false },
                {
                    onSuccess: (data: ApiSuccessResponse) => {
                        setSnackbarSeverity("success");
                        setSnackbarMessage(data.message);
                        setShowSnackbar(true);
                        refetchTournaments();
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
                        refetchTournaments();
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

    const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
        event.preventDefault();
        setPage(newPage);
    };

    if (loadingTournaments || loadingObjectTypes || loadingUsersTournaments) {
        return <div className={styles.loader}><CircularProgress /></div>;
    }

    const filteredTournaments = selectedObjectId === "all"
        ? tournaments?.items
        : tournaments?.items.filter(tournament => tournament.objectType.objectId.toString() === selectedObjectId);

    const isUserInTournament = (tournamentId: number): boolean => {
        return usersTournaments?.some(userTournament => userTournament.tournament.tournamentId === tournamentId) || false;
    };

    return (
        <div className={styles.container}>
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

            <div className={styles.wrapper}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={styles.header}
                >
                    <Typography variant="h3" component="h1">
                        Sports Tournaments
                    </Typography>
                    <Typography variant="subtitle1">
                        Join exciting tournaments and compete with othersD
                    </Typography>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className={styles.controls}
                >
                    <FormControl variant="outlined" className={styles.select}>
                        <InputLabel>Filter by Facility</InputLabel>
                        <Select
                            value={selectedObjectId}
                            onChange={(e: SelectChangeEvent) => setSelectedObjectId(e.target.value)}
                            label="Filter by Facility"
                        >
                            <MenuItem value="all">All Facilities</MenuItem>
                            {objectTypes?.map(type => (
                                <MenuItem key={type.objectId} value={type.objectId.toString()}>
                                    {type.type}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </motion.div>

                <AnimatePresence>
                    <motion.div
                        className={styles.tournamentsList}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {filteredTournaments?.map((tournament, index) => (
                            <motion.div
                                key={tournament.tournamentId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={styles.tournamentCard}
                            >
                                <h3>{tournament.sport}</h3>
                                <div className={styles.info}>
                                    <p><strong>Description:</strong> <span>{tournament.description}</span></p>
                                    <div className={styles.slots}>
                                        <strong>Slots:</strong>
                                        <div className={styles.progress}>
                                            <div
                                                className={styles.bar}
                                                style={{ width: `${(tournament.occupiedSlots / tournament.maxSlots) * 100}%` }}
                                            />
                                        </div>
                                        <span>{tournament.occupiedSlots}/{tournament.maxSlots}</span>
                                    </div>
                                    <p><strong>Start Date:</strong> <span>{new Date(tournament.startDate).toLocaleDateString()}</span></p>
                                    <p><strong>End Date:</strong> <span>{new Date(tournament.endDate).toLocaleDateString()}</span></p>
                                    <p><strong>Facility:</strong> <span>{tournament.objectType.type}</span></p>
                                </div>

                                <div className={styles.imageContainer}>
                                    <img src={tournament.objectType.imageUrl} alt={tournament.objectType.type} />
                                </div>

                                {isClient && (
                                    <div className={styles.buttons}>
                                        {!isUserInTournament(tournament.tournamentId) && tournament.occupiedSlots !== tournament.maxSlots ? (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleJoinTournament(tournament.tournamentId)}
                                            >
                                                Join Tournament
                                            </Button>
                                        ) : isUserInTournament(tournament.tournamentId) ? (
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                onClick={() => handleLeaveTournament(tournament.tournamentId)}
                                            >
                                                Leave Tournament
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                disabled
                                            >
                                                Tournament Full
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>
                <Pagination
                    count={Math.ceil((tournaments?.totalCount || 1) / pageSize)}
                    page={page}
                    onChange={handlePageChange}
                    className={styles.pagination}
                    color="primary"
                    size="large"
                />
            </div>
        </div>
    );
};

export default Tournaments;
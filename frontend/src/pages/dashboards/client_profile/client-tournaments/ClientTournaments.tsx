import React, { useState } from "react";
import { useGetPaginatedUserTournaments, useLeaveTournament } from "./clientTournamentsService";
import { Typography, Button, CircularProgress, Snackbar, Alert, Pagination, AlertColor, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import SportsFootballIcon from '@mui/icons-material/SportsFootball';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { jwtDecode, JwtPayload } from "jwt-decode";
import dayjs from "dayjs";
import styles from "./ClientTournaments.module.scss";
import { AxiosError } from "axios";
import { ApiErrorResponse, ApiSuccessResponse } from "../../../../shared/types/api/apiResponse";
import { UsersTournaments } from "../../../../shared/types/models/userTournament";
import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";

const ClientTournaments: React.FC = () => {
    const token = localStorage.getItem("token");

    if (token === null) {
        return <Navigate to="/" replace />;
    }

    const userId = parseInt(jwtDecode<JwtPayload>(token).sub as string, 10);

    const [page, setPage] = useState(1);
    const [pageSize] = useState(5);

    const [snackbarSeverity, setSnackbarSeverity] = useState<string>("error")
    const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
    const [showSnackbar, setShowSnackbar] = useState<boolean>(false);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedTournamentId, setSelectedTournamentId] = useState<number>();

    const { data, isLoading, isError, refetch } = useGetPaginatedUserTournaments(userId, page - 1, pageSize);
    const { mutate: leaveTournament } = useLeaveTournament();

    const handleLeaveTournament = (tournamentId: number) => {
        setSelectedTournamentId(tournamentId);
        setDialogOpen(true);
    };

    const confirmLeaveTournament = () => {
        if (selectedTournamentId) {
            leaveTournament(
                { userId, tournamentId: selectedTournamentId },
                {
                    onSuccess: (data: ApiSuccessResponse) => {
                        setSnackbarSeverity("success");
                        setSnackbarMessage(data.message);
                        setShowSnackbar(true);
                        refetch();
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

    const handleCloseSnackbar = () => {
        setShowSnackbar(false);
        setSnackbarMessage(null);
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
        event.preventDefault();
        setPage(newPage);
    };

    //popup stuff
    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    if (isLoading) {
        return <CircularProgress />;
    }

    if (isError) {
        return <div>Error fetching tournaments</div>;
    }

    const today = dayjs();

    const getSportIcon = (sport: string) => {
        const sportLower = sport.toLowerCase();
        if (sportLower.includes('football')) return <SportsFootballIcon />;
        if (sportLower.includes('basketball')) return <SportsBasketballIcon />;
        if (sportLower.includes('tennis')) return <SportsTennisIcon />;
        return <EmojiEventsIcon />;
    };

    return (
        <div className={styles.pageContainer}>
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
            >
                <DialogTitle id="alert-dialog-title">{"Confirm Leave Tournament"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to leave this tournament?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>No</Button>
                    <Button onClick={confirmLeaveTournament} autoFocus>Yes</Button>
                </DialogActions>
            </Dialog>

            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                My Tournaments
            </motion.h1>

            {isLoading ? (
                <div className={styles.loader}>
                    <CircularProgress />
                </div>
            ) : data?.items.length === 0 ? (
                <motion.div
                    className={styles.emptyState}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Typography variant="h5">You are not enrolled in any tournament</Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to="/tournaments"
                        className={styles.browseButton}
                    >
                        Browse Tournaments
                    </Button>
                </motion.div>
            ) : (
                <motion.div className={styles.content}>
                    <div className={styles.tournamentsList}>
                        {data?.items.map(({ tournament, joinedAt }: UsersTournaments, index) => {
                            const startDate = dayjs(tournament.startDate);
                            const isFutureTournament = startDate.isAfter(today);

                            return (
                                <motion.div
                                    key={tournament.tournamentId}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className={styles.tournamentCard}>
                                        <div className={styles.cardContent}>
                                            <div className={styles.cardHeader}>
                                                <div className={styles.sportIcon}>
                                                    {getSportIcon(tournament.sport)}
                                                </div>
                                                <div className={styles.titleSection}>
                                                    <Typography variant="h6">{tournament.sport}</Typography>
                                                    <Typography variant="subtitle2" color="textSecondary">
                                                        Tournament #{tournament.tournamentId}
                                                    </Typography>
                                                </div>
                                                <div className={`${styles.status} ${isFutureTournament ? styles.upcoming : styles.past}`}>
                                                    {isFutureTournament ? 'Upcoming' : 'Past'}
                                                </div>
                                            </div>

                                            <div className={styles.details}>
                                                <div className={styles.dateSection}>
                                                    <div className={styles.dateInfo}>
                                                        <Typography><strong>Starts:</strong></Typography>
                                                        <Typography>{dayjs(tournament.startDate).format('MMM D, YYYY')}</Typography>
                                                    </div>
                                                    <div className={styles.dateInfo}>
                                                        <Typography><strong>Ends:</strong></Typography>
                                                        <Typography>{dayjs(tournament.endDate).format('MMM D, YYYY')}</Typography>
                                                    </div>
                                                </div>

                                                <div className={styles.slots}>
                                                    <Typography><strong>Slots:</strong></Typography>
                                                    <div className={styles.progress}>
                                                        <div
                                                            className={styles.progressBar}
                                                            style={{
                                                                width: `${(tournament.occupiedSlots / tournament.maxSlots) * 100}%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <Typography>{tournament.occupiedSlots}/{tournament.maxSlots}</Typography>
                                                </div>

                                                {tournament.description && (
                                                    <Typography className={styles.description}>
                                                        {tournament.description}
                                                    </Typography>
                                                )}

                                                <div className={styles.joinedDate}>
                                                    <Typography color="textSecondary">
                                                        Joined on {dayjs(joinedAt).format('MMM D, YYYY')}
                                                    </Typography>
                                                </div>

                                                {isFutureTournament && (
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        onClick={() => handleLeaveTournament(tournament.tournamentId)}
                                                        className={styles.leaveButton}
                                                        startIcon={<ExitToAppIcon />}
                                                    >
                                                        Leave Tournament
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    <Pagination
                        count={Math.ceil((data?.totalCount || 1) / pageSize)}
                        page={page}
                        onChange={handlePageChange}
                        className={styles.pagination}
                        color="primary"
                        size="large"
                    />
                </motion.div>
            )}
        </div>
    );
};

export default ClientTournaments;
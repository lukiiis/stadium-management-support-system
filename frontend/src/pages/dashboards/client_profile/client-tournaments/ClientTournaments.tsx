import React, { useState } from "react";
import { useGetPaginatedUserTournaments, useLeaveTournament } from "./clientTournamentsService";
import { Card, CardContent, Typography, Button, CircularProgress, Snackbar, Alert, Pagination, AlertColor, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { jwtDecode, JwtPayload } from "jwt-decode";
import dayjs from "dayjs";
import styles from "./ClientTournaments.module.scss";
import { AxiosError } from "axios";
import { ApiErrorResponse, ApiSuccessResponse } from "../../../../shared/types/api/apiResponse";
import { UsersTournaments } from "../../../../shared/types/models/userTournament";
import { useNavigate, Link } from "react-router-dom";

const ClientTournaments: React.FC = () => {
    const navigate = useNavigate();

    const token = localStorage.getItem("token") as string;

    if (token === null) {
        navigate("/login");
        return null;
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

            {data?.items.length === 0 ? (
                <div className="flex flex-col justify-center items-center gap-7">
                    <p className="text-2xl">You are not enrolled in any tournament.</p>
                    <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to="/tournaments"
                        className="mt-4"
                    >
                        View available tournaments
                    </Button>
                </div>
            ) : (
                <>
                    <div className={styles.tournamentsList}>
                        {data?.items.map(({ tournament, joinedAt }: UsersTournaments) => {
                            const tournamentStartDate = dayjs(tournament.startDate);
                            const isFutureTournament = tournamentStartDate.isAfter(today);

                            return (
                                <Card className={styles.tournamentCard} key={tournament.tournamentId}>
                                    <CardContent>
                                        <Typography variant="h6" className={styles.tournamentTitle}>
                                            {tournament.sport} Tournament #{tournament.tournamentId}
                                        </Typography>
                                        <Typography variant="body1">
                                            <strong>Start Date:</strong> {tournament.startDate}
                                        </Typography>
                                        <Typography variant="body1">
                                            <strong>End Date:</strong> {tournament.endDate}
                                        </Typography>
                                        <Typography variant="body1">
                                            <strong>Description:</strong> {tournament.description}
                                        </Typography>
                                        <Typography variant="body1">
                                            <strong>Slots:</strong> {tournament.occupiedSlots}/{tournament.maxSlots}
                                        </Typography>
                                        <Typography variant="body1">
                                            <strong>Joined At:</strong> {joinedAt}
                                        </Typography>
                                        {isFutureTournament && (
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                className={styles.leaveButton}
                                                onClick={() => handleLeaveTournament(tournament.tournamentId)}
                                            >
                                                Leave
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
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
                </>
            )}
        </div>
    );
};

export default ClientTournaments;
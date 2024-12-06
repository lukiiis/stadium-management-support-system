import React, { useState } from "react";
import { useGetPaginatedUserReservations, useCancelReservation, useReservationPayment } from "./clientReservationsService";
import { Card, CardContent, Typography, Button, Snackbar, Alert, Pagination, AlertColor, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress } from "@mui/material";
import { JwtPayload, jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import styles from "./ClientReservations.module.scss";
import { AxiosError } from "axios";
import { ApiErrorResponse, ApiSuccessResponse } from "../../../../shared/types/api/apiResponse";
import { ReservationDto } from "../../../../shared/types/models/reservation";
import { Link, useNavigate } from "react-router-dom";

const ClientReservations: React.FC = () => {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    // TO BE CHANGED --------------------------------------------------------------------------------------------------------------------------------------------------
    if (token === null) {
        navigate("/login");
        return;
    }
    const userId = parseInt(jwtDecode<JwtPayload>(token).sub as string, 10);

    const [page, setPage] = useState(1);
    const [pageSize] = useState(5);

    const [snackbarSeverity, setSnackbarSeverity] = useState<string>("error")
    const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
    const [showSnackbar, setShowSnackbar] = useState<boolean>(false);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedReservationId, setSelectedReservationId] = useState<number | null>(null);

    const { data, isLoading, isError, refetch } = useGetPaginatedUserReservations(userId, page - 1, pageSize);

    const { mutate: cancelReservation } = useCancelReservation();
    const handleCancelReservation = (reservationId: number) => {
        setSelectedReservationId(reservationId);
        setDialogOpen(true);
    };
    const confirmCancelReservation = () => {
        if (selectedReservationId) {
            cancelReservation(selectedReservationId,
                {
                    onSuccess: (data: ApiSuccessResponse) => {
                        setSnackbarSeverity("success");
                        setSnackbarMessage(data.message);
                        setShowSnackbar(true);
                        refetch();
                    },
                    onError: (error: AxiosError<ApiErrorResponse>) => {
                        setSnackbarSeverity("error");
                        setSnackbarMessage(error.response?.data.error || "Failed to cancel reservation");
                        setShowSnackbar(true);
                    },
                }
            );
        }
        setDialogOpen(false);
    };

    //reservation payment
    const { mutate: reservationPayment } = useReservationPayment();
    const handleReservationPayment = (tournamentId: number) => {
        if (userId) {
            reservationPayment(tournamentId,
                {
                    onSuccess: (data: ApiSuccessResponse) => {
                        setSnackbarSeverity("success");
                        setSnackbarMessage(data.message);
                        setShowSnackbar(true);
                        refetch();
                    },
                    onError: (error: AxiosError<ApiErrorResponse>) => {
                        setSnackbarSeverity("error");
                        setSnackbarMessage(error.response?.data.error || "Failed to pay for reservation");
                        setShowSnackbar(true);
                    },
                }
            );
        }
    };


    const handleCloseSnackbar = () => {
        setShowSnackbar(false);
        setSnackbarMessage(null);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
        event.preventDefault();
        setPage(newPage);
    };

    if (isError) {
        return <div>Error fetching reservations</div>;
    }

    if (isLoading) {
        return <CircularProgress />;
    }

    const today = dayjs();

    return (
        <div className={styles.container}>
            {/* Snackbar for error messages */}
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
                <DialogTitle id="alert-dialog-title">{"Confirm Cancel Reservation"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to cancel this reservation?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        No
                    </Button>
                    <Button onClick={confirmCancelReservation} color="primary" autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Reservations */}
            {data?.items.length === 0 ? (
                <div className="flex flex-col justify-center items-center gap-7">
                    <p className="text-2xl">You do not have any reservations.</p>
                    <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to="/reservations"
                        className="mt-4"
                    >
                        Create reservation
                    </Button>
                </div>
            ) : (
                <>
                    <div className={styles.reservationsList}>
                        {data?.items.map((reservation: ReservationDto) => {
                            const reservationDate = dayjs(reservation.reservationDate);
                            const isFutureReservation = reservationDate.isAfter(today);
                            const isReservationPaid = reservation.paymentStatus === "PAID";

                            return (
                                <Card className={styles.reservationCard} key={reservation.reservationId}>
                                    <CardContent>
                                        <Typography variant="h6" className={styles.reservationTitle}>
                                            Reservation #{reservation.reservationId}
                                        </Typography>
                                        <Typography variant="body1">
                                            <strong>Date:</strong> {reservation.reservationDate}
                                        </Typography>
                                        <Typography variant="body1">
                                            <strong>Payment Status:</strong> {reservation.paymentStatus}
                                        </Typography>
                                        <Typography variant="body1">
                                            <strong>Price:</strong> ${reservation.price.toFixed(2)}
                                        </Typography>
                                        <Typography variant="body1">
                                            <strong>Object Type:</strong> {reservation.objectType.type}
                                        </Typography>
                                        {isFutureReservation && (
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                className={styles.cancelButton}
                                                onClick={() => handleCancelReservation(reservation.reservationId)}
                                            >
                                                Cancel
                                            </Button>
                                        )}
                                        {!isReservationPaid && (
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                className={styles.cancelButton}
                                                onClick={() => handleReservationPayment(reservation.reservationId)}
                                            >
                                                Pay
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

export default ClientReservations;

import React, { useState } from "react";
import { useGetPaginatedUserReservations, useCancelReservation, ReservationData } from "./clientReservationsService";
import { Card, CardContent, Typography, Button, CircularProgress, Snackbar, Alert, Pagination, AlertColor } from "@mui/material";
import { JwtPayload, jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import styles from "./ClientReservations.module.scss";
import { ApiErrorResponse, ApiSuccessResponse } from "../../../../shared/interfaces";
import { AxiosError } from "axios";

const ClientReservations: React.FC = () => {
    const token = localStorage.getItem("token") as string;
    const userId = parseInt(jwtDecode<JwtPayload>(token).sub as string, 10);

    const [page, setPage] = useState(1);
    const [pageSize] = useState(5);

    const [snackbarSeverity, setSnackbarSeverity] = useState<string>("error")
    const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
    const [showSnackbar, setShowSnackbar] = useState<boolean>(false);

    const { data, isLoading, isError, refetch } = useGetPaginatedUserReservations(userId, page - 1, pageSize);
    const { mutate: cancelReservation } = useCancelReservation();

    const handleCancelReservation = (reservationId: number) => {
        cancelReservation(reservationId, {
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
        });
    };

    const handleCloseSnackbar = () => {
        setShowSnackbar(false);
        setSnackbarMessage(null);
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
        event.preventDefault();
        setPage(newPage);
    };

    if (isError) {
        return <div>Error fetching reservations</div>;
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

            {/* Reservations */}
            <div className={styles.reservationsList}>
                {data?.items.map((reservation: ReservationData) => {
                    const reservationDate = dayjs(reservation.reservationDate);
                    const isFutureReservation = reservationDate.isAfter(today);

                    return (
                        <div key={reservation.reservationId}>
                            {isLoading ? (
                                <CircularProgress />
                            ) : (
                                <Card className={styles.reservationCard}>
                                    <CardContent>
                                        <Typography variant="h6" className={styles.reservationTitle}>
                                            Reservation #{reservation.reservationId}
                                        </Typography>
                                        <Typography variant="body1">
                                            <strong>Start:</strong> {reservation.reservationStart}
                                        </Typography>
                                        <Typography variant="body1">
                                            <strong>End:</strong> {reservation.reservationEnd}
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
                                    </CardContent>
                                </Card>
                            )}
                        </div>
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
        </div>
    );
};

export default ClientReservations;

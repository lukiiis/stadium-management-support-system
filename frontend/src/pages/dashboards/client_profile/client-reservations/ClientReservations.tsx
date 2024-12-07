import React, { useState } from "react";
import { useGetPaginatedUserReservations, useCancelReservation, useReservationPayment } from "./clientReservationsService";
import { Typography, Button, Snackbar, Alert, Pagination, AlertColor, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress } from "@mui/material";
import { CalendarMonth, LocationOn, AccessTime, Payment, Cancel, CalendarToday } from "@mui/icons-material";
import { JwtPayload, jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import styles from "./ClientReservations.module.scss";
import { AxiosError } from "axios";
import { ApiErrorResponse, ApiSuccessResponse } from "../../../../shared/types/api/apiResponse";
import { ReservationDto } from "../../../../shared/types/models/reservation";
import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";

const ClientReservations: React.FC = () => {
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
    const handleReservationPayment = (reservationId: number) => {
        if (userId) {
            reservationPayment(reservationId,
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

            {isLoading ? (
                <div className={styles.loader}>
                    <CircularProgress size={60} />
                </div>
            ) : data?.items.length === 0 ? (
                <motion.div
                    className={styles.emptyState}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Typography variant="h5">You don't have any reservations yet</Typography>
                    <Button
                        variant="contained"
                        component={Link}
                        to="/reservations"
                        className={styles.createButton}
                    >
                        Create Reservation
                    </Button>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={styles.content}
                >
                    <div className={styles.reservationsList}>
                        {data?.items.map((reservation: ReservationDto, index) => {
                            const reservationDate = dayjs(reservation.reservationDate);
                            const isFutureReservation = reservationDate.isAfter(today);
                            const isReservationPaid = reservation.paymentStatus === "PAID";

                            return (
                                <motion.div
                                    key={reservation.reservationId}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className={styles.reservationCard}>
                                        <div className={styles.cardContent}>
                                            <div className={styles.cardHeader}>
                                                <div className={styles.facilityIcon}>
                                                    <LocationOn />
                                                </div>
                                                <div className={styles.headerInfo}>
                                                    <Typography variant="h6">
                                                        {reservation.objectType.type}
                                                    </Typography>
                                                    <Typography variant="subtitle2" color="textSecondary">
                                                        Reservation #{reservation.reservationId}
                                                    </Typography>
                                                </div>
                                                <div className={`${styles.status} ${isFutureReservation ? styles.upcoming : styles.past}`}>
                                                    {isFutureReservation ? 'Upcoming' : 'Past'}
                                                </div>
                                            </div>

                                            <div className={styles.details}>
                                                <div className="flex flex-col gap-4">
                                                    <div className={styles.detailItem}>
                                                        <CalendarMonth className={styles.icon} />
                                                        <Typography>
                                                            {dayjs(reservation.reservationDate).format('MMM D, YYYY')}
                                                        </Typography>
                                                    </div>

                                                    <div className={styles.detailItem}>
                                                        <AccessTime className={styles.icon} />
                                                        <Typography>
                                                            {reservation.reservationStart} - {reservation.reservationEnd}
                                                        </Typography>
                                                    </div>

                                                    <div className={styles.detailItem}>
                                                        <Payment className={styles.icon} />
                                                        <div className={styles.paymentInfo}>
                                                            <Typography>
                                                                ${reservation.price.toFixed(2)}
                                                            </Typography>
                                                            <div className={`${styles.paymentStatus} ${isReservationPaid ? styles.paid : styles.unpaid}`}>
                                                                {reservation.paymentStatus}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className={styles.detailItem}>
                                                        <div className={styles.reservedAtInfo}>
                                                            <Typography variant="body2" color="textSecondary">
                                                                Reserved on
                                                            </Typography>
                                                            <Typography>
                                                                {dayjs(reservation.reservedAt).format('MMM D, YYYY')}
                                                            </Typography>
                                                        </div>
                                                        <CalendarToday className={styles.icon} />
                                                    </div>
                                                </div>
                                            </div>
                                            {(isFutureReservation || !isReservationPaid) && (
                                                <div className={styles.actions}>
                                                    {isFutureReservation && (
                                                        <Button
                                                            variant="outlined"
                                                            color="error"
                                                            onClick={() => handleCancelReservation(reservation.reservationId)}
                                                            startIcon={<Cancel />}
                                                            className={styles.cancelButton}
                                                        >
                                                            Cancel Reservation
                                                        </Button>
                                                    )}
                                                    {!isReservationPaid && (
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={() => handleReservationPayment(reservation.reservationId)}
                                                            startIcon={<Payment />}
                                                            className={styles.payButton}
                                                        >
                                                            Pay Now
                                                        </Button>
                                                    )}
                                                </div>
                                            )}
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

export default ClientReservations;

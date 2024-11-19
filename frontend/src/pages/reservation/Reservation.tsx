import { useRef, useState } from "react";
import ReservationsWeek from "./components/weekly/ReservationsWeek";
import { Alert, Button, CircularProgress, Snackbar } from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { calculateTimeRangeAndPrice, CreateReservationData, CreateReservationErrorResponse, CreateReservationResponse, ObjectTypeDto, ReservationContext, useCreateReservation, useGetAllObjectTypes } from "./reservationsService";
import { AxiosError } from "axios";
import styles from "./Reservation.module.scss"
import { Link } from "react-router-dom";

const Reservation: React.FC = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showError, setShowError] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null); // Stan dla wiadomości sukcesu
    const [showSuccess, setShowSuccess] = useState<boolean>(false); // Stan dla widoczności sukcesu
    const [step, setStep] = useState<number>(1);
    const [selectedObjectId, setSelectedObjectId] = useState<number | null>(null);

    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    const scrollRef = useRef<HTMLDivElement>(null);

    const nextStep = () => {
        setStep(prevStep => prevStep + 1);
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const prevStep = () => {
        setStep(prevStep => prevStep - 1);
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const objectTypes = useGetAllObjectTypes();

    // context for selecting hours
    const [selectedHours, setSelectedHours] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>('');

    const addSelectedHour = (hour: string) => {
        setSelectedHours((prev) => [...prev, hour]);
    };

    const removeSelectedHour = (hour: string) => {
        setSelectedHours((prev) => prev.filter((h) => h !== hour));
    };

    const { startTime, endTime, price } = calculateTimeRangeAndPrice(selectedHours);

    const [payNow, setPayNow] = useState<boolean>(true);

    // mutation
    const createReservationMutation = useCreateReservation();

    const createReservation = async () => {
        const reservationData: CreateReservationData = {
            reservationStart: startTime,
            reservationEnd: endTime,
            reservationDate: selectedDate,
            price: price,
            objectId: selectedObjectId,
            userId: localStorage.getItem("userId"),
            isPaid: payNow,
        }

        try {
            createReservationMutation.mutate(reservationData, {
                onSuccess: (data: CreateReservationResponse) => {
                    console.log(`Successfully created reservation`);
                    setSuccessMessage(data.message);
                    setShowSuccess(true);
                },
                onError: (error: AxiosError<CreateReservationErrorResponse>) => {
                    console.error(`Error creating reservation`, error);
                    if (error.response?.data?.error) {
                        setErrorMessage(error.response.data.error);
                        setShowError(true);
                    }
                }
            })
        }
        catch (error) {
            console.log(error)
        }
    }

    const handleCloseSnackbar = () => {
        setShowError(false);
        setErrorMessage(null);
        setShowSuccess(false);
        setSuccessMessage(null);
    };

    return (
        <ReservationContext.Provider value={{ selectedDate, setSelectedDate, selectedHours, addSelectedHour, removeSelectedHour, payNow, setPayNow }}>
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
            {step === 1 && (
                <div className={styles.reservationStep}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>Reservation Page</h1>
                        <Button
                            variant="outlined"
                            endIcon={<ArrowForwardIcon />}
                            onClick={nextStep}
                            disabled={!selectedObjectId}
                            className={styles.nextButton}
                        >
                            Next
                        </Button>
                    </div>

                    {objectTypes.data ? (
                        <div className={styles.objectSelection}>
                            <label htmlFor="object-select" className={styles.label}>
                                Select Object:
                            </label>
                            <select
                                id="object-select"
                                onChange={(e) => setSelectedObjectId(Number(e.target.value))}
                                value={selectedObjectId ?? ''}
                                className={styles.select}
                            >
                                <option value="" disabled>
                                    Select an object
                                </option>
                                {objectTypes.data.map((object: ObjectTypeDto) => (
                                    <option key={object.objectId} value={object.objectId}>
                                        {object.type} - {object.description}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <div className={styles.loading}>
                            <CircularProgress />
                        </div>
                    )}
                </div>
            )}
            {step === 2 && (
                <>
                    <div className="flex justify-between">
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={prevStep}
                            className={styles.prevButton}
                        >
                            Back
                        </Button>
                        <Button
                            variant="outlined"
                            endIcon={<ArrowForwardIcon />}
                            onClick={nextStep}
                            disabled={selectedHours.length === 0}
                            className={styles.nextButton}
                        >
                            Next
                        </Button>
                    </div>
                    {selectedObjectId !== null && (
                        <ReservationsWeek date={formattedDate} objectId={selectedObjectId} />
                    )}
                </>
            )}

            {step === 3 && (() => {
                const selectedObject = objectTypes.data?.find(
                    (obj) => obj.objectId === selectedObjectId
                );

                return (
                    <div className={styles.reservationSummary}>
                        {!createReservationMutation.isSuccess && (
                            <Button
                                variant="outlined"
                                startIcon={<ArrowBackIcon />}
                                onClick={prevStep}
                                className={styles.prevButton}
                                disabled={createReservationMutation.isSuccess}
                            >
                                Back
                            </Button>)
                        }

                        <div className={styles.confirmationCard}>
                            <h1 className={styles.title}>Confirm Reservation</h1>
                            <div className={styles.details}>
                                <p><strong>Start time:</strong> {startTime}</p>
                                <p><strong>End time:</strong> {endTime}</p>
                                <p><strong>Date:</strong> {selectedDate}</p>
                                <p><strong>Price:</strong> {price}</p>
                                <p>
                                    <strong>Object:</strong> {selectedObject?.type || 'Unknown'}
                                </p>
                                <p>
                                    <strong>Name:</strong> {localStorage.getItem("firstName") || 'Unknown'}{' '}
                                    {localStorage.getItem("lastName")}
                                </p>
                                <p>
                                    <strong>Pay now:</strong> {payNow ? 'Yes' : 'No'}
                                </p>
                            </div>
                            <div className="flex flex-col items-center gap-8">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={createReservation}
                                    className={styles.createButton}
                                    disabled={createReservationMutation.isSuccess}
                                >
                                    Create
                                </Button>
                                {createReservationMutation.isSuccess && (
                                    <Link to="/profile">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            className={styles.redirectButton}
                                            disabled={!createReservationMutation.isSuccess}
                                        >
                                            Go to profile
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })()}

            <div ref={scrollRef}></div>
        </ReservationContext.Provider>
    );
};

export default Reservation;

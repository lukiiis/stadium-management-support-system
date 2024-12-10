import { useEffect, useRef, useState } from "react";
import ReservationsWeek from "./components/weekly/ReservationsWeek";
import { Alert, AlertColor, Box, Button, CircularProgress, FormControl, FormControlLabel, InputLabel, MenuItem, Paper, Select, Snackbar, Stack, Step, StepLabel, Stepper, styled, Switch, Typography } from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { calculateTimeRangeAndPrice, CreateReservationData, ReservationContext, useCreateReservation, useGetAllObjectTypes } from "./reservationsService";
import { AxiosError } from "axios";
import styles from "./Reservation.module.scss"
import { ApiErrorResponse, ApiSuccessResponse } from "../../shared/types/api/apiResponse";
import { ObjectTypeDto } from "../../shared/types/models/objectType";
import { AnimatePresence, motion } from "framer-motion";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    borderRadius: 16,
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
}));

const Reservation: React.FC = () => {
    const [userId, setUserId] = useState<number | null>(null);
    const [isClient, setIsClient] = useState<boolean>(false);

    useEffect(() => {
        const role = localStorage.getItem("role");
        const token = localStorage.getItem("token");
        const storedUserId = localStorage.getItem("userId");

        if (role === "CLIENT" && token && storedUserId) {
            setIsClient(true);
            setUserId(parseInt(storedUserId, 10));
        }
    }, []);

    const nextStepCheckToken = () => {
        if (!isClient) {
            setSnackbarSeverity("error");
            setSnackbarMessage("You have to be logged in to continue");
            setShowSnackbar(true);
        }
        else {
            setStep(prevStep => prevStep + 1);
            scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const [step, setStep] = useState<number>(1);
    const [selectedObjectId, setSelectedObjectId] = useState<number | null>(null);
    const [date, setDate] = useState<Date>(new Date());
    const [formattedDate, setFormattedDate] = useState<string>(
        `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`
    );
    const [snackbarSeverity, setSnackbarSeverity] = useState<string>("error")
    const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
    const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setFormattedDate(
            `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        );
    }, [date]);

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
            userId: userId,
            isPaid: payNow,
        }

        createReservationMutation.mutate(reservationData, {
            onSuccess: (data: ApiSuccessResponse) => {
                setSnackbarSeverity("success");
                setSnackbarMessage(data.message);
                setShowSnackbar(true);
            },
            onError: (error: AxiosError<ApiErrorResponse>) => {
                setSnackbarSeverity("error");
                setSnackbarMessage(error.response?.data.error || "Failed to create reservation");
                setShowSnackbar(true);
            }
        })
    }

    const handleCloseSnackbar = () => {
        setShowSnackbar(false);
        setSnackbarMessage(null);
    };

    //handling weeks
    const handleNextWeek = () => {
        const newDate = new Date(date);
        newDate.setDate(date.getDate() + 7);
        setDate(newDate);
    };

    const handlePreviousWeek = () => {
        const newDate = new Date(date);
        newDate.setDate(date.getDate() - 7);
        setDate(newDate);
    };

    const isPreviousWeekDisabled = (): boolean => {
        const today = new Date();
        return date <= today;
    };

    return (
        <ReservationContext.Provider value={{ selectedDate, setSelectedDate, selectedHours, addSelectedHour, removeSelectedHour, payNow, setPayNow }}>
            <div className={styles.pageContainer} ref={scrollRef}>
                <div className={styles.wrapper}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full"
                    >
                        <Stepper activeStep={step - 1} className={styles.stepper} alternativeLabel>
                            {['Select Facility', 'Choose Time', 'Confirm Details'].map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <StyledPaper elevation={0}>
                                    {/* Step 1: Facility Selection */}
                                    {step === 1 && (
                                        <Box className={styles.stepContent}>
                                            <div className={styles.stepTitle}>
                                                Select Your Facility
                                            </div>

                                            {objectTypes.data ? (
                                                <>
                                                    <FormControl fullWidth variant="outlined">
                                                        <InputLabel>Facility Type</InputLabel>
                                                        <Select
                                                            value={selectedObjectId ?? ''}
                                                            onChange={(e) => setSelectedObjectId(Number(e.target.value))}
                                                            label="Facility Type"
                                                        >
                                                            <MenuItem value="" disabled>
                                                                Select a facility
                                                            </MenuItem>
                                                            {objectTypes.data.map((object: ObjectTypeDto) => (
                                                                <MenuItem key={object.objectId} value={object.objectId}>
                                                                    {object.type} - {object.description}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.5 }}
                                                        className={selectedObjectId && objectTypes.data ? styles.imageContainer : styles.imageContainerEmpty}
                                                    >
                                                        {selectedObjectId && objectTypes.data && (

                                                            <img
                                                                src={objectTypes.data.find(obj => obj.objectId === selectedObjectId)?.imageUrl}
                                                                alt="Selected facility"
                                                                className={styles.facilityImage}
                                                            />

                                                        )}
                                                    </motion.div>
                                                </>
                                            ) : (
                                                <Box className={styles.loading}>
                                                    <CircularProgress />
                                                </Box>
                                            )}
                                        </Box>
                                    )}

                                    {/* Step 2: Time Selection */}
                                    {step === 2 && (
                                        <Box className={styles.stepContent}>
                                            <div className={styles.stepTitle}>
                                                Select Time Slots
                                            </div>

                                            <Box className={styles.weekNavigation}>
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<ArrowBackIcon />}
                                                    onClick={handlePreviousWeek}
                                                    disabled={isPreviousWeekDisabled()}
                                                >
                                                    Previous Week
                                                </Button>
                                                <Typography variant="h6">
                                                    {dayjs(date).format('MMMM YYYY')}
                                                </Typography>
                                                <Button
                                                    variant="outlined"
                                                    endIcon={<ArrowForwardIcon />}
                                                    onClick={handleNextWeek}
                                                >
                                                    Next Week
                                                </Button>
                                            </Box>

                                            <Box className={styles.weekCalendar}>
                                                <ReservationsWeek
                                                    date={formattedDate}
                                                    objectId={selectedObjectId as number}
                                                />
                                            </Box>
                                        </Box>
                                    )}

                                    {/* Step 3: Confirmation */}
                                    {step >= 3 && (
                                        <Box className={styles.stepContent}>
                                            <div className={styles.stepTitle}>
                                                Confirm Reservation
                                            </div>

                                            <Paper className={styles.confirmationCard}>
                                                <Box className={styles.details}>
                                                    <Typography variant="h6" mb={3}>Reservation Details</Typography>

                                                    <Stack spacing={3}>
                                                        <Box display="flex" gap={4}>
                                                            <Stack spacing={2} flex={1}>
                                                                <Typography><strong>Date:</strong> {selectedDate}</Typography>
                                                                <Typography><strong>Start Time:</strong> {startTime}</Typography>
                                                                <Typography><strong>End Time:</strong> {endTime}</Typography>
                                                            </Stack>

                                                            <Stack spacing={2} flex={1}>
                                                                <Typography><strong>Facility:</strong> {objectTypes.data?.find(obj => obj.objectId === selectedObjectId)?.type}</Typography>
                                                                <Typography><strong>Price:</strong> ${price}</Typography>
                                                                <Typography><strong>Payment:</strong> {payNow ? 'Pay Now' : 'Pay Later'}</Typography>
                                                            </Stack>
                                                        </Box>

                                                        <FormControlLabel
                                                            control={
                                                                <Switch
                                                                    checked={payNow}
                                                                    disabled={createReservationMutation.isSuccess}
                                                                    onChange={(e) => setPayNow(e.target.checked)}
                                                                    color="primary"
                                                                />
                                                            }
                                                            label="Pay Now"
                                                        />
                                                    </Stack>
                                                </Box>
                                            </Paper>
                                        </Box>
                                    )}

                                    {/* Navigation Buttons */}
                                    <Box className={styles.navigationButtons}>
                                        {step > 1 && (
                                            createReservationMutation.isSuccess ? (
                                                <Button
                                                    variant="outlined"
                                                    component={Link}
                                                    to="/profile/reservations"
                                                    startIcon={<ArrowForwardIcon />}
                                                    className={styles.navButton}
                                                >
                                                    My profile
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="outlined"
                                                    onClick={prevStep}
                                                    startIcon={<ArrowBackIcon />}
                                                    className={styles.navButton}
                                                    disabled={step === 3 && createReservationMutation.isSuccess}
                                                >
                                                    Back
                                                </Button>
                                            )
                                        )}

                                        {step < 3 ? (
                                            <Button
                                                variant="contained"
                                                onClick={step === 1 ? nextStep : nextStepCheckToken}
                                                endIcon={<ArrowForwardIcon />}
                                                disabled={!selectedObjectId || (step === 2 && selectedHours.length === 0)}
                                                className={styles.navButton}
                                            >
                                                Continue
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="contained"
                                                onClick={createReservation}
                                                disabled={createReservationMutation.isSuccess}
                                                className={styles.submitButton}
                                            >
                                                {createReservationMutation.isPending ? (
                                                    <CircularProgress size={24} color="inherit" />
                                                ) : (
                                                    'Confirm Reservation'
                                                )}
                                            </Button>
                                        )}
                                    </Box>
                                </StyledPaper>
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>

                    <Snackbar
                        open={showSnackbar}
                        autoHideDuration={6000}
                        onClose={handleCloseSnackbar}
                        anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    >
                        <Alert
                            onClose={handleCloseSnackbar}
                            severity={snackbarSeverity as AlertColor}
                            variant="filled"
                            elevation={6}
                        >
                            {snackbarMessage}
                        </Alert>
                    </Snackbar>
                </div>
            </div>
        </ReservationContext.Provider>
    );
};

export default Reservation;

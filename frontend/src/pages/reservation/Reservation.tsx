import { useRef, useState } from "react";
import ReservationsWeek from "./components/weekly/ReservationsWeek";
import { Button, CircularProgress } from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { calculateTimeRangeAndPrice, CreateReservationData, CreateReservationResponse, ObjectTypeDto, ReservationContext, useCreateReservation, useGetAllObjectTypes } from "./reservationsService";

const Reservation: React.FC = () => {
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
    const [createReservationInfo, setCreateReservationInfo] = useState<string>('');
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

        try{
            createReservationMutation.mutate(reservationData, {
                onSuccess: (data: CreateReservationResponse) => {
                    setCreateReservationInfo(data.message);
                }
            })
        }
        catch (error) {
            console.log(error)
        }
    }

    return (
        <ReservationContext.Provider value={{ selectedDate, setSelectedDate, selectedHours, addSelectedHour, removeSelectedHour, payNow, setPayNow }}>
            {step === 1 && (
                <>
                    <div className="flex justify-end">
                        <Button
                            variant="outlined"
                            endIcon={<ArrowForwardIcon />}
                            onClick={nextStep}
                            disabled={!selectedObjectId}
                        >
                            Next
                        </Button>
                    </div>
                    <h1>Reservation Page</h1>

                    {objectTypes.data ? (
                        <div>
                            <label htmlFor="object-select">Select Object:</label>
                            <select
                                id="object-select"
                                onChange={(e) => setSelectedObjectId(Number(e.target.value))}
                                value={selectedObjectId ?? ''}
                            >
                                <option value="" disabled>Select an object</option>
                                {objectTypes.data.map((object: ObjectTypeDto) => (
                                    <option key={object.objectId} value={object.objectId}>
                                        {object.type} - {object.description}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <CircularProgress />
                    )}
                </>
            )}
            {step === 2 && (
                <>
                    <div className="flex justify-between">
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={prevStep}
                        >
                            Back
                        </Button>
                        <Button
                            variant="outlined"
                            endIcon={<ArrowForwardIcon />}
                            onClick={nextStep}
                            disabled={selectedHours.length === 0}
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
                    obj => obj.objectId === selectedObjectId
                );

                return (
                    <>
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={prevStep}
                        >
                            Back
                        </Button>
                        {/* Komponent potwierdzenia rezerwacji */}
                        <h1>Confirm reservation</h1>
                        <p>Start time: {startTime}</p>
                        <p>End time: {endTime}</p>
                        <p>Date: {selectedDate}</p>
                        <p>Price: {price}</p>
                        <p>Object: {selectedObject?.type || 'Unknown'}</p>
                        <p>Name: {localStorage.getItem("firstName") || 'Unknown'} {localStorage.getItem("lastName")}</p>
                        <p>Pay now: {payNow ? 'yes' : 'no'}</p>

                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={createReservation}
                        >
                            Create
                        </Button>
                        {createReservationInfo}
                    </>
                );
            })()}

            <div ref={scrollRef}></div>
        </ReservationContext.Provider>
    );
};

export default Reservation;

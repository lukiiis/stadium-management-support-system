import { useRef, useState } from "react";
import ReservationsWeek from "./components/weekly/ReservationsWeek";
import { Button, CircularProgress } from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ObjectTypeDto, ReservationContext, useGetAllObjectTypes } from "./reservationsService";

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

    return (
        <ReservationContext.Provider value={{ selectedDate, setSelectedDate, selectedHours, addSelectedHour, removeSelectedHour }}>
            {step === 1 && (
                <>
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

                    <div>
                        <Button 
                            variant="outlined" 
                            endIcon={<ArrowForwardIcon />} 
                            onClick={nextStep} 
                            disabled={!selectedObjectId}
                        >
                            Next
                        </Button>
                    </div>
                </>
            )}
            {step === 2 && (
                <>
                    <div>
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
                            disabled={!selectedObjectId}
                        >
                            Next
                        </Button>
                    </div>
                    {selectedObjectId !== null && (
                        <ReservationsWeek date={formattedDate} objectId={selectedObjectId} />
                    )}
                </>
            )}

            <div ref={scrollRef}></div>
        </ReservationContext.Provider>
    );
};

export default Reservation;

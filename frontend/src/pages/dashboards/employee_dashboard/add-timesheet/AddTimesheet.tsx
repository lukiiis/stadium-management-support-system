import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, MenuItem, Select, Button, FormControl, InputLabel, Box, CircularProgress, Snackbar, Alert } from "@mui/material";
import styles from './AddTimesheet.module.scss';
import { CreateReservationTimesheetData, CreateReservationTimesheetErrorResponse, CreateReservationTimesheetResponse, ObjectType, useCreateReservationTimesheet, useGetObjectTypes } from "./addTimesheetService";
import { AxiosError } from "axios";

const AddTimesheet: React.FC = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showError, setShowError] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);

    const handleCloseSnackbar = () => {
        setShowError(false);
        setErrorMessage(null);
        setShowSuccess(false);
        setSuccessMessage(null);
    };

    const { data: objectTypes, isLoading: isLoadingObjects } = useGetObjectTypes();
    const createTimesheetMutation = useCreateReservationTimesheet();

    const { register, handleSubmit, setValue, formState: { errors }, reset, getValues } = useForm<CreateReservationTimesheetData>();

    const onSubmit = (data: CreateReservationTimesheetData) => {
        const formattedData = {
            ...data,
            startTime: `${data.startTime}:00`,
            endTime: `${data.endTime}:00`,
        };
        createTimesheetMutation.mutate(formattedData, {
            onSuccess: (data: CreateReservationTimesheetResponse) => {
                console.log(`Successfully created timesheet`);
                setSuccessMessage(data.message);
                setShowSuccess(true);
                // reset();
            },
            onError: (error: AxiosError<CreateReservationTimesheetErrorResponse>) => {
                console.error(`Error creating timesheet`);
                if (error.response?.data?.error) {
                    setErrorMessage(error.response.data.error);
                    setShowError(true);
                }
                else{
                    setErrorMessage(`Error creating timesheet`);
                    setShowError(true);
                }
            },
        });
    };

    console.log(getValues())

    useEffect(() => {
        if (objectTypes?.length) {
            setValue('objectId', objectTypes[0].objectId);
        }
    }, [objectTypes, setValue]);

    return (
        <div className={styles.formContainer}>
            {/* Snackbar for error messages */}
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

            {isLoadingObjects ? (
                <CircularProgress />
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            {...register("date", { required: "Date is required" })}
                            label="Date"
                            type="date"
                            fullWidth
                            error={!!errors.date}
                            helperText={errors.date?.message}
                        />

                        <TextField
                            {...register("startTime", { required: "Start Time is required" })}
                            label="Start Time"
                            type="time"
                            fullWidth
                            error={!!errors.startTime}
                            helperText={errors.startTime?.message}
                        />

                        <TextField
                            {...register("endTime", { required: "End Time is required" })}
                            label="End Time"
                            type="time"
                            fullWidth
                            error={!!errors.endTime}
                            helperText={errors.endTime?.message}
                        />

                        <FormControl fullWidth error={!!errors.objectId}>
                            <InputLabel>Object</InputLabel>
                            <Select
                                {...register("objectId", { required: "Object is required" })}
                                defaultValue=""
                                label="Object"
                            >
                                {objectTypes?.map((obj: ObjectType) => (
                                    <MenuItem key={obj.objectId} value={obj.objectId}>
                                        {obj.description}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.objectId && <span className={styles.error}>{errors.objectId?.message}</span>}
                        </FormControl>

                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Create Timesheet
                        </Button>
                    </Box>
                </form>
            )}
        </div>
    );
};

export default AddTimesheet;

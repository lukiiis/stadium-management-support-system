import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, MenuItem, Select, Button, FormControl, InputLabel, Box, CircularProgress, Snackbar, Alert } from "@mui/material";
import styles from './AddTournament.module.scss';
import { CreateTournamentData, CreateTournamentErrorResponse, CreateTournamentResponse, ObjectType, useCreateTournament, useGetObjectTypes } from "./addTournamentService";
import { AxiosError } from "axios";

const AddTournament: React.FC = () => {
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
    const createTournamentMutation = useCreateTournament();

    const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<CreateTournamentData>();

    const onSubmit = (data: CreateTournamentData) => {
        createTournamentMutation.mutate(data, {
            onSuccess: (data: CreateTournamentResponse) => {
                console.log(`Successfully created tournament`);
                setSuccessMessage(data.message);
                setShowSuccess(true);
                reset();
            },
            onError: (error: AxiosError<CreateTournamentErrorResponse>) => {
                console.error(`Error creating tournament`);
                if (error.response?.data?.error) {
                    setErrorMessage(error.response.data.error);
                    setShowError(true);
                }
            },
        });
    };

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
                            {...register("sport", { required: "Sport is required" })}
                            label="Sport"
                            fullWidth
                            error={!!errors.sport}
                            helperText={errors.sport?.message}
                        />

                        <TextField
                            {...register("maxSlots", { required: "Max Slots is required", valueAsNumber: true })}
                            label="Max Slots"
                            type="number"
                            fullWidth
                            error={!!errors.maxSlots}
                            helperText={errors.maxSlots?.message}
                        />

                        <TextField
                            {...register("startDate", { required: "Start Date is required" })}
                            label="Start Date"
                            type="date"
                            fullWidth
                            error={!!errors.startDate}
                            helperText={errors.startDate?.message}
                        />

                        <TextField
                            {...register("endDate", { required: "End Date is required" })}
                            label="End Date"
                            type="date"
                            fullWidth
                            error={!!errors.endDate}
                            helperText={errors.endDate?.message}
                        />

                        <TextField
                            {...register("description", { required: "Description is required" })}
                            label="Description"
                            fullWidth
                            error={!!errors.description}
                            helperText={errors.description?.message}
                        />

                        <FormControl fullWidth error={!!errors.objectId}>
                            <InputLabel>Object</InputLabel>
                            <Select
                                {...register("objectId", { required: "Object is required" })}
                                defaultValue="" // Dodaj wartość domyślną
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
                            Create Tournament
                        </Button>
                    </Box>
                </form>
            )}
        </div>
    );
};

export default AddTournament;

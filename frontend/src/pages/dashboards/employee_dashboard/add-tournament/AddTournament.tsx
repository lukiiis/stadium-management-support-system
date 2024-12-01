import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, MenuItem, Select, Button, FormControl, InputLabel, Box, CircularProgress, Snackbar, Alert, Typography, Card, CardContent, Pagination } from "@mui/material";
import styles from './AddTournament.module.scss';
import { useCreateTournament, useGetObjectTypes, useGetPaginatedTournaments } from "./addTournamentService";
import { AxiosError } from "axios";
import { CreateTournamentData, TournamentDto } from "../../../../shared/types/models/tournament";
import { ApiErrorResponse, ApiSuccessResponse } from "../../../../shared/types/api/apiResponse";
import { ObjectTypeDto } from "../../../../shared/types/models/objectType";

const AddTournament: React.FC = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showError, setShowError] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);
    const [page, setPage] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const pageSize = 5;

    const handleCloseSnackbar = () => {
        setShowError(false);
        setErrorMessage(null);
        setShowSuccess(false);
        setSuccessMessage(null);
    };

    const { data: objectTypes, isLoading: isLoadingObjects } = useGetObjectTypes();
    const createTournamentMutation = useCreateTournament();
    const { data: paginatedTournaments, isLoading: isLoadingTournaments, refetch } = useGetPaginatedTournaments(page - 1, pageSize);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateTournamentData>();

    const onSubmit = (data: CreateTournamentData) => {
        createTournamentMutation.mutate(data, {
            onSuccess: (data: ApiSuccessResponse) => {
                console.log(`Successfully created tournament`);
                setSuccessMessage(data.message);
                setShowSuccess(true);
                setShowForm(false);
                refetch();
                // reset();
            },
            onError: (error: AxiosError<ApiErrorResponse>) => {
                console.error(`Error creating tournament`);
                if (error.response?.data?.error) {
                    setErrorMessage(error.response.data.error);
                    setShowError(true);
                }
                else{
                    setErrorMessage(`Error creating tournament`);
                    setShowError(true);
                }
            },
        });
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

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

            {isLoadingTournaments ? (
                <CircularProgress />
            ) : (
                <div className={styles.tournamentList}>
                    {paginatedTournaments?.items.map((tournament: TournamentDto) => (
                        <Card key={tournament.tournamentId} className={styles.tournamentCard}>
                            <CardContent>
                                <Typography variant="h6">Tournament #{tournament.tournamentId}</Typography>
                                <Typography variant="body1"><strong>Sport:</strong> {tournament.sport}</Typography>
                                <Typography variant="body1"><strong>Max Slots:</strong> {tournament.maxSlots}</Typography>
                                <Typography variant="body1"><strong>Occupied Slots:</strong> {tournament.occupiedSlots}</Typography>
                                <Typography variant="body1"><strong>Start Date:</strong> {tournament.startDate}</Typography>
                                <Typography variant="body1"><strong>End Date:</strong> {tournament.endDate}</Typography>
                                <Typography variant="body1"><strong>Description:</strong> {tournament.description}</Typography>
                                <Typography variant="body1"><strong>Object:</strong> {tournament.objectType.type}</Typography>
                            </CardContent>
                        </Card>
                    ))}
                    <Pagination
                        count={Math.ceil((paginatedTournaments?.totalCount || 1) / pageSize)}
                        page={page}
                        onChange={handlePageChange}
                        className={styles.pagination}
                        color="primary"
                        size="large"
                    />
                </div>
            )}

            <Button variant="contained" color="primary" onClick={() => setShowForm(!showForm)}>
                Add new tournament
            </Button>

            {showForm && (
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
                                defaultValue=""
                                label="Object"
                            >
                                {objectTypes?.map((obj: ObjectTypeDto) => (
                                    <MenuItem key={obj.objectId} value={obj.objectId}>
                                        {obj.description}
                                    </MenuItem>
                                ))}
                            </Select>
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
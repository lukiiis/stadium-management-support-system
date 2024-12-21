import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, MenuItem, Select, Button, FormControl, InputLabel, Box, CircularProgress, Snackbar, Alert, Typography, Pagination } from "@mui/material";
import styles from './AddTournament.module.scss';
import CloseIcon from '@mui/icons-material/Close';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import AddIcon from '@mui/icons-material/Add';
import { useCreateTournament, useGetObjectTypes, useGetPaginatedTournaments } from "./addTournamentService";
import { AxiosError } from "axios";
import { CreateTournamentData, TournamentDto } from "../../../../shared/types/models/tournament";
import { ApiErrorResponse, ApiSuccessResponse } from "../../../../shared/types/api/apiResponse";
import { ObjectTypeDto } from "../../../../shared/types/models/objectType";
import { AnimatePresence, motion } from "framer-motion";

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

    const { data: objectTypes } = useGetObjectTypes();
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
                reset();
            },
            onError: (error: AxiosError<ApiErrorResponse>) => {
                console.error(`Error creating tournament`);
                if (error.response?.data?.error) {
                    setErrorMessage(error.response.data.error);
                    setShowError(true);
                }
                else {
                    setErrorMessage(`Error creating tournament`);
                    setShowError(true);
                }
            },
        });
    };

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    return (
        <motion.div
            className={styles.formContainer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography
                    variant="h4"
                    sx={{
                        background: 'linear-gradient(45deg, #1976d2, #2196f3)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                        fontWeight: 600
                    }}
                >
                    Create Tournament
                </Typography>
                <Button
                    variant="contained"
                    startIcon={showForm ? <CloseIcon /> : <AddIcon />}
                    className={styles.button}
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Cancel' : 'Add Tournament'}
                </Button>
            </Box>

            <AnimatePresence>
                {showForm && (
                    <motion.form
                        onSubmit={handleSubmit(onSubmit)}
                        className={styles.form}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
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
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                {...register("endDate", { required: "End Date is required" })}
                                label="End Date"
                                type="date"
                                fullWidth
                                error={!!errors.endDate}
                                helperText={errors.endDate?.message}
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                {...register("description", { required: "Description is required" })}
                                label="Description"
                                multiline
                                rows={4}
                                fullWidth
                                error={!!errors.description}
                                helperText={errors.description?.message}
                            />
                            <FormControl fullWidth error={!!errors.objectId}>
                                <InputLabel>Object</InputLabel>
                                <Select
                                    {...register("objectId", { required: "Object is required" })}
                                    label="Object"
                                    defaultValue=""
                                >
                                    {objectTypes?.map((type: ObjectTypeDto) => (
                                        <MenuItem key={type.objectId} value={type.objectId}>
                                            {type.type}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.objectId && (
                                    <Typography className={styles.error}>
                                        {errors.objectId.message}
                                    </Typography>
                                )}
                            </FormControl>
                            <Button
                                type="submit"
                                variant="contained"
                                className={styles.button}
                                disabled={createTournamentMutation.isPending}
                            >
                                {createTournamentMutation.isPending ? (
                                    <CircularProgress size={24} />
                                ) : (
                                    'Create Tournament'
                                )}
                            </Button>
                        </Box>
                    </motion.form>
                )}
            </AnimatePresence>

            {isLoadingTournaments ? (
                <div className={styles.loading}>
                    <div className={styles.spinner} />
                </div>
            ) : (
                <motion.div
                    className={styles.tournamentList}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {paginatedTournaments?.items.map((tournament: TournamentDto) => (
                        <motion.div
                            key={tournament.tournamentId}
                            className={styles.tournamentCard}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <SportsTennisIcon sx={{ color: '#1976d2' }} />
                                <Box>
                                    <Typography variant="h6">{tournament.sport}</Typography>
                                    <Typography color="textSecondary">
                                        Sport: {tournament.sport}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        Slots: {tournament.maxSlots}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        Dates: {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
                                    </Typography>
                                </Box>
                            </Box>

                        </motion.div>
                    ))}

                    {paginatedTournaments && paginatedTournaments.totalCount > 1 && (
                        <Box className={styles.pagination}>
                            <Pagination
                                count={Math.ceil((paginatedTournaments?.totalCount || 1) / pageSize)}
                                page={page}
                                onChange={handlePageChange}
                                color="primary"
                            />
                        </Box>
                    )}
                </motion.div>
            )}

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
        </motion.div>
    );
};

export default AddTournament;
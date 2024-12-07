import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, MenuItem, Select, Button, FormControl, InputLabel, Box, CircularProgress, Snackbar, Alert, Typography, Pagination } from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import styles from './AddTimesheet.module.scss';
import { useCreateReservationTimesheet, useGetObjectTypes, useGetPaginatedTimesheets, useUpdateReservationTimesheet } from "./addTimesheetService";
import { AxiosError } from "axios";
import { CreateReservationTimesheetData, ReservationTimesheetDto, UpdateReservationTimesheetData } from "../../../../shared/types/models/reservationTimesheet";
import { ApiErrorResponse, ApiSuccessResponse } from "../../../../shared/types/api/apiResponse";
import { AnimatePresence, motion } from "framer-motion";
import { ObjectTypeDto } from "../../../../shared/types/models/objectType";

const AddTimesheet: React.FC = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showError, setShowError] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);
    const [page, setPage] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const [editingTimesheetId, setEditingTimesheetId] = useState<number>();
    const pageSize = 10;

    const handleCloseSnackbar = () => {
        setShowError(false);
        setErrorMessage(null);
        setShowSuccess(false);
        setSuccessMessage(null);
    };

    const { data: objectTypes, isLoading: isLoadingObjects } = useGetObjectTypes();
    const createTimesheetMutation = useCreateReservationTimesheet();
    const updateTimesheetMutation = useUpdateReservationTimesheet();
    const { data: paginatedTimesheets, isLoading: isLoadingTimesheets, refetch } = useGetPaginatedTimesheets(page - 1, pageSize);

    const { register: registerCreate, handleSubmit: handleSubmitCreate, formState: { errors: errorsCreate }, reset: resetCreate } = useForm<CreateReservationTimesheetData>();
    const { register: registerUpdate, handleSubmit: handleSubmitUpdate, formState: { errors: errorsUpdate }, reset: resetUpdate } = useForm<UpdateReservationTimesheetData>();

    const onSubmitCreate = (data: CreateReservationTimesheetData) => {
        const formattedData = {
            ...data,
            startTime: `${data.startTime}:00`,
            endTime: `${data.endTime}:00`,
        };
        createTimesheetMutation.mutate(formattedData, {
            onSuccess: (data: ApiSuccessResponse) => {
                console.log(`Successfully created timesheet`);
                setSuccessMessage(data.message);
                setShowSuccess(true);
                setShowForm(false);
                refetch();
                resetCreate();
            },
            onError: (error: AxiosError<ApiErrorResponse>) => {
                console.error(`Error creating timesheet`);
                if (error.response?.data?.error) {
                    setErrorMessage(error.response.data.error);
                    setShowError(true);
                }
                else {
                    setErrorMessage(`Error creating timesheet`);
                    setShowError(true);
                }
            },
        });
    };

    const onSubmitUpdate = (data: UpdateReservationTimesheetData) => {
        const formattedData = {
            ...data,
            timesheetId: editingTimesheetId as number,
            startTime: `${data.startTime}:00`,
            endTime: `${data.endTime}:00`,
        };

        updateTimesheetMutation.mutate(formattedData, {
            onSuccess: (data: ApiSuccessResponse) => {
                console.log(`Successfully updated timesheet`);
                setSuccessMessage(data.message);
                setShowSuccess(true);
                setEditingTimesheetId(-1);
                refetch();
                resetUpdate();
            },
            onError: (error: AxiosError<ApiErrorResponse>) => {
                console.error(`Error updating timesheet`);
                if (error.response?.data?.error) {
                    setErrorMessage(error.response.data.error);
                    setShowError(true);
                }
                else {
                    setErrorMessage(`Error updating timesheet`);
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
            <div className={styles.header}>
                <Typography variant="h2">Timesheets</Typography>
                <Button
                    variant="contained"
                    className={styles.button}
                    startIcon={showForm ? <CloseIcon /> : <AddIcon />}
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Cancel' : 'Add New Timesheet'}
                </Button>
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={styles.form}
                    >
                        {isLoadingObjects ? (
                            <div className={styles.loading}>
                                <div className={styles.spinner} />
                            </div>
                        ) : (
                            <form onSubmit={handleSubmitCreate(onSubmitCreate)}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <TextField
                                        {...registerCreate("date")}
                                        type="date"
                                        label="Date"
                                        defaultValue={new Date().toISOString().split('T')[0]}
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        error={!!errorsCreate.date}
                                        helperText={errorsCreate.date?.message}
                                    />
                                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                        <TextField
                                            {...registerCreate("startTime")}
                                            label="Start Time"
                                            type="time"
                                            defaultValue="08:00"
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                            error={!!errorsCreate.startTime}
                                            helperText={errorsCreate.startTime?.message}
                                        />
                                        <TextField
                                            {...registerCreate("endTime")}
                                            label="End Time"
                                            type="time"
                                            defaultValue="22:00"
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                            error={!!errorsCreate.endTime}
                                            helperText={errorsCreate.endTime?.message}
                                        />
                                    </Box>
                                    <FormControl fullWidth error={!!errorsCreate.objectId}>
                                        <InputLabel>Facility</InputLabel>
                                        <Select
                                            {...registerCreate("objectId")}
                                            label="Facility"
                                            defaultValue=""
                                        >
                                            {objectTypes?.map((type: ObjectTypeDto) => (
                                                <MenuItem key={type.objectId} value={type.objectId}>
                                                    {type.type}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        className={styles.button}
                                        disabled={createTimesheetMutation.isPending}
                                    >
                                        {createTimesheetMutation.isPending ? (
                                            <CircularProgress size={24} />
                                        ) : (
                                            'Create Timesheet'
                                        )}
                                    </Button>
                                </Box>
                            </form>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {isLoadingTimesheets ? (
                <div className={styles.loading}>
                    <div className={styles.spinner} />
                </div>
            ) : (
                <motion.div
                    className={styles.timesheetList}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {paginatedTimesheets?.items.map((timesheet: ReservationTimesheetDto) => (
                        <motion.div
                            key={timesheet.timesheetId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className={styles.timesheetCard}>
                                <div className={styles.cardContent}>
                                    <div className={styles.cardHeader}>
                                        <Typography variant="h6">
                                            Timesheet #{timesheet.timesheetId}
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={editingTimesheetId === timesheet.timesheetId ? <CloseIcon /> : <EditIcon />}
                                            onClick={() => editingTimesheetId === timesheet.timesheetId
                                                ? setEditingTimesheetId(-1)
                                                : setEditingTimesheetId(timesheet.timesheetId)}
                                        >
                                            {editingTimesheetId === timesheet.timesheetId ? 'Cancel' : 'Edit'}
                                        </Button>
                                    </div>

                                    <div className={styles.cardBody}>
                                        <div className={styles.fieldGroup}>
                                            <DateRangeIcon color="primary" />
                                            <Typography><strong>Date:</strong> {timesheet.date}</Typography>
                                        </div>

                                        {editingTimesheetId === timesheet.timesheetId ? (
                                            <form onSubmit={handleSubmitUpdate(onSubmitUpdate)} className={styles.editForm}>
                                                <TextField
                                                    {...registerUpdate("startTime")}
                                                    label="Start Time"
                                                    type="time"
                                                    fullWidth
                                                    defaultValue={timesheet.startTime.slice(0, 5)}
                                                    InputLabelProps={{ shrink: true }}
                                                    error={!!errorsUpdate.startTime}
                                                    helperText={errorsUpdate.startTime?.message}
                                                />
                                                <TextField
                                                    {...registerUpdate("endTime")}
                                                    label="End Time"
                                                    type="time"
                                                    fullWidth
                                                    defaultValue={timesheet.endTime.slice(0, 5)}
                                                    InputLabelProps={{ shrink: true }}
                                                    error={!!errorsUpdate.endTime}
                                                    helperText={errorsUpdate.endTime?.message}
                                                />
                                                <div className={styles.actionButtons}>
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        className={styles.button}
                                                        disabled={updateTimesheetMutation.isPending}
                                                    >
                                                        {updateTimesheetMutation.isPending ? (
                                                            <CircularProgress size={24} />
                                                        ) : (
                                                            'Update'
                                                        )}
                                                    </Button>
                                                </div>
                                            </form>
                                        ) : (
                                            <>
                                                <div className={styles.fieldGroup}>
                                                    <AccessTimeIcon color="primary" />
                                                    <Typography><strong>Time:</strong> {timesheet.startTime.slice(0, 5)} - {timesheet.endTime.slice(0, 5)}</Typography>
                                                </div>
                                                <Typography><strong>Facility:</strong> {timesheet.objectType.type}</Typography>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
            {paginatedTimesheets && paginatedTimesheets.totalCount > 1 && (
                <div className={styles.pagination}>
                    <Pagination
                        count={Math.ceil((paginatedTimesheets.totalCount || 1) / pageSize)}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                    />
                </div>
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

export default AddTimesheet;
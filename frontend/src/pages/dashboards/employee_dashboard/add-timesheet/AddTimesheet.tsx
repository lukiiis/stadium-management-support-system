import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, MenuItem, Select, Button, FormControl, InputLabel, Box, CircularProgress, Snackbar, Alert, Typography, Card, CardContent, Pagination } from "@mui/material";
import styles from './AddTimesheet.module.scss';
import { useCreateReservationTimesheet, useGetObjectTypes, useGetPaginatedTimesheets, useUpdateReservationTimesheet } from "./addTimesheetService";
import { AxiosError } from "axios";
import { CreateReservationTimesheetData, ReservationTimesheetDto, UpdateReservationTimesheetData } from "../../../../shared/types/models/reservationTimesheet";
import { ApiErrorResponse, ApiSuccessResponse } from "../../../../shared/types/api/apiResponse";

const AddTimesheet: React.FC = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showError, setShowError] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);
    const [page, setPage] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const [editingTimesheetId, setEditingTimesheetId] = useState<number | null>(null);
    const pageSize = 5;

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
            startTime: `${data.startTime}:00`,
            endTime: `${data.endTime}:00`,
        };
        console.log(formattedData)
        updateTimesheetMutation.mutate(formattedData, {
            onSuccess: (data: ApiSuccessResponse) => {
                console.log(`Successfully updated timesheet`);
                setSuccessMessage(data.message);
                setShowSuccess(true);
                setEditingTimesheetId(null);
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

            {isLoadingTimesheets ? (
                <CircularProgress />
            ) : (
                <div className={styles.timesheetList}>
                    {paginatedTimesheets?.items.map((timesheet: ReservationTimesheetDto) => (
                        <Card key={timesheet.timesheetId} className={styles.timesheetCard}>
                            <CardContent>
                                <Typography variant="h6">Timesheet #{timesheet.timesheetId}</Typography>
                                <Typography variant="body1"><strong>Date:</strong> {timesheet.date}</Typography>
                                {editingTimesheetId === timesheet.timesheetId ? (
                                    <form onSubmit={handleSubmitUpdate(onSubmitUpdate)}>
                                        <TextField
                                            {...registerUpdate("startTime", { required: "Start Time is required" })}
                                            label="Start Time"
                                            type="time"
                                            defaultValue={timesheet.startTime}
                                            fullWidth
                                            error={!!errorsUpdate.startTime}
                                            helperText={errorsUpdate.startTime?.message}
                                        />
                                        <TextField
                                            {...registerUpdate("endTime", { required: "End Time is required" })}
                                            label="End Time"
                                            type="time"
                                            defaultValue={timesheet.endTime}
                                            fullWidth
                                            error={!!errorsUpdate.endTime}
                                            helperText={errorsUpdate.endTime?.message}
                                        />
                                        <input type="hidden" {...registerUpdate("timesheetId")} value={timesheet.timesheetId} />
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <Button type="submit" variant="contained" color="primary">
                                                Update Timesheet
                                            </Button>
                                            <Button variant="outlined" color="secondary" onClick={() => setEditingTimesheetId(null)}>
                                                Cancel
                                            </Button>
                                        </Box>
                                    </form>
                                ) : (
                                    <>
                                        <Typography variant="body1"><strong>Start Time:</strong> {timesheet.startTime}</Typography>
                                        <Typography variant="body1"><strong>End Time:</strong> {timesheet.endTime}</Typography>
                                        <Typography variant="body1"><strong>Object:</strong> {timesheet.objectType.type}</Typography>
                                        <Button variant="outlined" color="primary" onClick={() => {setEditingTimesheetId(timesheet.timesheetId); console.log("tajmszit", editingTimesheetId)}}>
                                            Edit
                                        </Button>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                    <Pagination
                        count={Math.ceil((paginatedTimesheets?.totalCount || 1) / pageSize)}
                        page={page}
                        onChange={handlePageChange}
                        className={styles.pagination}
                        color="primary"
                        size="large"
                    />
                </div>
            )}
            <Button variant="contained" color="primary" onClick={() => setShowForm(!showForm)}>
                Add new timesheet
            </Button>
            {showForm && (
                <>
                    {isLoadingObjects ? (
                        <CircularProgress />
                    ) : (
                        <form onSubmit={handleSubmitCreate(onSubmitCreate)} className={styles.form}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <TextField
                                    {...registerCreate("date", { required: "Date is required" })}
                                    label="Date"
                                    type="date"
                                    defaultValue={new Date().toISOString().split('T')[0]}
                                    fullWidth
                                    error={!!errorsCreate.date}
                                    helperText={errorsCreate.date?.message}
                                />

                                <TextField
                                    {...registerCreate("startTime", { required: "Start Time is required" })}
                                    label="Start Time"
                                    type="time"
                                    defaultValue="08:00"
                                    fullWidth
                                    error={!!errorsCreate.startTime}
                                    helperText={errorsCreate.startTime?.message}
                                />

                                <TextField
                                    {...registerCreate("endTime", { required: "End Time is required" })}
                                    label="End Time"
                                    type="time"
                                    defaultValue="22:00"
                                    fullWidth
                                    error={!!errorsCreate.endTime}
                                    helperText={errorsCreate.endTime?.message}
                                />

                                <FormControl fullWidth error={!!errorsCreate.objectId}>
                                    <InputLabel>Object</InputLabel>
                                    <Select
                                        {...registerCreate("objectId", { required: "Object is required" })}
                                        defaultValue=""
                                    >
                                        {objectTypes?.map((objectType) => (
                                            <MenuItem key={objectType.objectId} value={objectType.objectId}>
                                                {objectType.type}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <Button type="submit" variant="contained" color="primary">
                                    Create Timesheet
                                </Button>
                            </Box>
                        </form>
                    )}
                </>
            )}
        </div>
    );
};

export default AddTimesheet;
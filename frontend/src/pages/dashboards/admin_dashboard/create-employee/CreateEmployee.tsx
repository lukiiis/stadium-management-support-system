import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, TextField, Box, CircularProgress, Snackbar, Alert } from "@mui/material";
import { useCreateEmployee, CreateEmployeeData, CreateEmployeeResponse, CreateEmployeeErrorResponse } from "./createEmployeeService";
import styles from './CreateEmployee.module.scss';
import { AxiosError } from "axios";

const CreateEmployee: React.FC = () => {
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

    const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateEmployeeData>();
    const createEmployeeMutation = useCreateEmployee();

    const onSubmit = (data: CreateEmployeeData) => {
        createEmployeeMutation.mutate(data, {
            onSuccess: (data: CreateEmployeeResponse) => {
                setSuccessMessage(data.message);
                setShowSuccess(true);
                reset();
            },
            onError: (error: AxiosError<CreateEmployeeErrorResponse>) => {
                if (error.response?.data?.error) {
                    setErrorMessage(error.response.data.error);
                    setShowError(true);
                }
            },
        });
    };

    return (
        <div className={styles.formContainer}>
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

            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        {...register("firstName", { required: "First Name is required" })}
                        label="First Name"
                        fullWidth
                        error={!!errors.firstName}
                        helperText={errors.firstName?.message}
                    />

                    <TextField
                        {...register("lastName", { required: "Last Name is required" })}
                        label="Last Name"
                        fullWidth
                        error={!!errors.lastName}
                        helperText={errors.lastName?.message}
                    />

                    <TextField
                        {...register("age", { required: "Age is required", valueAsNumber: true })}
                        label="Age"
                        type="number"
                        fullWidth
                        error={!!errors.age}
                        helperText={errors.age?.message}
                    />

                    <TextField
                        {...register("phone", { required: "Phone is required", valueAsNumber: true, minLength: { value: 9, message: "Not a proper phone number." }, maxLength: { value: 15, message: "Not a proper phone number." } })}
                        label="Phone"
                        type="number"
                        fullWidth
                        error={!!errors.phone}
                        helperText={errors.phone?.message}
                    />

                    <TextField
                        {...register("email", { required: "Email is required", pattern: { value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, message: "Please enter a valid email", }})}
                        label="Email"
                        fullWidth
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />

                    <TextField
                        {...register("salary", { required: "Salary is required", valueAsNumber: true })}
                        label="Salary"
                        type="number"
                        fullWidth
                        error={!!errors.salary}
                        helperText={errors.salary?.message}
                    />

                    <TextField
                        {...register("position", { required: "Position is required" })}
                        label="Position"
                        fullWidth
                        error={!!errors.position}
                        helperText={errors.position?.message}
                    />

                    <Button type="submit" variant="contained" color="primary" fullWidth disabled={createEmployeeMutation.isPending}>
                        {createEmployeeMutation.isPending ? <CircularProgress size={24} /> : "Create Employee"}
                    </Button>
                </Box>
            </form>
        </div>
    );
};

export default CreateEmployee;

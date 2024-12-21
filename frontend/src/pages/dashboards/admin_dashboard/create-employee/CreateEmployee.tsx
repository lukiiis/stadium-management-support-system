// CreateEmployee.tsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { 
    TextField, 
    Box, 
    CircularProgress, 
    Snackbar, 
    Alert,
    Typography,
    InputAdornment
} from "@mui/material";
import { motion } from "framer-motion";
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import WorkIcon from '@mui/icons-material/Work';
import PaymentsIcon from '@mui/icons-material/Payments';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useCreateEmployee } from "./createEmployeeService";
import styles from './CreateEmployee.module.scss';
import { AxiosError } from "axios";
import { CreateEmployeeData } from "../../../../shared/types/models/user";
import { ApiErrorResponse, ApiSuccessResponse } from "../../../../shared/types/api/apiResponse";
import { Navigate } from "react-router-dom";

const CreateEmployee: React.FC = () => {
    const token = localStorage.getItem("token");

    if (token === null) {
        return <Navigate to="/" replace />;
    }

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
            onSuccess: (data: ApiSuccessResponse) => {
                setSuccessMessage(data.message);
                setShowSuccess(true);
                reset();
            },
            onError: (error: AxiosError<ApiErrorResponse>) => {
                if (error.response?.data?.error) {
                    setErrorMessage(error.response.data.error);
                    setShowError(true);
                }
            },
        });
    };

    return (
        <motion.div 
            className={styles.pageContainer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className={styles.formCard}>
                <div className="p-10">
                    <h1>
                        Create New Employee
                    </h1>
                    <p className={styles.subtitle}>
                        Enter the details of the new employee below
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                        <Box className={styles.formSection}>
                            <Typography variant="h6" className={styles.sectionTitle}>
                                Personal Information
                            </Typography>
                            <Box className={styles.fieldsGrid}>
                                <TextField
                                    {...register("firstName", { required: "First Name is required" })}
                                    label="First Name"
                                    fullWidth
                                    error={!!errors.firstName}
                                    helperText={errors.firstName?.message}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <TextField
                                    {...register("lastName", { required: "Last Name is required" })}
                                    label="Last Name"
                                    fullWidth
                                    error={!!errors.lastName}
                                    helperText={errors.lastName?.message}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>
                        </Box>

                        <Box className={styles.formSection}>
                            <Typography variant="h6" className={styles.sectionTitle}>
                                Contact Information
                            </Typography>
                            <Box className={styles.fieldsGrid}>
                                <TextField
                                    {...register("email", { 
                                        required: "Email is required", 
                                        pattern: { 
                                            value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                                            message: "Please enter a valid email"
                                        }
                                    })}
                                    label="Email"
                                    fullWidth
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <TextField
                                    {...register("phone", { 
                                        required: "Phone is required",
                                        valueAsNumber: true,
                                        minLength: { value: 9, message: "Not a proper phone number." },
                                        maxLength: { value: 15, message: "Not a proper phone number." }
                                    })}
                                    label="Phone"
                                    fullWidth
                                    error={!!errors.phone}
                                    helperText={errors.phone?.message}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PhoneIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>
                        </Box>

                        <Box className={styles.formSection}>
                            <Typography variant="h6" className={styles.sectionTitle}>
                                Employment Details
                            </Typography>
                            <Box className={styles.fieldsGrid}>
                                <TextField
                                    {...register("position", { required: "Position is required" })}
                                    label="Position"
                                    fullWidth
                                    error={!!errors.position}
                                    helperText={errors.position?.message}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <WorkIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <TextField
                                    {...register("salary", { required: "Salary is required", valueAsNumber: true })}
                                    label="Salary"
                                    type="number"
                                    fullWidth
                                    error={!!errors.salary}
                                    helperText={errors.salary?.message}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PaymentsIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <TextField
                                    {...register("age", { required: "Age is required", valueAsNumber: true })}
                                    label="Age"
                                    type="number"
                                    fullWidth
                                    error={!!errors.age}
                                    helperText={errors.age?.message}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <CalendarTodayIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>
                        </Box>

                        <button 
                            type="submit"
                            disabled={createEmployeeMutation.isPending}
                            className={styles.submitButton}
                        >
                            {createEmployeeMutation.isPending ? (
                                <CircularProgress size={24} />
                            ) : (
                                "Create Employee"
                            )}
                        </button>
                    </form>
                </div>
            </div>

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

export default CreateEmployee;
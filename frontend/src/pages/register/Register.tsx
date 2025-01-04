import { useEffect, useState } from "react";
import styles from "./Register.module.scss";
import { useForm } from "react-hook-form";
import { useRegisterUser, useValidateEmail } from "./registerFunctions";
import {
    Button, TextField, CircularProgress, Alert,
    Paper, Typography, Container
} from "@mui/material";
import { RegisterData } from "../../shared/types/auth/register";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "../../shared/types/api/apiResponse";
import { motion } from "framer-motion";
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import PhoneIcon from '@mui/icons-material/Phone';
import { InputAdornment } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { AuthGuard } from "../../components/guards/AuthGuard";

const Register = () => {
    const navigate = useNavigate();
    const [emailValid, setEmailValid] = useState<boolean>(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState<"success" | "error">("success");

    const emailForm = useForm({
        defaultValues: { email: "" }
    });

    const registerForm = useForm<RegisterData>({
        defaultValues: {
            email: "",
            password: "",
            rePassword: "",
            firstName: "",
            lastName: "",
            phone: "",
            age: undefined,
            role: "CLIENT",
        }
    });

    const emailValidationMutation = useValidateEmail(setEmailValid, emailForm.setError);
    const registerMutation = useRegisterUser(registerForm);

    const handleEmailValidation = (data: { email: string }) => {
        registerForm.setValue("email", data.email);
        emailValidationMutation.mutate(data.email, {
            onSuccess: (data: boolean) => {
                if (data) {
                    setAlertMessage("Email is available!");
                    setAlertSeverity("success");
                    setShowAlert(true);
                    setEmailValid(true);
                } else {
                    setAlertMessage("Email is already taken!");
                    setAlertSeverity("error");
                    setShowAlert(true);
                    setEmailValid(false);
                }
            },
            onError: (error: AxiosError<ApiErrorResponse>) => {
                setAlertMessage(error.response?.data.error || "Validation failed");
                setAlertSeverity("error");
                setShowAlert(true);
            }
        });
    };

    const onSubmit = async (data: RegisterData) => {
        registerMutation.mutate(data, {
            onSuccess: () => {
                setAlertMessage("Registration successful!");
                setAlertSeverity("success");
                setShowAlert(true);
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            },
            onError: (error: AxiosError<ApiErrorResponse>) => {
                setAlertMessage(error.response?.data.error || "Registration failed");
                setAlertSeverity("error");
                setShowAlert(true);
            }
        });
    };

    useEffect(() => {
        let timeoutId: number;

        if (showAlert) {
            timeoutId = window.setTimeout(() => {
                setShowAlert(false);
            }, 6000);
        }

        return () => {
            if (timeoutId) {
                window.clearTimeout(timeoutId);
            }
        };
    }, [showAlert]);

    return (
        <div className={styles.registerContainer}>
            <Container maxWidth="lg">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Paper elevation={10} className={styles.registerBox}>
                        <div className={styles.left}>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className={styles.formContainer}
                            >
                                <div className={styles.headerSection}>
                                    <Typography variant="h3" component="h1">
                                        Create Account
                                    </Typography>
                                    <Typography variant="subtitle1" color="textSecondary">
                                        Join us to get started
                                    </Typography>
                                </div>
                                <form className={styles.registerForm}>
                                    <div className={`${styles.alertContainer} ${showAlert ? styles.show : ''}`}>
                                        <Alert
                                            severity={alertSeverity}
                                            onClose={() => setShowAlert(false)}
                                        >
                                            {alertMessage}
                                        </Alert>
                                    </div>
                                    <div className={`${styles.formContent} ${showAlert ? styles.shifted : ''}`}>
                                        {!emailValid ? (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <TextField
                                                    fullWidth
                                                    label="Email"
                                                    variant="outlined"
                                                    disabled={emailValidationMutation.isPending}
                                                    error={!!emailForm.formState.errors.email}
                                                    helperText={emailForm.formState.errors.email?.message}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <EmailIcon color="primary" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    {...emailForm.register("email", {
                                                        required: "Email is required",
                                                        pattern: {
                                                            value: /\S+@\S+\.\S+/,
                                                            message: "Invalid email format"
                                                        }
                                                    })}
                                                />
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    type="submit"
                                                    onClick={emailForm.handleSubmit(handleEmailValidation)}
                                                    disabled={emailValidationMutation.isPending}
                                                    sx={{ mt: 2 }}
                                                    className={styles.submitButton}
                                                >
                                                    {emailValidationMutation.isPending ? (
                                                        <CircularProgress size={24} />
                                                    ) : (
                                                        "Continue"
                                                    )}
                                                </Button>
                                                <Typography
                                                    variant="body2"
                                                    align="center"
                                                    sx={{ mt: 6 }}
                                                >
                                                    Already have an account?{' '}
                                                    <Link
                                                        to="/login"
                                                        className="text-blue-600 no-underline hover:underline"
                                                    >
                                                        Sign in
                                                    </Link>
                                                </Typography>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <TextField
                                                    fullWidth
                                                    label="First Name"
                                                    variant="outlined"
                                                    margin="normal"
                                                    disabled={registerMutation.isPending}
                                                    error={!!registerForm.formState.errors.firstName}
                                                    helperText={registerForm.formState.errors.firstName?.message}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <PersonIcon color="primary" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    {...registerForm.register("firstName", { required: "First name is required" })}
                                                />

                                                <TextField
                                                    fullWidth
                                                    label="Last Name"
                                                    variant="outlined"
                                                    margin="normal"
                                                    disabled={registerMutation.isPending}
                                                    error={!!registerForm.formState.errors.lastName}
                                                    helperText={registerForm.formState.errors.lastName?.message}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <PersonIcon color="primary" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    {...registerForm.register("lastName", { required: "Last name is required" })}
                                                />

                                                <TextField
                                                    fullWidth
                                                    label="Password"
                                                    type="password"
                                                    variant="outlined"
                                                    margin="normal"
                                                    disabled={registerMutation.isPending}
                                                    error={!!registerForm.formState.errors.password}
                                                    helperText={registerForm.formState.errors.password?.message}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <LockIcon color="primary" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    {...registerForm.register("password", {
                                                        required: "Password is required",
                                                        minLength: {
                                                            value: 8,
                                                            message: "Password must be at least 8 characters"
                                                        },
                                                        pattern: {
                                                            value: /[!@#$%^&*(),.?":{}|<>]/,
                                                            message: "Password must contain at least one special character"
                                                        }
                                                    })}
                                                />

                                                <TextField
                                                    fullWidth
                                                    label="Confirm Password"
                                                    type="password"
                                                    variant="outlined"
                                                    margin="normal"
                                                    disabled={registerMutation.isPending}
                                                    error={!!registerForm.formState.errors.rePassword}
                                                    helperText={registerForm.formState.errors.rePassword?.message}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <LockIcon color="primary" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    {...registerForm.register("rePassword", {
                                                        required: "Please confirm your password",
                                                        validate: (value) => value === registerForm.getValues('password') || 'Passwords do not match'
                                                    })}
                                                />

                                                <TextField
                                                    fullWidth
                                                    label="Phone Number"
                                                    variant="outlined"
                                                    margin="normal"
                                                    disabled={registerMutation.isPending}
                                                    error={!!registerForm.formState.errors.phone}
                                                    helperText={registerForm.formState.errors.phone?.message}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <PhoneIcon color="primary" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    {...registerForm.register("phone", {
                                                        required: "Phone number is required",
                                                        minLength: {
                                                            value: 9,
                                                            message: "Not a proper phone number"
                                                        },
                                                        maxLength: {
                                                            value: 15,
                                                            message: "Not a proper phone number"
                                                        }
                                                    })}
                                                />

                                                <TextField
                                                    fullWidth
                                                    label="Age"
                                                    type="number"
                                                    variant="outlined"
                                                    margin="normal"
                                                    disabled={registerMutation.isPending}
                                                    error={!!registerForm.formState.errors.age}
                                                    helperText={registerForm.formState.errors.age?.message}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <PersonIcon color="primary" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    {...registerForm.register("age", {
                                                        required: "Age is required",
                                                        min: {
                                                            value: 18,
                                                            message: "Must be at least 18 years old"
                                                        },
                                                        max: {
                                                            value: 120,
                                                            message: "Invalid age"
                                                        }
                                                    })}
                                                />
                                                <div className={styles.buttonContainer}>
                                                    <Button
                                                        fullWidth
                                                        variant="contained"
                                                        type="submit"
                                                        onClick={registerForm.handleSubmit(onSubmit)}
                                                        disabled={registerMutation.isPending || registerMutation.isSuccess}
                                                        className={styles.submitButton}
                                                    >
                                                        {registerMutation.isPending ? (
                                                            <CircularProgress size={24} />
                                                        ) : (
                                                            "Register"
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        onClick={() => { setEmailValid(false); setShowAlert(false); }}
                                                        className={styles.backButton}
                                                    >
                                                        Go Back
                                                    </Button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                        <div className={styles.right} />
                    </Paper>
                </motion.div>
            </Container>
        </div>
    );
};

export default function ProtectedRegister() {
    return (
        <AuthGuard>
            <Register />
        </AuthGuard>
    );
}
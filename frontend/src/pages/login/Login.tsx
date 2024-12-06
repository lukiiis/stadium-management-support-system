import { useForm } from "react-hook-form";
import styles from "./Login.module.scss"
import { TextField, Button, CircularProgress, Alert, Paper, Typography, Container } from '@mui/material';
import { useLoginUser } from "./loginFunctions";
import styled from "@emotion/styled";
import { LoginData, LoginResponse } from "../../shared/types/auth/login";
import { motion } from "framer-motion";
import { useState } from "react";
import LoginIcon from '@mui/icons-material/Login';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { InputAdornment } from "@mui/material";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "../../shared/types/api/apiResponse";
import { useNavigate } from "react-router-dom";
import { AuthGuard } from "../../components/guards/AuthGuard";

const LoginTextField = styled(TextField)({
    width: '100%',
    '& .MuiOutlinedInput-root': {
        '&:hover fieldset': {
            borderColor: '#1976d2',
        },
    },
});

const Login = () => {
    const navigate = useNavigate();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');

    const loginForm = useForm<LoginData>({
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const loginMutation = useLoginUser(loginForm);

    const onSubmit = async (data: LoginData) => {
        loginMutation.mutate(data, {
            onSuccess: (data: LoginResponse) => {
                setAlertMessage(data.message);
                setAlertSeverity('success');
                setShowAlert(true);
                setTimeout(() => {
                    navigate('/');
                }, 1500);
            },
            onError: (error: AxiosError<ApiErrorResponse>) => {
                setAlertMessage(error.response?.data.error || 'Login failed');
                setAlertSeverity('error');
                setShowAlert(true);
            }
        });
    };

    return (
        <div className={styles.loginContainer}>
            <Container maxWidth="lg">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Paper elevation={10} className={styles.loginBox}>
                        <div className={styles.left}>
                            <motion.div
                                className={styles.leftContainer}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className={styles.headerSection}>
                                    <Typography variant="h3" component="h1" gutterBottom>
                                        Welcome Back
                                    </Typography>
                                    <Typography variant="subtitle1" color="textSecondary">
                                        Please sign in to continue
                                    </Typography>
                                </div>

                                <form className={styles.loginForm} onSubmit={loginForm.handleSubmit(onSubmit)}>
                                    <div className={`${styles.alertContainer} ${showAlert ? styles.show : ''}`}>
                                        <Alert
                                            severity={alertSeverity}
                                            onClose={() => setShowAlert(false)}
                                        >
                                            {alertMessage}
                                        </Alert>
                                    </div>
                                    <div className={`${styles.formContent} ${showAlert ? styles.shifted : ''}`}>
                                        <LoginTextField
                                            label="Email"
                                            variant="outlined"
                                            disabled={loginMutation.isPending}
                                            error={!!loginForm.formState.errors.email}
                                            helperText={loginForm.formState.errors.email?.message}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <EmailIcon color="primary" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            {...loginForm.register("email", {
                                                required: "Email is required",
                                                pattern: {
                                                    value: /\S+@\S+\.\S+/,
                                                    message: "Invalid email format"
                                                }
                                            })}
                                        />
                                        <LoginTextField
                                            label="Password"
                                            type="password"
                                            variant="outlined"
                                            disabled={loginMutation.isPending}
                                            error={!!loginForm.formState.errors.password}
                                            helperText={loginForm.formState.errors.password?.message}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LockIcon color="primary" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            {...loginForm.register("password", {
                                                required: "Password is required"
                                            })}
                                        />
                                        <Button
                                            variant="contained"
                                            type="submit"
                                            disabled={loginMutation.isPending || !loginForm.formState.isValid}
                                            size="large"
                                            startIcon={loginMutation.isPending ? <CircularProgress size={20} /> : <LoginIcon />}
                                            className={styles.submitButton}
                                        >
                                            {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
                                        </Button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                        <div className={styles.right}></div>
                    </Paper>
                </motion.div>
            </Container>
        </div>
    );
};

export default function ProtectedLogin() {
    return (
        <AuthGuard>
            <Login />
        </AuthGuard>
    );
}
import { AxiosError } from "axios";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { ApiSuccessResponse, ApiErrorResponse } from "../../../../shared/types/api/apiResponse";
import { ChangePasswordData } from "../../../../shared/types/models/user";
import { useChangePassword } from "../../client_profile/account-info/accountInfoService";
import { Snackbar, Alert, AlertColor, Button, TextField } from "@mui/material";
import { useState } from "react";
import { VpnKey, LockReset, Lock } from "@mui/icons-material";
import { motion } from "framer-motion";
import styles from "./ChangePasswordEmp.module.scss";

const ChangePasswordEmp = () => {
    const token = localStorage.getItem("token");

    if (token === null) {
        return <Navigate to="/" replace />;
    }

    const [snackbarSeverity, setSnackbarSeverity] = useState<string>("error")
    const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
    const [showSnackbar, setShowSnackbar] = useState<boolean>(false);

    const userId = parseInt(jwtDecode<JwtPayload>(token).sub as string, 10);

    const handleCloseSnackbar = () => {
        setShowSnackbar(false);
        setSnackbarMessage(null);
    };

    const { register, handleSubmit, formState: { errors }, reset, getValues } = useForm<ChangePasswordData>();
    const { mutate: changePassword } = useChangePassword();

    const handlePasswordChange = (data: ChangePasswordData) => {
        changePassword(
            { userId, passwordData: data },
            {
                onSuccess: (data: ApiSuccessResponse) => {
                    setSnackbarSeverity("success");
                    setSnackbarMessage(data.message);
                    setShowSnackbar(true);
                    reset();
                },
                onError: (error: AxiosError<ApiErrorResponse>) => {
                    setSnackbarSeverity("error");
                    setSnackbarMessage(error.response?.data.error || "Failed to change password");
                    setShowSnackbar(true);
                },
            }
        );
    };

    return (
        <>
            <Snackbar
                open={showSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity as AlertColor} variant="filled">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            <motion.div
                className={styles.passwordData}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <h1>
                    Change password
                </h1>
                <form onSubmit={handleSubmit(handlePasswordChange)}>
                    <div className={styles.formFields}>
                        <TextField
                            label="Current Password"
                            type="password"
                            {...register("currentPassword", { required: "Current password is required" })}
                            fullWidth
                            error={!!errors.currentPassword}
                            helperText={errors.currentPassword?.message}
                            className={styles.field}
                            slotProps={{
                                input: {
                                    startAdornment: <VpnKey className={styles.icon} />,
                                }
                            }}
                        />
                        <TextField
                            label="New Password"
                            type="password"
                            {...register("newPassword", {
                                required: "New password is required",
                                minLength: { value: 8, message: "Password must be at least 8 characters long" }
                            })}
                            fullWidth
                            error={!!errors.newPassword}
                            helperText={errors.newPassword?.message}
                            className={styles.field}
                            slotProps={{
                                input: {
                                    startAdornment: <Lock className={styles.icon} />,
                                }
                            }}
                        />
                        <TextField
                            label="Confirm Password"
                            type="password"
                            {...register("confirmPassword", {
                                required: "Please confirm your password",
                                validate: (value) => value === getValues("newPassword") || "Passwords do not match"
                            })}
                            fullWidth
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword?.message}
                            className={styles.field}
                            slotProps={{
                                input: {
                                    startAdornment: <Lock className={styles.icon} />,
                                }
                            }}
                        />
                    </div>

                    <Button
                        type="submit"
                        variant="contained"
                        className={styles.submitButton}
                        startIcon={<LockReset />}
                    >
                        Update Password
                    </Button>
                </form>
            </motion.div>
        </>
    )
}

export default ChangePasswordEmp;
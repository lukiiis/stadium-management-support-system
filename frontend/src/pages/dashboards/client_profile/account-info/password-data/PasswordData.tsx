import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { AccountInfoContext, useChangePassword } from "../accountInfoService";
import { TextField, Button } from "@mui/material";
import styles from "./PasswordData.module.scss";
import { AxiosError } from "axios";
import { ApiSuccessResponse, ApiErrorResponse } from "../../../../../shared/types/api/apiResponse";
import { ChangePasswordData } from "../../../../../shared/types/models/user";
import { motion } from "framer-motion";
import { VpnKey, Lock, LockReset } from "@mui/icons-material";

interface PasswordDataProps {
    userId: number;
}

const PasswordData: React.FC<PasswordDataProps> = ({ userId }) => {
    const accountInfoContext = useContext(AccountInfoContext);

    const { register, handleSubmit, formState: { errors }, reset, getValues } = useForm<ChangePasswordData>();
    const { mutate: changePassword } = useChangePassword();

    const handlePasswordChange = (data: ChangePasswordData) => {
        changePassword(
            { userId, passwordData: data },
            {
                onSuccess: (data: ApiSuccessResponse) => {
                    accountInfoContext?.setSnackbarSeverity("success");
                    accountInfoContext?.setSnackbarMessage(data.message);
                    accountInfoContext?.setShowSnackbar(true);
                    reset();
                },
                onError: (error: AxiosError<ApiErrorResponse>) => {
                    accountInfoContext?.setSnackbarSeverity("error");
                    accountInfoContext?.setSnackbarMessage(error.response?.data.error || "Failed to change password");
                    accountInfoContext?.setShowSnackbar(true);
                },
            }
        );
    };

    return (
        <motion.div
            className={styles.passwordData}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
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
                            validate: (value) => value === getValues("newPassword") || "Passwords must match"
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
    );
};

export default PasswordData;

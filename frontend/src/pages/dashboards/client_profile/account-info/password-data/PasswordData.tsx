import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { AccountInfoContext, useChangePassword } from "../accountInfoService";
import { TextField, Button } from "@mui/material";
import styles from "./PasswordData.module.scss";
import { AxiosError } from "axios";
import { ApiSuccessResponse, ApiErrorResponse } from "../../../../../shared/types/api/apiResponse";
import { ChangePasswordData } from "../../../../../shared/types/models/user";

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
        <div className={styles.passwordData}>
            <h2>Change Password</h2>
            <form onSubmit={handleSubmit(handlePasswordChange)}>
                <TextField
                    label="Current Password"
                    type="password"
                    {...register("currentPassword", { required: "Current password is required" })}
                    fullWidth
                    margin="normal"
                    error={!!errors.currentPassword}
                    helperText={errors.currentPassword?.message}
                />
                <TextField
                    label="New Password"
                    type="password"
                    {...register("newPassword", { 
                        required: "New password is required", 
                        minLength: { value: 8, message: "Password must be at least 6 characters long" }
                    })}
                    fullWidth
                    margin="normal"
                    error={!!errors.newPassword}
                    helperText={errors.newPassword?.message}
                />
                <TextField
                    label="Confirm Password"
                    type="password"
                    {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) => value === getValues("newPassword") || "Passwords must match"
                    })}
                    fullWidth
                    margin="normal"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                />
                <Button type="submit" variant="contained" color="primary">
                    Change Password
                </Button>
            </form>
        </div>
    );
};

export default PasswordData;

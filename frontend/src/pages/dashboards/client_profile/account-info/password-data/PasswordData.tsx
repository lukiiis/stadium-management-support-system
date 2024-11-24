import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useChangePassword } from "../accountInfoService";
import { TextField, Button, Snackbar, Alert } from "@mui/material";
import styles from "./PasswordData.module.scss";

interface PasswordDataProps {
    userId: number;
}

const PasswordData: React.FC<PasswordDataProps> = ({ userId }) => {
    const { register, handleSubmit } = useForm();
    const { mutate: changePassword } = useChangePassword();

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showError, setShowError] = useState(false);

    const handlePasswordChange = (data: any) => {
        changePassword(
            { userId, passwordData: data },
            {
                onError: (error) => {
                    setErrorMessage(error.response?.data.error || "Failed to change password");
                    setShowError(true);
                },
            }
        );
    };

    const handleCloseSnackbar = () => setShowError(false);

    return (
        <div className={styles.passwordData}>
            <Snackbar
                open={showError}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={handleCloseSnackbar} severity="error" variant="filled">
                    {errorMessage}
                </Alert>
            </Snackbar>
            <h2>Change Password</h2>
            <form onSubmit={handleSubmit(handlePasswordChange)}>
                <TextField
                    label="Current Password"
                    type="password"
                    {...register("currentPassword")}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="New Password"
                    type="password"
                    {...register("newPassword")}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Confirm Password"
                    type="password"
                    {...register("confirmPassword")}
                    fullWidth
                    margin="normal"
                />
                <Button type="submit" variant="contained" color="primary">
                    Change Password
                </Button>
            </form>
        </div>
    );
};

export default PasswordData;

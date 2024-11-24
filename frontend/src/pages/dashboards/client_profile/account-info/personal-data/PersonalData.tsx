import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useGetUserData, useUpdateData } from "../accountInfoService";
import { TextField, Button, CircularProgress, Snackbar, Alert } from "@mui/material";
import styles from "./PersonalData.module.scss";

interface PersonalDataProps {
    userId: number;
}

const PersonalData: React.FC<PersonalDataProps> = ({ userId }) => {
    const { data, isLoading, refetch } = useGetUserData(userId);
    const { mutate: updateUserData } = useUpdateData();

    const { register, handleSubmit } = useForm();

    const [isEditing, setIsEditing] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showError, setShowError] = useState(false);

    const handleUpdate = (formData: any) => {
        updateUserData(
            { ...formData, userId },
            {
                onSuccess: () => {
                    refetch();
                    setIsEditing(false);
                },
                onError: (error) => {
                    setErrorMessage(error.response?.data.error || "Failed to update data");
                    setShowError(true);
                },
            }
        );
    };

    console.log(data)

    const handleCloseSnackbar = () => setShowError(false);

    if (isLoading) return <CircularProgress />;

    return (
        <div className={styles.personalData}>
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
            <h2>Personal Data</h2>
            {data && (

                <form onSubmit={handleSubmit(handleUpdate)}>
                    <TextField
                        placeholder={data?.firstName}
                        {...register("firstName")}
                        disabled={!isEditing}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        placeholder={data?.lastName || ""}
                        {...register("lastName")}
                        disabled={!isEditing}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        placeholder={data?.age ? String(data.age) : ""}
                        type="number"
                        {...register("age")}
                        disabled={!isEditing}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        placeholder={data?.phone ? String(data.phone) : ""}
                        {...register("phone")}
                        disabled={!isEditing}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        placeholder={data?.email || ""}
                        {...register("email")}
                        disabled={!isEditing}
                        fullWidth
                        margin="normal"
                    />
                    {!isEditing ? (
                        <Button variant="outlined" onClick={() => setIsEditing(true)}>
                            Edit
                        </Button>
                    ) : (
                        <>
                            <Button type="submit" variant="contained" color="primary">
                                Submit
                            </Button>
                            <Button variant="outlined" onClick={() => setIsEditing(false)}>
                                Cancel
                            </Button>
                        </>
                    )}
                </form>
            )}

        </div>
    );
};

export default PersonalData;

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useGetAddressData, useCreateAddress, useUpdateAddress } from "../accountInfoService";
import { TextField, Button, CircularProgress, Snackbar, Alert } from "@mui/material";
import styles from "./AddressData.module.scss";

interface AddressDataProps {
    userId: number;
}

const AddressData: React.FC<AddressDataProps> = ({ userId }) => {
    const { data, isLoading, refetch } = useGetAddressData(userId);
    const { mutate: createAddress } = useCreateAddress();
    const { mutate: updateAddress } = useUpdateAddress();

    const { register, handleSubmit } = useForm();
    const [isEditing, setIsEditing] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showError, setShowError] = useState(false);

    const handleCreateAddress = (formData: any) => {
        createAddress(
            { userId, ...formData },
            {
                onSuccess: () => {
                    refetch();
                    setIsEditing(false);
                },
                onError: (error) => {
                    setErrorMessage(error.response?.data.error || "Failed to create address");
                    setShowError(true);
                },
            }
        );
    };

    const handleUpdateAddress = (formData: any) => {
        updateAddress(
            { addressId: data?.addressId, ...formData },
            {
                onSuccess: () => {
                    refetch();
                    setIsEditing(false);
                },
                onError: (error) => {
                    setErrorMessage(error.response?.data.error || "Failed to update address");
                    setShowError(true);
                },
            }
        );
    };

    const onSubmit = (formData: any) => {
        if (!data) {
            handleCreateAddress(formData);
        } else {
            handleUpdateAddress(formData);
        }
    };

    const handleCloseSnackbar = () => setShowError(false);

    if (isLoading) return <CircularProgress />;

    return (
        <div className={styles.addressData}>
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
            <h2>Address</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    label="Country"
                    placeholder={data?.country || ""}
                    {...register("country")}
                    disabled={!isEditing}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="City"
                    placeholder={data?.city || ""}
                    {...register("city")}
                    disabled={!isEditing}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Street"
                    placeholder={data?.street || ""}
                    {...register("street")}
                    disabled={!isEditing}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Zipcode"
                    placeholder={data?.zipcode || ""}
                    {...register("zipcode")}
                    disabled={!isEditing}
                    fullWidth
                    margin="normal"
                />
                {!isEditing ? (
                    <Button variant="outlined" onClick={() => setIsEditing(true)}>
                        {data ? "Edit Address" : "Add Address"}
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
        </div>
    );
};

export default AddressData;

import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useGetAddressData, useCreateAddress, useUpdateAddress, AccountInfoContext, CreateAddressData, UpdateAddressData } from "../accountInfoService";
import { TextField, Button, CircularProgress } from "@mui/material";
import styles from "./AddressData.module.scss";
import { ApiErrorResponse, ApiSuccessResponse } from "../../../../../shared/interfaces";
import { AxiosError } from "axios";

interface AddressDataProps {
    userId: number;
}

const AddressData: React.FC<AddressDataProps> = ({ userId }) => {
    const accountInfoContext = useContext(AccountInfoContext);

    const { data, isLoading, refetch } = useGetAddressData(userId);
    const { mutate: createAddress } = useCreateAddress();
    const { mutate: updateAddress } = useUpdateAddress();

    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm<CreateAddressData | UpdateAddressData>();
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (data) {
            setValue("country", data?.country || "");
            setValue("city", data?.city || "");
            setValue("street", data?.street || "");
            setValue("zipcode", data?.zipcode || "");
        }
    }, [data, setValue]);

    const handleCreateAddress = (formData: CreateAddressData) => {
        createAddress(
            { ...formData, userId },
            {
                onSuccess: (data: ApiSuccessResponse) => {
                    accountInfoContext?.setSnackbarSeverity("success");
                    accountInfoContext?.setSnackbarMessage(data.message);
                    accountInfoContext?.setShowSnackbar(true);
                    refetch();
                    setIsEditing(false);
                },
                onError: (error: AxiosError<ApiErrorResponse>) => {
                    accountInfoContext?.setSnackbarSeverity("error");
                    accountInfoContext?.setSnackbarMessage(error.response?.data.error || "Failed to create address");
                    accountInfoContext?.setShowSnackbar(true);
                },
            }
        );
    };

    const handleUpdateAddress = (formData: UpdateAddressData) => {
        updateAddress(
            { ...formData, addressId: data?.addressId },
            {
                onSuccess: (data: ApiSuccessResponse) => {
                    accountInfoContext?.setSnackbarSeverity("success");
                    accountInfoContext?.setSnackbarMessage(data.message);
                    accountInfoContext?.setShowSnackbar(true);
                    refetch();
                    setIsEditing(false);
                },
                onError: (error: AxiosError<ApiErrorResponse>) => {
                    accountInfoContext?.setSnackbarSeverity("error");
                    accountInfoContext?.setSnackbarMessage(error.response?.data.error || "Failed to update address");
                    accountInfoContext?.setShowSnackbar(true);
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

    if (isLoading) return <CircularProgress />;

    return (
        <div className={styles.addressData}>
            <h2>Address</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                {!isEditing && data ? (
                    <>
                        <p>{data?.country}</p>
                        <p>{data?.city}</p>
                        <p>{data?.street}</p>
                        <p>{data?.zipcode}</p>
                    </>
                ) : (
                    <>
                        <TextField
                            label="Country"
                            defaultValue={getValues().country}
                            placeholder={data?.country || ""}
                            {...register("country", { required: "Country is required" })}
                            disabled={!isEditing}
                            fullWidth
                            margin="normal"
                            slotProps={{
                                inputLabel: { shrink: true }
                            }}
                            error={!!errors.country}
                            helperText={errors.country?.message}
                        />
                        <TextField
                            label="City"
                            defaultValue={getValues().city}
                            placeholder={data?.city || ""}
                            {...register("city", { required: "City is required" })}
                            disabled={!isEditing}
                            fullWidth
                            margin="normal"
                            slotProps={{
                                inputLabel: { shrink: true }
                            }}
                            error={!!errors.city}
                            helperText={errors.city?.message}
                        />
                        <TextField
                            label="Street"
                            defaultValue={getValues().street}
                            placeholder={data?.street || ""}
                            {...register("street", { required: "Street is required" })}
                            disabled={!isEditing}
                            fullWidth
                            margin="normal"
                            slotProps={{
                                inputLabel: { shrink: true }
                            }}
                            error={!!errors.street}
                            helperText={errors.street?.message}
                        />
                        <TextField
                            label="Zipcode"
                            defaultValue={getValues().zipcode}
                            placeholder={data?.zipcode || ""}
                            {...register("zipcode", { required: "Zipcode is required" })}
                            disabled={!isEditing}
                            fullWidth
                            margin="normal"
                            slotProps={{
                                inputLabel: { shrink: true }
                            }}
                            error={!!errors.zipcode}
                            helperText={errors.zipcode?.message}
                        />
                    </>
                )}

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

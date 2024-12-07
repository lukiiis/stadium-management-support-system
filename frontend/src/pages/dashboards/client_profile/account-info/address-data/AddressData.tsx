import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useGetAddressData, useCreateAddress, useUpdateAddress, AccountInfoContext } from "../accountInfoService";
import { TextField, Button, CircularProgress } from "@mui/material";
import styles from "./AddressData.module.scss";
import { AxiosError } from "axios";
import { ApiSuccessResponse, ApiErrorResponse } from "../../../../../shared/types/api/apiResponse";
import { CreateAddressData, UpdateAddressData } from "../../../../../shared/types/models/address";
import { Cancel, Edit, Home, LocationCity, LocationOn, MarkunreadMailbox, Save } from "@mui/icons-material";
import { motion } from "framer-motion";

interface AddressDataProps {
    userId: number;
}

const AddressData: React.FC<AddressDataProps> = ({ userId }) => {
    const accountInfoContext = useContext(AccountInfoContext);

    const { data, isLoading, refetch } = useGetAddressData(userId);
    const { mutate: createAddress } = useCreateAddress();
    const { mutate: updateAddress } = useUpdateAddress();

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<CreateAddressData | UpdateAddressData>();
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
        <motion.div
            className={styles.addressData}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                {!isEditing && data ? (
                    <div className={styles.viewMode}>
                        <div className={styles.field}>
                            <div className={styles.label}>
                                <Home className={styles.icon} />
                                <span>Country</span>
                            </div>
                            <span className={styles.value}>{data.country}</span>
                        </div>
                        <div className={styles.field}>
                            <div className={styles.label}>
                                <LocationCity className={styles.icon} />
                                <span>City</span>
                            </div>
                            <span className={styles.value}>{data.city}</span>
                        </div>
                        <div className={styles.field}>
                            <div className={styles.label}>
                                <LocationOn className={styles.icon} />
                                <span>Street</span>
                            </div>
                            <span className={styles.value}>{data.street}</span>
                        </div>
                        <div className={styles.field}>
                            <div className={styles.label}>
                                <MarkunreadMailbox className={styles.icon} />
                                <span>Zipcode</span>
                            </div>
                            <span className={styles.value}>{data.zipcode}</span>
                        </div>
                    </div>
                ) : (
                    <div className={styles.editMode}>
                        <TextField
                            label="Country"
                            {...register("country", { required: "Country is required" })}
                            fullWidth
                            error={!!errors.country}
                            helperText={errors.country?.message}
                            className={styles.field}
                            slotProps={{
                                input: {
                                    startAdornment: <Home className={styles.icon} />,
                                },
                            }}
                        />
                        <TextField
                            label="City"
                            {...register("city", { required: "City is required" })}
                            fullWidth
                            error={!!errors.city}
                            helperText={errors.city?.message}
                            className={styles.field}
                            slotProps={{
                                input: {
                                    startAdornment: <LocationCity className={styles.icon} />,
                                },
                            }}
                        />
                        <TextField
                            label="Street"
                            {...register("street", { required: "Street is required" })}
                            fullWidth
                            error={!!errors.street}
                            helperText={errors.street?.message}
                            className={styles.field}
                            slotProps={{
                                input: {
                                    startAdornment: <LocationOn className={styles.icon} />,
                                },
                            }}
                        />
                        <TextField
                            label="Zipcode"
                            {...register("zipcode", { required: "Zipcode is required" })}
                            fullWidth
                            error={!!errors.zipcode}
                            helperText={errors.zipcode?.message}
                            className={styles.field}
                            slotProps={{
                                input: {
                                    startAdornment: <MarkunreadMailbox className={styles.icon} />,
                                },
                            }}
                        />
                    </div>
                )}


                {!isEditing ? (
                    <Button
                        variant="contained"
                        onClick={() => setIsEditing(true)}
                        startIcon={<Edit />}
                        className={styles.editButton}
                    >
                        {data ? 'Edit Address' : 'Add Address'}
                    </Button>
                ) : (
                    <>
                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={<Save />}
                            className={styles.editButton}
                        >
                            Save Changes
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => setIsEditing(false)}
                            startIcon={<Cancel />}
                            className={styles.cancelButton}
                        >
                            Cancel
                        </Button>
                    </>
                )}

            </form>
        </motion.div>
    );
};

export default AddressData;

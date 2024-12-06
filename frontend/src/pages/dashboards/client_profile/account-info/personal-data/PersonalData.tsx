import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AccountInfoContext, useGetUserData, useUpdateData } from "../accountInfoService";
import { TextField, Button, CircularProgress } from "@mui/material";
import styles from "./PersonalData.module.scss";
import { AxiosError } from "axios";
import { EditUserData } from "../../../../../shared/types/models/user";
import { ApiSuccessResponse, ApiErrorResponse } from "../../../../../shared/types/api/apiResponse";
import { Edit, Email, Numbers, Person, Phone, Save, Cancel } from "@mui/icons-material";
import { motion } from "framer-motion";

interface PersonalDataProps {
    userId: number;
}

const PersonalData: React.FC<PersonalDataProps> = ({ userId }) => {
    const accountInfoContext = useContext(AccountInfoContext);

    const { data, isLoading, refetch } = useGetUserData(userId);
    const { mutate: updateUserData } = useUpdateData();

    const { register, handleSubmit, formState: { errors }, setValue, clearErrors } = useForm<EditUserData>();

    useEffect(() => {
        if (data) {
            setValue("firstName", data.firstName || "");
            setValue("lastName", data.lastName || "");
            setValue("age", data.age);
            setValue("phone", data.phone);
            setValue("email", data.email || "");
        }
    }, [data, setValue]);

    const [isEditing, setIsEditing] = useState(false);

    const handleUpdate = (formData: EditUserData) => {
        updateUserData(
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
                    accountInfoContext?.setSnackbarMessage(error.response?.data.error || "Failed to update data");
                    accountInfoContext?.setShowSnackbar(true);
                },
            }
        );
    };

    if (isLoading) return <CircularProgress />;

    return (
        <motion.div
            className={styles.personalData}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <form onSubmit={handleSubmit(handleUpdate)}>
                {isEditing ? (
                    <div className={styles.editMode}>
                        <TextField
                            label="First Name"
                            {...register("firstName", { required: "First name is required" })}
                            fullWidth
                            error={!!errors.firstName}
                            helperText={errors.firstName?.message}
                            className={styles.field}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <Person className={styles.icon} />
                                    ),
                                },
                            }}
                        />

                        <TextField
                            label="Last Name"
                            {...register("lastName", { required: "Last name is required" })}
                            fullWidth
                            error={!!errors.lastName}
                            helperText={errors.lastName?.message}
                            className={styles.field}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <Person className={styles.icon} />
                                    ),
                                },
                            }}
                        />

                        <TextField
                            label="Age"
                            type="number"
                            {...register("age", {
                                required: "Age is required",
                                min: { value: 18, message: "Age must be at least 18" }
                            })}
                            fullWidth
                            error={!!errors.age}
                            helperText={errors.age?.message}
                            className={styles.field}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <Numbers className={styles.icon} />
                                    ),
                                },
                            }}
                        />

                        <TextField
                            label="Phone"
                            {...register("phone", {
                                required: "Phone is required",
                                minLength: { value: 9, message: "Invalid phone number" },
                                maxLength: { value: 15, message: "Invalid phone number" }
                            })}
                            fullWidth
                            error={!!errors.phone}
                            helperText={errors.phone?.message}
                            className={styles.field}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <Phone className={styles.icon} />
                                    ),
                                },
                            }}
                        />

                        <TextField
                            label="Email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Invalid email address"
                                }
                            })}
                            fullWidth
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            className={styles.field}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <Email className={styles.icon} />
                                    ),
                                },
                            }}
                        />
                    </div>
                ) : (
                    <div className={styles.viewMode}>
                        <div className={styles.field}>
                            <div className={styles.label}>
                                <Person className={styles.icon} />
                                <span>Name</span>
                            </div>
                            <span className={styles.value}>{data?.firstName} {data?.lastName}</span>
                        </div>

                        <div className={styles.field}>
                            <div className={styles.label}>
                                <Numbers className={styles.icon} />
                                <span>Age</span>
                            </div>
                            <span className={styles.value}>{data?.age}</span>
                        </div>

                        <div className={styles.field}>
                            <div className={styles.label}>
                                <Phone className={styles.icon} />
                                <span>Phone</span>
                            </div>
                            <span className={styles.value}>{data?.phone}</span>
                        </div>

                        <div className={styles.field}>
                            <div className={styles.label}>
                                <Email className={styles.icon} />
                                <span>Email</span>
                            </div>
                            <span className={styles.value}>{data?.email}</span>
                        </div>
                    </div>
                )}
                {!isEditing ? (
                    <Button
                        variant="contained"
                        onClick={() => setIsEditing(true)}
                        startIcon={<Edit />}
                        className={styles.editButton}
                    >
                        Edit Information
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
                            onClick={() => { clearErrors(); setIsEditing(false) }}
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

export default PersonalData;

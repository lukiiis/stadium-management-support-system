import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AccountInfoContext, useGetUserData, useUpdateData } from "../accountInfoService";
import { TextField, Button, CircularProgress } from "@mui/material";
import styles from "./PersonalData.module.scss";
import { AxiosError } from "axios";
import { EditUserData } from "../../../../../shared/types/models/user";
import { ApiSuccessResponse, ApiErrorResponse } from "../../../../../shared/types/api/apiResponse";

interface PersonalDataProps {
    userId: number;
}

const PersonalData: React.FC<PersonalDataProps> = ({ userId }) => {
    const accountInfoContext = useContext(AccountInfoContext);

    const { data, isLoading, refetch } = useGetUserData(userId);
    const { mutate: updateUserData } = useUpdateData();

    const { register, handleSubmit, formState: { errors }, getValues, setValue, clearErrors } = useForm<EditUserData>();

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
        <div className={styles.personalData}>
            <h2>Personal Data</h2>
            <form onSubmit={handleSubmit(handleUpdate)}>
                {isEditing ? (
                    <>
                        <TextField
                            slotProps={{
                                inputLabel: { shrink: true }
                            }}
                            label="First name"
                            defaultValue={getValues().firstName}
                            placeholder={data?.firstName}
                            {...register("firstName", { required: "First name is required" })}
                            disabled={!isEditing}
                            fullWidth
                            margin="normal"
                            error={!!errors.firstName}
                            helperText={errors.firstName?.message}
                        />

                        <TextField
                            slotProps={{
                                inputLabel: { shrink: true }
                            }}
                            label="Last name"
                            defaultValue={getValues().lastName}
                            placeholder={data?.lastName || ""}
                            {...register("lastName", { required: "Last name is required" })}
                            disabled={!isEditing}
                            fullWidth
                            margin="normal"
                            error={!!errors.lastName}
                            helperText={errors.lastName?.message}
                        />

                        <TextField
                            slotProps={{
                                inputLabel: { shrink: true }
                            }}
                            label="Age"
                            defaultValue={getValues().age}
                            placeholder={data?.age ? String(data.age) : ""}
                            type="number"
                            {...register("age", { required: "Age is required", min: { value: 18, message: "Age must be at least 18" } })}
                            disabled={!isEditing}
                            fullWidth
                            margin="normal"
                            error={!!errors.age}
                            helperText={errors.age?.message}
                        />

                        <TextField
                            slotProps={{
                                inputLabel: { shrink: true }
                            }}
                            label="Phone number"
                            defaultValue={getValues().phone}
                            placeholder={data?.phone ? String(data.phone) : ""}
                            {...register("phone", { required: "Phone number is required", minLength: { value: 9, message: "Not a proper phone number." }, maxLength: { value: 15, message: "Not a proper phone number." } })}
                            disabled={!isEditing}
                            fullWidth
                            margin="normal"
                            type="number"
                            error={!!errors.phone}
                            helperText={errors.phone?.message}
                        />

                        <TextField
                            slotProps={{
                                inputLabel: { shrink: true }
                            }}
                            label="Email"
                            defaultValue={getValues().email}
                            placeholder={data?.email || ""}
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Please enter a valid email"
                                }
                            })}
                            disabled={!isEditing}
                            fullWidth
                            margin="normal"
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />
                    </>
                ) : (
                    <>
                        <p>{data?.firstName}</p>
                        <p>{data?.lastName}</p>
                        <p>{data?.age}</p>
                        <p>{data?.phone}</p>
                        <p>{data?.email}</p>
                    </>
                )}

                {!isEditing ? (
                    <Button variant="outlined" onClick={() => { setIsEditing(true); }}>
                        Edit
                    </Button>
                ) : (
                    <>
                        <Button type="submit" variant="contained" color="primary">
                            Submit
                        </Button>
                        <Button variant="outlined" onClick={() => { clearErrors(); setIsEditing(false) }}>
                            Cancel
                        </Button>
                    </>
                )}
            </form>
        </div>
    );
};

export default PersonalData;

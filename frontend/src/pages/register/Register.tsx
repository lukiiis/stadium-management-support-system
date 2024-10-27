import { useState } from "react";
import styles from "./Register.module.scss"
import { useForm } from "react-hook-form";
import { RegisterData, RegisterStatus, useRegisterUser, useValidateEmail } from "./registerFunctions";
import { TextField } from "@mui/material";
import LoadingSpinner from "../../components/loadingSpinner/LoadingSpinner";

const Register = () => {
    //email and register info
    const [regInfo, setRegInfo] = useState<RegisterStatus>({
        message: "",
        status: ""
    });
    //email validation
    const [emailValid, setEmailValid] = useState<boolean>(false);
    //email form
    const emailForm = useForm({
        defaultValues: {
            email: ''
        }
    });

    //register form
    const registerForm = useForm<RegisterData>({
        defaultValues: {
            email: '',
            password: '',
            rePassword: '',
            firstName: '',
            lastName: '',
            phone: '',
            age: undefined,
            role: 'CLIENT',
        }
    })

    //email mutation
    const emailValidationMutation = useValidateEmail(setEmailValid, setRegInfo, emailForm.setError);
    const handleEmailValidation = (data: { email: string }) => {
        try {
            registerForm.setValue("email", data.email);
            emailValidationMutation.mutate(data.email)
        }
        catch (error) {
            console.log(error);
        }
    }

    //register mutation
    const registerMutation = useRegisterUser(setRegInfo, registerForm);
    const onSubmit = async (data: RegisterData) => {
        try {
            registerMutation.mutate(data, {
                // onSuccess: () => {
                //     setShowPopup(true);
                // },
                // onError: () => {
                //     setShowPopup(true);
                // }
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={styles.registerContainer}>
            <div className={styles.logo}>

            </div>
            <div className={styles.registerBox}>
                <div className={styles.left}>
                    <h1>Create an account</h1>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    {!emailValid ? (
                        <form className="flex flex-col" onSubmit={emailForm.handleSubmit(handleEmailValidation)}>
                            <TextField
                                label="Email"
                                disabled={!!emailValidationMutation.isPending}
                                error={!!emailForm.formState.errors.email}
                                color={emailValidationMutation.isSuccess ? "success" : "primary"}
                                helperText={emailForm.formState.errors.email?.message}
                                {...emailForm.register("email", { required: "Field required", pattern: { value: /\S+@\S+\.\S+/, message: "Entered value does not match email format", } })}
                            />
                            <button className="auth-button" type="submit">Continue</button>
                            {emailValidationMutation.isPending ? (<LoadingSpinner isLoading={false}/>) : ""} {/*CHANGEEE*/}
                        </form>
                    ) : (
                        <>
                            <form className=" flex flex-col justify-center items-center gap-1" onSubmit={registerForm.handleSubmit(onSubmit)}>
                                <TextField
                                    label="First Name"
                                    disabled={!!registerMutation.isPending}
                                    error={!!registerForm.formState.errors.firstName}
                                    helperText={registerForm.formState.errors.firstName?.message}
                                    {...registerForm.register("firstName", { required: "Field required" })}
                                />
                                <TextField
                                    label="Last Name"
                                    disabled={!!registerMutation.isPending}
                                    error={!!registerForm.formState.errors.lastName}
                                    helperText={registerForm.formState.errors.lastName?.message}
                                    {...registerForm.register("lastName", { required: "Field required" })}
                                />
                                <TextField
                                    label="Password"
                                    type="password"
                                    autoComplete="current-password"
                                    disabled={!!registerMutation.isPending}
                                    error={!!registerForm.formState.errors.password}
                                    helperText={registerForm.formState.errors.password?.message}
                                    {...registerForm.register("password", { required: "Field required", minLength: { value: 8, message: "Password must be at least 8 characters" }, pattern: { value: /[!@#$%^&*(),.?":{}|<>]/, message: "Password must contain at least one special character" } })}
                                />
                                <TextField
                                    label="Retype password"
                                    type="password"
                                    autoComplete="current-password"
                                    disabled={!!registerMutation.isPending}
                                    error={!!registerForm.formState.errors.rePassword}
                                    helperText={registerForm.formState.errors.rePassword?.message}
                                    {...registerForm.register("rePassword", { required: "Field required", validate: (value) => value === registerForm.getValues('password') || 'Passwords do not match' })}
                                />
                                <TextField
                                    label="Phone number"
                                    disabled={!!registerMutation.isPending}
                                    error={!!registerForm.formState.errors.phone}
                                    helperText={registerForm.formState.errors.phone?.message}
                                    {...registerForm.register("phone", { required: "Field required", minLength: { value: 9, message: "Not a proper phone number." }, maxLength: { value: 15, message: "Not a proper phone number." } })}
                                />
                                <TextField
                                    label="Age"
                                    type="number"
                                    disabled={!!registerMutation.isPending}
                                    error={!!registerForm.formState.errors.age}
                                    helperText={registerForm.formState.errors.age?.message}
                                    {...registerForm.register("age", { required: "Field required" })}
                                />
                                <button className="auth-button" type="submit">Sign Up</button>
                            </form>
                            <div className="mt-3 cursor-pointer" onClick={() => { setEmailValid(false); registerForm.reset(); }}>Go back</div>
                            {registerMutation.isPending ? (<LoadingSpinner isLoading={false}/>) : ""} {/*CHANGEEE*/}
                        </>
                    )}
                    <div>{regInfo.message}</div>
                </div>
                <div className={styles.right}>

                </div>
            </div>
        </div>
    )
}

export default Register;
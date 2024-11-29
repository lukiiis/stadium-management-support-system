import { useForm } from "react-hook-form";
import styles from "./Login.module.scss"
import TextField from '@mui/material/TextField';
import { useLoginUser } from "./loginFunctions";
import { useState } from "react";
import styled from "@emotion/styled";
import { Button, CircularProgress } from "@mui/material";
import { LoginData, LoginStatus } from "../../shared/types/auth/login";

const LoginTextField = styled(TextField)({
    width: '100%',
    minHeight: '80px'
})

const Login = () => {
    // create interfaces
    const loginForm = useForm<LoginData>({
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const [loginInfo, setLoginInfo] = useState<LoginStatus>({
        message: "",
        status: ""
    });

    //mutation
    const loginMutation = useLoginUser(setLoginInfo, loginForm);

    const onSubmit = async (data: LoginData) => {
        try {
            loginMutation.mutate(data, {
                onSuccess: () => {
                    // setShowPopup(true);
                    console.log(data);
                    console.log('zalogowano pomyslnie')
                },
                onError: () => {
                    // setShowPopup(true);
                    console.log(data);
                    console.log('blad logowania')
                }
            });
        }
        catch (error) {
            console.log(error)
        }
    }

    return (
        <div className={styles.loginContainer}>
            <div className={styles.logo}>

            </div>
            <div className={styles.loginBox}>
                <div className={styles.left}>
                    <div className={styles.leftContainer}>
                        <div className="flex flex-col gap-2 items-center">
                            <h1>Hello Again!</h1>
                            <p className="text-center">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </div>
                        <form className={styles.loginForm} onSubmit={loginForm.handleSubmit(onSubmit)}>
                            <div className="flex flex-col gap-3">
                                <LoginTextField
                                    label="Email"
                                    disabled={!!loginMutation.isPending}
                                    error={!!loginForm.formState.errors.email}
                                    helperText={loginForm.formState.errors.email?.message}
                                    {...loginForm.register("email", { required: "Field required", pattern: { value: /\S+@\S+\.\S+/, message: "Entered value does not match email format", } })}
                                />
                                <LoginTextField
                                    label="Password"
                                    type="password"
                                    autoComplete="current-password"
                                    disabled={!!loginMutation.isPending}
                                    error={!!loginForm.formState.errors.password}
                                    helperText={loginForm.formState.errors.password?.message}
                                    {...loginForm.register("password", { required: "Field required" })}
                                />
                            </div>
                            <div className="flex items-center justify-center">
                                <Button
                                    variant="contained"
                                    type="submit"
                                    disabled={!!loginMutation.isPending}
                                >
                                    Login
                                </Button>
                            </div>
                            <div className="flex items-center justify-center h-10">
                                {loginMutation.isPending ? <CircularProgress /> : ""}
                            </div>
                        </form>
                        <div>{loginInfo.message}</div>
                    </div>
                </div>
                <div className={styles.right}>

                </div>
            </div>
        </div>
    )
}

export default Login;
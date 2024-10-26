import { useForm } from "react-hook-form";
import styles from "./Login.module.scss"
import TextField from '@mui/material/TextField';
import { LoginData, LoginStatus, useLoginUser } from "./loginFunctions";
import { useState } from "react";

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
                    <h1>Hello Again!</h1>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <form className="flex flex-col" onSubmit={loginForm.handleSubmit(onSubmit)}>
                        <TextField
                            id="outlined-standard-input"
                            label="Email"
                            error={!!loginForm.formState.errors.email}
                            helperText={loginForm.formState.errors.email?.message}
                            {...loginForm.register("email", { required: "Field required", pattern: { value: /\S+@\S+\.\S+/, message: "Entered value does not match email format", } })}
                        />
                        <TextField
                            id="outlined-password-input"
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                            error={!!loginForm.formState.errors.password}
                            helperText={loginForm.formState.errors.password?.message}
                            {...loginForm.register("password", { required: "Field required" })}
                        />
                        <button className="auth-button" type="submit">Sign in</button>
                    </form>
                    <div>{loginInfo.message}</div>
                </div>
                <div className={styles.right}>

                </div>
            </div>
        </div>
    )
}

export default Login;
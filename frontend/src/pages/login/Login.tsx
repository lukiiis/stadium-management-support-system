import { useForm } from "react-hook-form";
import styles from "./Login.module.scss"
import TextField from '@mui/material/TextField';

const Login = () => {
    // create interfaces
    const loginForm = useForm({
        defaultValues: {
            email: '',
            password: ''
        }
    })

    return (
        <div className={styles.loginContainer}>
            <div className={styles.logo}>

            </div>
            <div className={styles.loginBox}>
                <div className={styles.left}>
                    <h1>Hello Again!</h1>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <form className="flex flex-col">
                        <TextField
                            id="outlined-standard-input"
                            label="Email"
                            {...loginForm.register("password", { required: "Field required" })}
                        />
                        <TextField
                            id="outlined-password-input"
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                            {...loginForm.register("password", { required: "Field required" })}
                        />
                    </form>
                </div>
                <div className={styles.right}>

                </div>
            </div>
        </div>
    )
}

export default Login;
import React, { useState } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import PersonalData from "./personal-data/PersonalData";
import PasswordData from "./password-data/PasswordData";
import AddressData from "./address-data/AddressData";
import styles from "./AccountInfo.module.scss";
import { Alert, AlertColor, Snackbar } from "@mui/material";
import { AccountInfoContext } from "./accountInfoService";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Person, Lock } from "@mui/icons-material";

const AccountInfo: React.FC = () => {
    const token = localStorage.getItem("token");

    if (token === null) {
        return <Navigate to="/" replace />;
    }

    const userId = parseInt(jwtDecode<JwtPayload>(token).sub as string, 10);

    const [snackbarSeverity, setSnackbarSeverity] = useState<string>("error")
    const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
    const [showSnackbar, setShowSnackbar] = useState<boolean>(false);

    const handleCloseSnackbar = () => {
        setShowSnackbar(false);
        setSnackbarMessage(null);
    };

    return (
        <div className={styles.accountInfo}>
            <Snackbar
                open={showSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                className={styles.customSnackbar}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbarSeverity as AlertColor}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                Account Information
            </motion.h1>

            <AccountInfoContext.Provider value={{ userId, setSnackbarSeverity, setSnackbarMessage, setShowSnackbar }}>
                <motion.div
                    className={styles.section}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <h2>
                        <span className={styles.icon}>
                            <Person />
                        </span>
                        Personal Information
                    </h2>
                    <PersonalData userId={userId} />
                </motion.div>

                <hr className={styles.divider} />

                <motion.div
                    className={styles.section}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <h2>
                        <span className={styles.icon}>
                            <Home />
                        </span>
                        Address Details
                    </h2>
                    <AddressData userId={userId} />
                </motion.div>

                <hr className={styles.divider} />

                <motion.div
                    className={styles.section}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <h2>
                        <span className={styles.icon}>
                            <Lock />
                        </span>
                        Security
                    </h2>
                    <PasswordData userId={userId} />
                </motion.div>
            </AccountInfoContext.Provider>
        </div>
    );
};

export default AccountInfo;

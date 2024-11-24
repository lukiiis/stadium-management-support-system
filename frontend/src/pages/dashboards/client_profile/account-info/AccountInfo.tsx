import React, { useState } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import PersonalData from "./personal-data/PersonalData";
import PasswordData from "./password-data/PasswordData";
import AddressData from "./address-data/AddressData";
import styles from "./AccountInfo.module.scss";
import { Alert, AlertColor, Divider, Snackbar } from "@mui/material";
import { AccountInfoContext } from "./accountInfoService";

const AccountInfo: React.FC = () => {
    const token = localStorage.getItem("token") as string;
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
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity as AlertColor} variant="filled">
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <h1>Account Information</h1>
            <AccountInfoContext.Provider value={{ userId, setSnackbarSeverity, setSnackbarMessage, setShowSnackbar }}>
                <PersonalData userId={userId} />
                <Divider variant="middle" />
                <AddressData userId={userId} />
                <Divider variant="middle" />
                <PasswordData userId={userId} />
            </AccountInfoContext.Provider>
        </div>
    );
};

export default AccountInfo;

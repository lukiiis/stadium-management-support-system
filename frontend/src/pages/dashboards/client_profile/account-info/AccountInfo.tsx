import React from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import PersonalData from "./personal-data/PersonalData";
import PasswordData from "./password-data/PasswordData";
import AddressData from "./address-data/AddressData";
import styles from "./AccountInfo.module.scss";

const AccountInfo: React.FC = () => {
    const token = localStorage.getItem("token") as string;
    const userId = parseInt(jwtDecode<JwtPayload>(token).sub as string, 10);

    return (
        <div className={styles.accountInfo}>
            <h1>Account Information</h1>
            <PersonalData userId={userId} />
            <PasswordData userId={userId} />
            <AddressData userId={userId} />
        </div>
    );
};

export default AccountInfo;

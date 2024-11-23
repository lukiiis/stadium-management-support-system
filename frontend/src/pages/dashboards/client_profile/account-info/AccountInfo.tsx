import React from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";

const AccountInfo: React.FC = () => {
    const token = localStorage.getItem("token") as string;
    const userId = jwtDecode<JwtPayload>(token).sub as string;

    console.log(userId)

    return (
        <div>Account Info</div>
    )
}

export default AccountInfo;
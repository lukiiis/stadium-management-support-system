import React from "react";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { Outlet } from "react-router-dom";
import styles from "./Layout.module.scss"

const Layout: React.FC = () => {
    return (
        <>
            <Navbar />
            <div className={styles.main}>
                <div className={styles.wrapper}>
                    <Outlet />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Layout;
import React from "react";
import Navbar from "../../navbar/Navbar";
import Footer from "../../footer/Footer";
import { Outlet } from "react-router-dom";
import styles from "./Layout.module.scss"

const Layout: React.FC = () => {
    return (
        <>
            <Navbar />
                <div className={styles.main}>
                    <Outlet />
                </div>
            <Footer />
        </>
    )
}

export default Layout;
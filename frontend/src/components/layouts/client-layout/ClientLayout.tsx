import withRoleValidation from "../../hoc/roleValidationForLayouts/withRoleValidation";
import React from "react";
import Navbar from "../../navbar/Navbar";
import Footer from "../../footer/Footer";
import { Outlet } from "react-router-dom";
// import styles from "./ClientLayout.module.scss"

const ClientLayout: React.FC = () => (
    <>
        <Navbar />

                <Outlet />

        <Footer />
    </>
);

export default withRoleValidation(ClientLayout, "CLIENT");
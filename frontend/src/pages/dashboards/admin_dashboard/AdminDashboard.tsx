import { Link, Outlet } from "react-router-dom";
import { Container, Typography, Box, Paper } from "@mui/material";
import styles from "./AdminDashboard.module.scss";

const AdminDashboard = () => {
    return (
        <Container className={styles.dashboardContainer}>
            <Paper elevation={3} className={styles.dashboardPaper}>
                <Typography variant="h4" component="h1" className={styles.title}>
                    Admin Dashboard
                </Typography>
                <Box className={styles.linksContainer}>
                    <Link to="create-employee" className={`${styles.linkButton}`}>
                        Create Employee
                    </Link>
                    <Link to="block-account" className={`${styles.linkButton} ${styles.secondary}`}>
                        Block Account
                    </Link>
                </Box>
                <Outlet />
            </Paper>
        </Container>
    );
};

export default AdminDashboard;
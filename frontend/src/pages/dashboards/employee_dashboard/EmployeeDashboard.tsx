import { Link, Outlet } from "react-router-dom";
import { Container, Typography, Button, Box } from "@mui/material";
import styles from "./EmployeeDashboard.module.scss";

const EmployeeDashboard = () => {
    return (
        <Container className={styles.dashboardContainer}>
            <Typography variant="h4" component="h1" className={styles.title}>
                Employee Dashboard
            </Typography>
            <Box className={styles.linksContainer}>
                <Button
                    component={Link}
                    to="add-tournament"
                    variant="contained"
                    color="primary"
                    className={styles.linkButton}
                >
                    Add Tournaments
                </Button>
                <Button
                    component={Link}
                    to="add-timesheet"
                    variant="contained"
                    color="secondary"
                    className={styles.linkButton}
                >
                    Add Timesheet
                </Button>
            </Box>
            <Outlet />
        </Container>
    );
};

export default EmployeeDashboard;
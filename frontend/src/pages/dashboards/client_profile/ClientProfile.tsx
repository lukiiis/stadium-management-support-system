import { Link, Outlet } from "react-router-dom";
import { Container, Typography, Box } from "@mui/material";
import styles from "./ClientProfile.module.scss";

const ClientProfile = () => {
    return (
        <Container className={styles.profileContainer}>
            <Typography variant="h4" component="h1" className={styles.title}>
                Client Profile
            </Typography>
            <Box className={styles.linksContainer}>
                <Link to="information" className={`${styles.linkButton}`}>
                    Profile
                </Link>
                <Link to="tournaments" className={`${styles.linkButton} ${styles.secondary}`}>
                    Tournaments
                </Link>
                <Link to="reservations" className={`${styles.linkButton} ${styles.success}`}>
                    Reservations
                </Link>
            </Box>
            <Outlet />
        </Container>
    );
};

export default ClientProfile;
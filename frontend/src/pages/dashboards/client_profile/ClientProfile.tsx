import { Link, Navigate, Outlet } from "react-router-dom";
import { CircularProgress, Typography } from "@mui/material";
import { motion } from "framer-motion";
import PersonIcon from '@mui/icons-material/Person';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import EventNoteIcon from '@mui/icons-material/EventNote';
import styles from "./ClientProfile.module.scss";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useGetUserById } from "./clientProfileService";

const ClientProfile = () => {
    const token = localStorage.getItem("token");

    if (token === null) {
        return <Navigate to="/" replace />;
    }

    const userId = parseInt(jwtDecode<JwtPayload>(token).sub as string, 10);
    const { data: user, isLoading } = useGetUserById(userId);

    return (
        <div className={styles.pageContainer}>
            <div className={styles.wrapper}>
                <div className={styles.content}>
                    <motion.div
                        className={styles.profileHeader}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className={styles.avatarContainer}>
                            <PersonIcon className={styles.avatarIcon} />
                        </div>
                        <Typography variant="h3" className={styles.userName}>
                            {isLoading ? (
                                <CircularProgress />
                            ) : (
                                <>
                                    {user?.firstName} {user?.lastName}
                                </>
                            )}
                        </Typography>
                        <Typography variant="subtitle1" className={styles.userRole}>
                            {isLoading ? (
                                <CircularProgress />
                            ) : (
                                <>
                                    {user?.role}
                                </>
                            )}
                        </Typography>
                    </motion.div>

                    <motion.div
                        className={styles.navigationCards}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Link to="information" className={styles.navCard}>
                            <PersonIcon className={styles.navIcon} />
                            <div className={styles.navContent}>
                                <Typography variant="h6">Personal Info</Typography>
                                <Typography variant="body2">View and edit your profile</Typography>
                            </div>
                        </Link>

                        <Link to="tournaments" className={styles.navCard}>
                            <EmojiEventsIcon className={styles.navIcon} />
                            <div className={styles.navContent}>
                                <Typography variant="h6">My Tournaments</Typography>
                                <Typography variant="body2">Check your tournament entries</Typography>
                            </div>
                        </Link>

                        <Link to="reservations" className={styles.navCard}>
                            <EventNoteIcon className={styles.navIcon} />
                            <div className={styles.navContent}>
                                <Typography variant="h6">My Reservations</Typography>
                                <Typography variant="body2">Manage your bookings</Typography>
                            </div>
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}

                    >
                        <Outlet />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ClientProfile;
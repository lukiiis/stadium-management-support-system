import { Link, Outlet } from "react-router-dom";
import { Typography } from "@mui/material";
import { motion } from "framer-motion";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BlockIcon from '@mui/icons-material/Block';
import styles from "./AdminDashboard.module.scss";

const AdminDashboard = () => {
    return (
        <div className={styles.pageContainer}>
            <div className={styles.wrapper}>
                <div className={styles.content}>
                    <motion.div
                        className={styles.header}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className={styles.avatarContainer}>
                            <AdminPanelSettingsIcon className={styles.avatarIcon} />
                        </div>
                        <Typography variant="h3" className={styles.title}>
                            Admin Dashboard
                        </Typography>
                        <Typography variant="subtitle1" className={styles.subtitle}>
                            Manage your system settings and users
                        </Typography>
                    </motion.div>

                    <motion.div
                        className={styles.navigationCards}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Link to="create-employee" className={styles.navCard}>
                            <PersonAddIcon className={styles.navIcon} />
                            <div className={styles.navContent}>
                                <Typography variant="h6">Create Employee</Typography>
                                <Typography variant="body2">Add new staff members</Typography>
                            </div>
                        </Link>

                        <Link to="block-account" className={styles.navCard}>
                            <BlockIcon className={styles.navIcon} />
                            <div className={styles.navContent}>
                                <Typography variant="h6">Manage Accounts</Typography>
                                <Typography variant="body2">Manage user access</Typography>
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

export default AdminDashboard;
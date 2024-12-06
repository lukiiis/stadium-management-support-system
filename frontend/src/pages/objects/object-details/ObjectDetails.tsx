import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetObjectTypes } from "../objectTypesService";
import { CircularProgress, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styles from "./ObjectDetails.module.scss";

const ObjectDetails: React.FC = () => {
    const { objectId } = useParams<{ objectId: string }>();
    const { data: objectTypes, isLoading, error } = useGetObjectTypes();
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <div className={styles.loaderContainer}>
                <CircularProgress size={60} />
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <Typography variant="h5" color="error">Error loading facility details</Typography>
                <Typography color="textSecondary">Please try again later</Typography>
            </div>
        );
    }

    const objectType = objectTypes?.find(obj => obj.objectId === parseInt(objectId || "", 10));

    if (!objectType) {
        return <div className={styles.errorContainer}>Facility not found</div>;
    }

    return (
        <div className={styles.pageContainer}>

            <motion.div
                className={styles.heroSection}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                style={{ backgroundImage: `url(${objectType.imageUrl})` }}
            >
                <div className={styles.heroOverlay} />
            </motion.div>

            <div className={styles.contentWrapper}>
                <motion.div
                    className={styles.content}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/objects')}
                        className={styles.backButton}
                    >
                        Back to Facilities
                    </Button>

                    <div className={styles.facilityInfo}>
                        <Typography variant="h2" className={styles.title}>
                            {objectType.type}
                        </Typography>

                        <div className={styles.details}>
                            <div className={styles.infoCard}>
                                <Typography variant="h6" className={styles.sectionTitle}>
                                    Description
                                </Typography>
                                <Typography variant="body1" className={styles.description}>
                                    {objectType.description}
                                </Typography>
                            </div>

                            <div className={styles.actions}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    onClick={() => navigate('/reservations')}
                                    className={styles.actionButton}
                                >
                                    Make a Reservation
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ObjectDetails;
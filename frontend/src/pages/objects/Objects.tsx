import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetObjectTypes } from "./objectTypesService";
import { CircularProgress, Card, CardContent, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Objects.module.scss";

const Objects: React.FC = () => {
    const { data: objectTypes, isLoading, error } = useGetObjectTypes();
    const navigate = useNavigate();

    const handleCardClick = (objectId: number) => {
        navigate(`/objects/${objectId}`);
    };

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
                <Typography variant="h5" color="error">Error loading facilities</Typography>
                <Typography color="textSecondary">Please try again later</Typography>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.wrapper}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={styles.header}
                >
                    <Typography variant="h3" component="h1">
                        Our Facilities
                    </Typography>
                    <Typography variant="subtitle1">
                        Explore our world-class sports venues
                    </Typography>
                </motion.div>

                <div className={styles.objectsGrid}>
                    <AnimatePresence>
                        {objectTypes?.map((objectType, index) => (
                            <motion.div
                                key={objectType.objectId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1
                                }}
                                whileHover={{ y: -10 }}
                            >
                                <Card
                                    className={styles.objectCard}
                                    onClick={() => handleCardClick(objectType.objectId)}
                                >
                                    <div className={styles.imageContainer}>
                                        <img src={objectType.imageUrl} alt={objectType.type} />
                                    </div>
                                    <CardContent className={styles.cardContent}>
                                        <Typography variant="h5" component="h2">
                                            {objectType.type}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Objects;
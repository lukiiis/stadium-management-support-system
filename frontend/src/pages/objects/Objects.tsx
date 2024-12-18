import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetObjectTypes } from "./objectTypesService";
import { CircularProgress, Card, CardContent, Typography, Container } from "@mui/material";
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
                <CircularProgress size={60} color="primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <Typography variant="h5" color="error">
                    Error loading facilities
                </Typography>
                <Typography color="textSecondary">Please try again later</Typography>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            <Container maxWidth="xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={styles.header}
                >
                    <Typography variant="h2" component="h2" className={styles.title}>
                        Our Facilities
                    </Typography>
                    <Typography className={styles.subtitle}>
                        Explore our world-class sports venues and find the perfect spot for your next game
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
                                whileHover={{
                                    y: -10,
                                    transition: { duration: 0.2 }
                                }}
                            >
                                <Card
                                    className={styles.objectCard}
                                    onClick={() => handleCardClick(objectType.objectId)}
                                    elevation={4}
                                >
                                    <div className={styles.imageContainer}>
                                        <img src={objectType.imageUrl} alt={objectType.type} />
                                        <div className={styles.overlay} />
                                    </div>
                                    <CardContent className={styles.cardContent}>
                                        <Typography variant="h4" className={styles.cardTitle}>
                                            {objectType.type}
                                        </Typography>
                                        <Typography variant="body1" className={styles.cardDescription}>
                                            {objectType.description?.slice(0, 100)}...
                                        </Typography>
                                        <motion.button
                                            className={styles.exploreButton}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Explore Venue
                                        </motion.button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </Container>
        </div>
    );
};

export default Objects;
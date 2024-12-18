// Home.tsx
import React from "react";
import { useGetObjectTypes } from "./homeFunctions";
import { CircularProgress, Typography, Container, Button, Box } from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import styles from "./Home.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Home: React.FC = () => {
    const navigate = useNavigate();
    const { data: objectTypes, isLoading, error } = useGetObjectTypes();

    const token = localStorage.getItem("token");

    return (
        <div className={styles.homeContainer}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className={styles.heroSection}
            >
                <Typography variant="h1" className={styles.heroTitle}>
                    Welcome to Stadium Management System
                </Typography>
                <Typography variant="h4" className={styles.heroSubtitle}>
                    Book your perfect sports venue today
                </Typography>
                <Box className={styles.heroCta}>
                    {!token && (
                        <Button
                            component={Link}
                            to="/login"
                            variant="contained"
                            size="large"
                            className={styles.ctaButton}
                        >
                            Get Started
                        </Button>
                    )}
                </Box>
            </motion.div>

            <div className={styles.carouselSection}>
                <Container maxWidth="xl">
                    <Typography variant="h3" className={styles.sectionTitle}>
                        Our Facilities
                    </Typography>
                    {isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Typography color="error" sx={{ textAlign: 'center', py: 4 }}>
                            Error loading facilities
                        </Typography>
                    ) : (
                        <Carousel
                            showThumbs={false}
                            autoPlay
                            infiniteLoop
                            interval={5000}
                            showStatus={false}
                            className={styles.carousel}
                        >
                            {objectTypes?.map((objectType) => (
                                <motion.div
                                    key={objectType.objectId}
                                    className={styles.carouselItem}
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.3 }}
                                    onClick={() => navigate(`/objects/${objectType.objectId}`)}
                                >
                                    <img src={objectType.imageUrl} alt={objectType.type} />
                                    <div className={styles.carouselCaption}>
                                        <Typography variant="h5">{objectType.type.toUpperCase()}</Typography>
                                    </div>
                                </motion.div>
                            ))}
                        </Carousel>
                    )}
                </Container>
            </div>

            <div className={styles.featuresSection}>
                <Container maxWidth="lg">
                    <Typography variant="h3" className={styles.sectionTitle}>
                        Our Services
                    </Typography>
                    <div className={styles.featuresGrid}>
                        <motion.div
                            className={styles.featureCard}
                            whileHover={{ y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Link to="/reservations" className={styles.featureLink}>
                                <Typography variant="h5">Reservations</Typography>
                                <Typography>Book your preferred time slot</Typography>
                            </Link>
                        </motion.div>
                        <motion.div
                            className={styles.featureCard}
                            whileHover={{ y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Link to="/tournaments" className={styles.featureLink}>
                                <Typography variant="h5">Tournaments</Typography>
                                <Typography>Join exciting competitions</Typography>
                            </Link>
                        </motion.div>
                        <motion.div
                            className={styles.featureCard}
                            whileHover={{ y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Link to="/objects" className={styles.featureLink}>
                                <Typography variant="h5">Facilities</Typography>
                                <Typography>Explore our venues</Typography>
                            </Link>
                        </motion.div>
                    </div>
                </Container>
            </div>

            <div className={styles.ctaSection}>
                <Container maxWidth="md">
                    <Typography variant="h3">Ready to Get Started?</Typography>
                    <Typography variant="body1" className={styles.ctaText}>
                        {token ? ("Create reservations for great facilities and explore our services!") : ("Join our community and start booking your sports activities today")}
                    </Typography>
                    {!token && (
                        <Box className={styles.ctaButtons}>
                            <Button
                                component={Link}
                                to="/register"
                                variant="contained"
                                size="large"
                                className={styles.registerButton}
                            >
                                Register Now
                            </Button>
                            <Button
                                component={Link}
                                to="/login"
                                variant="outlined"
                                size="large"
                                className={styles.loginButton}
                            >
                                Login
                            </Button>
                        </Box>
                    )}
                </Container>
            </div>
        </div>
    );
};

export default Home;
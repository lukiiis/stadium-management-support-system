// Home.tsx updates
import React from "react";
import { useGetObjectTypes } from "./homeFunctions";
import { CircularProgress, Typography, Container } from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import styles from "./Home.module.scss";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
    const { data: objectTypes, isLoading, error } = useGetObjectTypes();

    if (isLoading) return (
        <Container sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
        </Container>
    );

    if (error) return (
        <Container sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="error">Error loading object types</Typography>
        </Container>
    );

    return (
        <div className={styles.homeContainer}>
            <div className={styles.carouselContainer}>
                <Carousel
                    showThumbs={false}
                    autoPlay
                    infiniteLoop
                    interval={5000}
                    showStatus={false}
                >
                    {objectTypes?.map((objectType) => (
                        <div key={objectType.objectId} className={styles.carouselItem}>
                            <img src={objectType.imageUrl} alt={objectType.type} />
                            <div className={styles.carouselCaption}>
                                <Typography variant="h5">{objectType.type}</Typography>
                                <Typography variant="body1">{objectType.description}</Typography>
                            </div>
                        </div>
                    ))}
                </Carousel>
            </div>

            <Container className={styles.welcomeSection}>
                <Typography variant="h1">Welcome to COMPANY NAME</Typography>
                <Typography variant="body1">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Pellentesque condimentum nulla mauris, eget cursus urna venenatis in.
                </Typography>
            </Container>

            <div className={styles.navigationSection}>
                <h2>Check out our services</h2>
                <div className={styles.links}>
                    <Link to="reservations">Reservations</Link>
                    <Link to="tournaments">Tournaments</Link>
                    <Link to="objects">Objects</Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
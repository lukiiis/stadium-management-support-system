import React from "react";
import { useGetObjectTypes } from "./homeFunctions";
import { CircularProgress, Typography } from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import styles from "./Home.module.scss";

const Home: React.FC = () => {
    const { data: objectTypes, isLoading, error } = useGetObjectTypes();
    if (isLoading) {
        return <CircularProgress />;
    }

    if (error) {
        return <div>Error loading object types</div>;
    }

    return (
        <div className={styles.carouselContainer}>
            <Carousel showThumbs={false} autoPlay infiniteLoop>
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
    );
};

export default Home;
import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetObjectTypes } from "./objectTypesService";
import { CircularProgress, Card, CardContent, Typography } from "@mui/material";
import styles from "./Objects.module.scss";

const Objects: React.FC = () => {
    const { data: objectTypes, isLoading, error } = useGetObjectTypes();
    const navigate = useNavigate();

    if (isLoading) {
        return <CircularProgress />;
    }

    if (error) {
        return <div>Error loading object types</div>;
    }

    const handleCardClick = (objectId: number) => {
        navigate(`/objects/${objectId}`);
    };

    return (
        <div className={styles.objectsContainer}>
            {objectTypes?.map((objectType) => (
                <Card
                    key={objectType.objectId}
                    className={styles.objectCard}
                    onClick={() => handleCardClick(objectType.objectId)}
                    style={{ backgroundImage: `url(${objectType.imageUrl})` }}
                >
                    <CardContent className={styles.cardContent}>
                        <Typography variant="h5" component="div">
                            {objectType.type}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default Objects;
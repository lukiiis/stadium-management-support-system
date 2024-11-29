import React from "react";
import { useParams } from "react-router-dom";
import { useGetObjectTypes } from "../objectTypesService";
import { CircularProgress, Card, CardContent, Typography } from "@mui/material";
import styles from "./ObjectDetails.module.scss";

const ObjectDetails: React.FC = () => {
    const { objectId } = useParams<{ objectId: string }>();
    const { data: objectTypes, isLoading, error } = useGetObjectTypes();

    if (isLoading) {
        return <CircularProgress />;
    }

    if (error) {
        return <div>Error loading object details</div>;
    }

    const objectType = objectTypes?.find(obj => obj.objectId === parseInt(objectId || "", 10));

    if (!objectType) {
        return <div>Object not found</div>;
    }

    return (
        <div className={styles.objectDetailsContainer}>
            <Card className={styles.objectCard} style={{ backgroundImage: `url(${objectType.imageUrl})` }}>
                <CardContent className={styles.cardContent}>
                    <Typography variant="h4" component="div">
                        {objectType.type}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {objectType.description}
                    </Typography>
                </CardContent>
            </Card>
        </div>
    );
};

export default ObjectDetails;
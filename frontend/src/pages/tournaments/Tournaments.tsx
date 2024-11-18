import React, { useState, useEffect } from "react";
import styles from "./Tournaments.module.scss";
import { useGetTournaments, useGetObjectTypes } from "./tournamentsService";
import { Select, MenuItem, FormControl, InputLabel, CircularProgress, Button, SelectChangeEvent } from "@mui/material";

const Tournaments = () => {
    const [selectedObjectId, setSelectedObjectId] = useState<string>("all");
    const [isClient, setIsClient] = useState<boolean>(false);
    const { data: tournaments, isLoading: loadingTournaments } = useGetTournaments();
    const { data: objectTypes, isLoading: loadingObjectTypes } = useGetObjectTypes();

    // Check for role and token in localStorage
    useEffect(() => {
        const role = localStorage.getItem("role");
        const token = localStorage.getItem("token");
        if (role === "CLIENT" && token) {
            setIsClient(true);
        }
    }, []);

    // Handle selection change
    const handleSelectChange = (event: SelectChangeEvent) => {
        setSelectedObjectId(event.target.value as string);
    };

    // Filtered tournaments
    const filteredTournaments = selectedObjectId === "all" 
        ? tournaments 
        : tournaments?.filter(tournament => tournament.objectType.objectId.toString() === selectedObjectId);

    if (loadingTournaments || loadingObjectTypes) {
        return <div className={styles.loader}><CircularProgress /></div>;
    }

    return (
        <div className={styles.container}>
            <FormControl fullWidth className={styles.select}>
                <InputLabel id="object-filter-label">Filter by Object</InputLabel>
                <Select
                    labelId="object-filter-label"
                    value={selectedObjectId}
                    onChange={handleSelectChange}
                >
                    <MenuItem value="all">Show all tournaments</MenuItem>
                    {objectTypes?.map(objectType => (
                        <MenuItem key={objectType.objectId} value={objectType.objectId.toString()}>
                            Show tournaments for object {objectType.objectId}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <div className={styles.tournamentsList}>
                {filteredTournaments?.map(tournament => (
                    <div key={tournament.tournamentId} className={styles.tournamentCard}>
                        <h3>{tournament.sport}</h3>
                        <p><strong>Description:</strong> {tournament.description}</p>
                        <p><strong>Max Slots:</strong> {tournament.maxSlots}</p>
                        <p><strong>Occupied Slots:</strong> {tournament.occupiedSlots}</p>
                        <p><strong>Start Date:</strong> {new Date(tournament.startDate).toLocaleDateString()}</p>
                        <p><strong>End Date:</strong> {new Date(tournament.endDate).toLocaleDateString()}</p>
                        <p><strong>Object Type:</strong> {tournament.objectType.type}</p>
                        <img src={tournament.objectType.imageUrl} alt={tournament.objectType.type} className={styles.image} />
                        
                        {isClient && (
                            <div className={styles.buttons}>
                                <Button 
                                    variant="contained" 
                                    color="primary"
                                    onClick={() => console.log(`Joining tournament ${tournament.tournamentId}`)}
                                >
                                    Join
                                </Button>
                                <Button 
                                    variant="outlined" 
                                    color="secondary"
                                    onClick={() => console.log(`Leaving tournament ${tournament.tournamentId}`)}
                                >
                                    Leave
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tournaments;

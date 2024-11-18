import React, { useState, useEffect } from "react";
import styles from "./Tournaments.module.scss";
import { useGetTournaments, useGetObjectTypes, useGetUsersTournaments } from "./tournamentsService";
import { Select, MenuItem, FormControl, InputLabel, CircularProgress, Button, SelectChangeEvent } from "@mui/material";

const Tournaments = () => {
    const [selectedObjectId, setSelectedObjectId] = useState<string>("all");
    const [isClient, setIsClient] = useState<boolean>(false);
    const [userId, setUserId] = useState<number | null>(null);

    const { data: tournaments, isLoading: loadingTournaments } = useGetTournaments();
    const { data: objectTypes, isLoading: loadingObjectTypes } = useGetObjectTypes();

    // Pobieramy userId z localStorage
    useEffect(() => {
        const role = localStorage.getItem("role");
        const token = localStorage.getItem("token");
        const storedUserId = localStorage.getItem("userId");

        if (role === "CLIENT" && token && storedUserId) {
            setIsClient(true);
            setUserId(parseInt(storedUserId, 10));
        }
    }, []);

    // Pobieramy turnieje użytkownika
    const { data: usersTournaments, isLoading: loadingUsersTournaments } = useGetUsersTournaments(userId || 0);

    // Handle selection change
    const handleSelectChange = (event: SelectChangeEvent) => {
        setSelectedObjectId(event.target.value as string);
    };

    // Filtered tournaments
    const filteredTournaments = selectedObjectId === "all" 
        ? tournaments 
        : tournaments?.filter(tournament => tournament.objectType.objectId.toString() === selectedObjectId);

    // Sprawdzanie, czy użytkownik już dołączył do turnieju
    const isUserInTournament = (tournamentId: number): boolean => {
        return usersTournaments?.some(userTournament => userTournament.tournament.tournamentId === tournamentId) || false;
    };

    if (loadingTournaments || loadingObjectTypes || loadingUsersTournaments) {
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
                                {!isUserInTournament(tournament.tournamentId) ? (
                                    <Button 
                                        variant="contained" 
                                        color="primary"
                                        onClick={() => console.log(`Joining tournament ${tournament.tournamentId}`)}
                                    >
                                        Join
                                    </Button>
                                ) : (
                                    <Button 
                                        variant="outlined" 
                                        color="secondary"
                                        onClick={() => console.log(`Leaving tournament ${tournament.tournamentId}`)}
                                    >
                                        Leave
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tournaments;

import React, { useEffect, useState } from "react";
import { CircularProgress, List, ListItem, ListItemAvatar, ListItemText, Typography, Box, Avatar } from "@mui/material";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ReservationsList = () => {
    const { jwt } = useAuth();
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const res = await fetch("/api/bookings", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwt}`,
                    },
                });
                const data = await res.json();
                if (!res.ok) {
                    toast.error(data.message || "Error al obtener las reservas");
                    setLoading(false);
                    return;
                }
                setReservations(data.bookings);
            } catch (error) {
                console.error("Error fetching reservations:", error);
                toast.error("Error de conexión al obtener reservas");
            } finally {
                setLoading(false);
            }
        };

        if (jwt) {
            fetchReservations();
        }
    }, [jwt]);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!reservations.length) {
        return (
            <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 500, color: "text.secondary" }}>
                    Aún no tienes reservas realizadas.
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <ToastContainer position="top-center" autoClose={5000} />
            <List>
                {reservations.map((booking) => (
                    <ListItem
                        key={booking._id}
                        sx={{
                            border: "1px solid #ddd",
                            borderRadius: 2,
                            transition: "transform 0.3s",
                            "&:hover": { 
                                transform: "scale(1.05)", 
                                cursor: "pointer" 
                            },
                        }}
                        onClick={() => window.location.href = `/confirm/${booking._id}`}
                    >
                        <ListItemAvatar sx={{ maxWidth: 100, mr: 2 }}>
                            <Avatar
                                variant="rounded"
                                src={booking.car.image}
                                sx={{
                                    width: "100%",
                                    height: "auto",
                                    objectFit: "contain",
                                    borderRadius: "8px",
                                }}
                            />
                        </ListItemAvatar>
                        <ListItemText
                            primary={booking.car.name.replace(" o Similar", "")}
                            secondary={booking.car.category}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: "auto" }}>
                            {booking.search.pickupDate
                                ? format(new Date(booking.createdAt), "dd/MM/yyyy", { locale: es })
                                : ""} - {
                                    booking.search.returnDate
                                        ? format(new Date(booking.search.returnDate), "dd/MM/yyyy", { locale: es })
                                        : ""
                                }
                        </Typography>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default ReservationsList;

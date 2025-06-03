import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Box,
  Avatar,
  Pagination,
} from "@mui/material";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { encryptId } from "@/utils/encryption";

const ITEMS_PER_PAGE = 4; // ← Mostrar 5 por página

const ReservationsList = () => {
  const { jwt } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/bookings?page=${page}&limit=${ITEMS_PER_PAGE}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwt}`,
            },
          }
        );
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.message || "Error al obtener las reservas");
          return;
        }
        setReservations(data.bookings);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching reservations:", error);
        toast.error("Error de conexión al obtener reservas");
      } finally {
        setLoading(false);
      }
    };

    if (jwt) fetchReservations();
  }, [jwt, page]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!reservations.length) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 500, color: "text.secondary" }}
        >
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
              mb: 2, // espacio entre ítems
              transition: "transform 0.3s",
              "&:hover": {
                transform: "scale(1.03)",
                cursor: "pointer",
              },
            }}
            onClick={() => {
              const encryptedId = encryptId(booking._id);
              window.location.href = `/confirm/${encryptedId}`;
            }}
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
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ ml: "auto", whiteSpace: "nowrap" }}
            >
              {format(new Date(booking.createdAt), "dd/MM/yyyy", {
                locale: es,
              })}{" "}
              –{" "}
              {booking.search.returnDate
                ? format(new Date(booking.search.returnDate), "dd/MM/yyyy", {
                    locale: es,
                  })
                : ""}
            </Typography>
          </ListItem>
        ))}
      </List>

      {/* Paginación */}
      <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          disabled={loading}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default ReservationsList;

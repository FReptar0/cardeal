import { Box, Card, CardContent, Typography, Avatar, Button, Divider, Container, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import cars from "../data/cars.json"; // Importar datos del JSON

const UserProfile = () => {
    return (
        <Container sx={{ marginTop: 20, marginBottom: 10, maxWidth: "100vw", paddingX: 2 }}>
            {/* Encabezado del perfil */}
            <Box sx={{ position: "relative", background: "linear-gradient(90deg, #0B5D3C, #10906A)", height: 150, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "space-between", padding: 2, marginBottom: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar src="/user-avatar.png" sx={{ width: 80, height: 80, border: "4px solid white" }} />
                    <Box>
                        <Typography variant="h5" color="white">Juan Pérez</Typography>
                    </Box>
                </Box>
                <Button variant="outlined" sx={{ color: "white", borderColor: "white" }} startIcon={<EditIcon />}>Editar perfil</Button>
            </Box>

            {/* Contenido */}
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, marginTop: 2, marginBottom: 2 }}>
                {/* Acerca de mí */}
                <Card sx={{ flex: 1, border: "1px solid #ddd", borderRadius: 2 }}>
                    <CardContent>
                        <Typography variant="h6">Acerca de mí</Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle2">BIOGRAFÍA</Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.
                        </Typography>
                        <Typography variant="subtitle2">POSICIÓN</Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Diseñador de temas en <b>Bootstrap</b>.
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Box>
                                <Typography variant="subtitle2">TELÉFONO</Typography>
                                <Typography variant="body2">+52 55 1234 5678</Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2">FECHA DE NACIMIENTO</Typography>
                                <Typography variant="body2">01.10.1997</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                            <Box>
                                <Typography variant="subtitle2">CORREO ELECTRÓNICO</Typography>
                                <Typography variant="body2">juanperez@gmail.com</Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2">UBICACIÓN</Typography>
                                <Typography variant="body2">CDMX, México</Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>

                {/* Mis reservas */}
                <Card sx={{ flex: 1, border: "1px solid #ddd", borderRadius: 2 }}>
                    <CardContent>
                        <Typography variant="h6">Mis reservas</Typography>
                        <Divider sx={{ my: 2 }} />
                        <List>
                            {cars.map((car) => (
                                <ListItem 
                                    key={car.name} 
                                    sx={{ 
                                        border: "1px solid #ddd", 
                                        borderRadius: 2,
                                        transition: "transform 0.3s", 
                                        "&:hover": { 
                                            transform: "scale(1.05)" 
                                        } 
                                    }}
                                >
                                    <ListItemAvatar sx={{ maxWidth: 100, marginRight: 2 }}>
                                        <img src={car.image} alt={car.name} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }} />
                                    </ListItemAvatar>
                                    <ListItemText 
                                        primary={car.name.replace(" o Similar", "")} 
                                        secondary={car.category} 
                                    />
                                    <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 'auto' }}>
                                        20/10/2021
                                    </Typography>
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default UserProfile;

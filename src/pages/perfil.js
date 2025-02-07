import { Box, Card, CardContent, Typography, Avatar, Button, Divider, Container, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";

const cars = [
    {
        "name": "Toyota Camry LE",
        "category": "Sedán Mediano SDMR",
        "passengers": 5,
        "doors": 4,
        "luggage": 3,
        "transmission": "Automática",
        "price": 450.00,
        "image": "/cars/camry.png",
        "images": [
            "/cars/camry.png",
            "/cars/camry2.png",
            "/cars/camry3.jpg"
        ],
        "reservationDate": "07/02/2025"
    },
    {
        "name": "Honda CR-V Touring",
        "category": "SUV Mediano SFAR",
        "passengers": 5,
        "doors": 4,
        "luggage": 4,
        "transmission": "Automática",
        "price": 600.00,
        "image": "/cars/CRV.png",
        "images": [
            "/cars/CRV1.png",
            "/cars/CRV2.png",
            "/cars/CRV3.png"
        ],
        "reservationDate": "08/03/2025"
    },
    {
        "name": "Ford F-150 XLT",
        "category": "Camioneta Pickup PFAR",
        "passengers": 5,
        "doors": 4,
        "luggage": 5,
        "transmission": "Automática",
        "price": 750.00,
        "image": "/cars/f150.png",
        "images": [
            "/cars/f1501.png",
            "/cars/f1502.png",
            "/cars/f1503.png"
        ],
        "reservationDate": "09/04/2025"
    },
    {
        "name": "Mazda MX-5 Miata",
        "category": "Deportivo Convertible STMR",
        "passengers": 2,
        "doors": 2,
        "luggage": 1,
        "transmission": "Manual",
        "price": 800.00,
        "image": "/cars/miata.png",
        "images": [
            "/cars/miata1.png",
            "/cars/miata2.png",
            "/cars/miata3.png"
        ],
        "reservationDate": "10/05/2025"
    },
    {
        "name": "Nissan Versa Advance",
        "category": "Sedán Compacto CDMR",
        "passengers": 5,
        "doors": 4,
        "luggage": 3,
        "transmission": "Automática",
        "price": 350.00,
        "image": "/cars/versa.png",
        "images": [
            "/cars/versa1.png",
            "/cars/versa2.png",
            "/cars/versa3.png"
        ],
        "reservationDate": "11/06/2025"
    }
];

const UserProfile = () => {
    return (
        <Container sx={{ marginTop: 20, marginBottom:10, maxWidth: "100vw", paddingX: 2 }}>
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
                                        primary={car.name} 
                                        secondary={`Categoría: ${car.category}`} 
                                    />
                                    <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 'auto' }}>
                                        {car.reservationDate}
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

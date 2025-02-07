import { Box, Card, CardContent, Typography, Divider, TextField, Autocomplete, FormControlLabel, Checkbox, Button, Container } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/router"; // Importar useRouter

const locations = [
    { city: "CDMX", name: "Aeropuerto Internacional Benito Juárez" },
    { city: "CDMX", name: "Polanco" },
    { city: "CDMX", name: "Santa Fe" },
    { city: "CDMX", name: "Centro Histórico" },
    { city: "Monterrey", name: "Aeropuerto Internacional Mariano Escobedo" },
    { city: "Monterrey", name: "San Pedro Garza García" },
    { city: "Monterrey", name: "Centro" },
    { city: "Cancún", name: "Aeropuerto Internacional de Cancún" },
    { city: "Cancún", name: "Zona Hotelera" },
    { city: "Cancún", name: "Centro" },
];

const CheckoutPage = () => {
    const router = useRouter(); // Inicializar useRouter
    const [formData, setFormData] = useState({
        name: "",
        pickupLocation: locations[0],
        deliveryLocation: locations[0],
        email: "",
        phone: "",
        deliveryNote: "",
        password: "",
        terms: false,
        privacy: false
    });

    const [errors, setErrors] = useState({});

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const validate = () => {
        let tempErrors = {};
        tempErrors.name = formData.name ? "" : "Este campo es requerido.";
        tempErrors.email = formData.email ? "" : "Este campo es requerido.";
        tempErrors.phone = formData.phone ? "" : "Este campo es requerido.";
        tempErrors.password = formData.password ? "" : "Este campo es requerido.";
        tempErrors.terms = formData.terms ? "" : "Debe aceptar los términos y condiciones.";
        tempErrors.privacy = formData.privacy ? "" : "Debe aceptar la política de datos personales.";
        setErrors(tempErrors);
        return Object.values(tempErrors).every(x => x === "");
    };

    const isFormValid = () => {
        return formData.name && formData.email && formData.phone && formData.password && formData.terms && formData.privacy;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validate()) {
            // Procesar el formulario
            console.log("Formulario válido", formData);
        } else {
            console.log("Formulario inválido", errors);
        }
    };

    // Función para redirigir a /confirm al pagar al entregar
    const handleCashPayment = (event) => {
        event.preventDefault();
        if (validate()) {
            console.log("Redirigiendo a /confirm...");
            router.push("/confirm"); // Redirige a la página de confirmación
        } else {
            console.log("Errores en el formulario:", errors);
        }
    };


    return (
        <Container sx={{ marginTop: 4, mb: 3, maxWidth: "100vw", paddingX: 2 }}>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4, justifyContent: "center", alignItems: "center" }}>
                {/* Resumen del pedido */}
                <Box sx={{ width: { xs: "100%", md: "40%" }, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Card sx={{ backgroundColor: "#f5f5f5", p: 2, width: "100%" }}>
                        <CardContent>
                            <Typography variant="h6" align="center" gutterBottom>
                                Resumen de la renta
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <img src="/cars/camry.png" alt="Auto rentado" style={{ width: 300, borderRadius: 8 }} />
                                <Box>
                                    <Typography variant="body1"><b>Automóvil:</b> Porsche Bennington</Typography>
                                    <Typography variant="body1"><b>Precio:</b> $81</Typography>
                                </Box>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle1">Detalles</Typography>
                            <Typography variant="body2">Rentar por dos días - $27</Typography>
                            <Typography variant="body2">Garantías limitadas - $27</Typography>
                            <Typography variant="body2">Servicios adicionales - $27</Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h6" align="right">
                                Total: <b>$81</b>
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>

                {/* Formulario */}
                <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                    <Card sx={{ p: 3, width: "100%" }}>
                        <Typography variant="h5" gutterBottom>
                            Información de la reserva
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Complete la información para proceder con la reserva.
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Nombre completo"
                                name="name"
                                fullWidth
                                margin="normal"
                                value={formData.name}
                                onChange={handleChange}
                                error={!!errors.name}
                                helperText={errors.name}
                            />
                            <Autocomplete
                                options={locations}
                                getOptionLabel={(option) => `${option.city} - ${option.name}`}
                                groupBy={(option) => option.city}
                                renderInput={(params) => <TextField {...params} label="Lugar de retiro" variant="outlined" margin="normal" />}
                                value={formData.pickupLocation}
                                onChange={(event, newValue) => setFormData((prev) => ({ ...prev, pickupLocation: newValue }))}
                                sx={{ width: "100%" }}
                            />
                            <Autocomplete
                                options={locations}
                                getOptionLabel={(option) => `${option.city} - ${option.name}`}
                                groupBy={(option) => option.city}
                                renderInput={(params) => <TextField {...params} label="Lugar de entrega" variant="outlined" margin="normal" />}
                                value={formData.deliveryLocation}
                                onChange={(event, newValue) => setFormData((prev) => ({ ...prev, deliveryLocation: newValue }))}
                                sx={{ width: "100%", marginTop: 2 }}
                            />
                            <TextField
                                label="Correo electrónico"
                                name="email"
                                type="email"
                                fullWidth
                                margin="normal"
                                value={formData.email}
                                onChange={handleChange}
                                error={!!errors.email}
                                helperText={errors.email}
                            />
                            <TextField
                                label="Número telefónico"
                                name="phone"
                                fullWidth
                                margin="normal"
                                value={formData.phone}
                                onChange={handleChange}
                                error={!!errors.phone}
                                helperText={errors.phone}
                            />
                            <TextField
                                label="Nota de entrega"
                                name="deliveryNote"
                                fullWidth
                                margin="normal"
                                value={formData.deliveryNote}
                                onChange={handleChange}
                            />
                            <TextField
                                label="Contraseña"
                                name="password"
                                type="password"
                                fullWidth
                                margin="normal"
                                value={formData.password}
                                onChange={handleChange}
                                error={!!errors.password}
                                helperText={errors.password}
                            />

                            <FormControlLabel
                                control={<Checkbox name="terms" checked={formData.terms} onChange={handleChange} sx={{ color: "#d60812", '&.Mui-checked': { color: '#d60812' } }} />}
                                label="Acepto términos y condiciones de renta"
                                error={!!errors.terms}
                                helperText={errors.terms}
                            />
                            <FormControlLabel
                                control={<Checkbox name="privacy" checked={formData.privacy} onChange={handleChange} sx={{ color: "#d60812", '&.Mui-checked': { color: '#d60812' } }} />}
                                label="Acepto la política de datos personales"
                                error={!!errors.privacy}
                                helperText={errors.privacy}
                            />

                            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, mt: 2 }}>
                                <Button variant="contained" sx={{ backgroundColor: "#d60812", height: 55 }} type="submit" fullWidth disabled={!isFormValid()}>
                                    Pago al entregar
                                </Button>
                                <Button variant="text" color="inherit" fullWidth height="100%" sx={{ height: 55 }} disabled={!isFormValid()}>
                                    <img src="https://www.mtbguatemala.com/wp-content/plugins/woocommerce-paypal-payments/modules/ppcp-wc-gateway/assets/images/paypal-button.svg" alt="Comprar ahora con PayPal" style={{ width: "100%" }} />
                                </Button>
                            </Box>
                        </form>
                    </Card>
                </Box>
            </Box>
        </Container>
    );
};

export default CheckoutPage;
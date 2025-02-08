import { Box, Card, CardContent, Typography, Divider, TextField, Autocomplete, FormControlLabel, Checkbox, Button, Container, Tooltip, IconButton, Link, Modal } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import { useState } from "react";
import { useRouter } from "next/router";
import RentalStepper from "../components/Stepper";
import cars from "../data/cars.json";

const car = cars[0]; // Usar el primer registro del JSON

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

const dailyRate = car.price;
const rentalDays = 4;
const babySeats = 2;
const babySeatPrice = 50;
const wifiPrice = 150;
const extraDriverPrice = 200;

const total = (dailyRate * rentalDays) + (babySeats * babySeatPrice * rentalDays) + (wifiPrice * rentalDays) + extraDriverPrice;

const formatCurrency = (amount) => {
    return amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
};

const CheckoutPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        pickupLocation: locations[0],
        deliveryLocation: locations[0],
        email: "",
        confirmEmail: "",
        phone: "",
        deliveryNote: "",
        password: "",
        terms: false,
        privacy: false,
        notifications: false
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [openModal, setOpenModal] = useState(false);
    const [modalContent, setModalContent] = useState("");

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleBlur = (event) => {
        const { name } = event.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        validate();
    };

    const validate = () => {
        let tempErrors = {};
        tempErrors.name = formData.name ? "" : "Este campo es requerido.";
        tempErrors.email = formData.email ? "" : "Este campo es requerido.";
        tempErrors.confirmEmail = formData.confirmEmail ? "" : "Este campo es requerido.";
        if (formData.email && formData.confirmEmail && formData.email !== formData.confirmEmail) {
            tempErrors.confirmEmail = "Los correos electrónicos no coinciden.";
        }
        tempErrors.phone = formData.phone ? "" : "Este campo es requerido.";
        tempErrors.password = formData.password ? "" : "Este campo es requerido.";
        tempErrors.terms = formData.terms ? "" : "Debe aceptar los términos y condiciones.";
        tempErrors.privacy = formData.privacy ? "" : "Debe aceptar la política de datos personales.";
        setErrors(tempErrors);
        return Object.values(tempErrors).every(x => x === "");
    };

    const isFormValid = () => {
        return formData.name && formData.email && formData.confirmEmail && formData.phone && formData.password && formData.terms && formData.privacy;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validate()) {
            // Procesar el formulario
            console.log("Formulario válido", formData);
            router.push("/confirm");
        } else {
            console.log("Formulario inválido", errors);
        }
    };

    const handleOpenModal = (content) => {
        setModalContent(content);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    return (
        <Container sx={{ marginTop: 4, mb: 3, maxWidth: "100vw", paddingX: 2 }}>
            <RentalStepper />
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4, justifyContent: "center", alignItems: "center", mt: 3 }}>
                {/* Resumen del pedido */}
                <Box sx={{ width: { xs: "100%", md: "40%" }, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Card sx={{ backgroundColor: "#f5f5f5", p: 2, width: "100%" }}>
                        <CardContent>
                            <Typography variant="h6" align="center" gutterBottom>
                                Resumen de la renta
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                                <img src={car.image} alt={car.name} style={{ width: "100%", maxWidth: 300, borderRadius: 8 }} />
                                <Box sx={{ ml: 2, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <Typography variant="body1" sx={{ mx: 1 }}>{car.abbreviationMeaning}</Typography>
                                        <Tooltip title={car.abbreviationDescription} arrow>
                                            <IconButton sx={{ color: "gray", fontSize: 20 }}>
                                                <InfoIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                    <Typography variant="body2" color="textSecondary" sx={{ mx: 1 }}>{car.name}</Typography>
                                </Box>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle1"><b>Costo de la renta</b></Typography>
                            <Typography variant="body2">{formatCurrency(dailyRate)} x {rentalDays} días = {formatCurrency(dailyRate * rentalDays)} MXN</Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle1"><b>Servicios adicionales</b></Typography>
                            <Typography variant="body2">{babySeats} Sillas para bebés ({formatCurrency(babySeatPrice)} c/u x {rentalDays} días) - {formatCurrency(babySeats * babySeatPrice * rentalDays)} MXN</Typography>
                            <Typography variant="body2">Wi-Fi ({formatCurrency(wifiPrice)} x {rentalDays} días) - {formatCurrency(wifiPrice * rentalDays)} MXN</Typography>
                            <Typography variant="body2">Conductor adicional - {formatCurrency(extraDriverPrice)} MXN</Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h6" align="right">
                                Total: <b>{formatCurrency(total)} MXN</b>
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
                                onBlur={handleBlur}
                                error={touched.name && !!errors.name}
                                helperText={touched.name && errors.name}
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
                                onBlur={handleBlur}
                                error={touched.email && !!errors.email}
                                helperText={touched.email && errors.email}
                            />
                            <TextField
                                label="Confirmar correo electrónico"
                                name="confirmEmail"
                                type="email"
                                fullWidth
                                margin="normal"
                                value={formData.confirmEmail}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.confirmEmail && !!errors.confirmEmail}
                                helperText={touched.confirmEmail && errors.confirmEmail}
                            />
                            <TextField
                                label="Número telefónico"
                                name="phone"
                                fullWidth
                                margin="normal"
                                value={formData.phone}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.phone && !!errors.phone}
                                helperText={touched.phone && errors.phone}
                            />
                            <TextField
                                label="Nota de entrega (opcional)"
                                name="deliveryNote"
                                fullWidth
                                margin="normal"
                                value={formData.deliveryNote}
                                onChange={handleChange}
                            />
                            <TextField
                                label="Contraseña (para crear tu cuenta)"
                                name="password"
                                type="password"
                                fullWidth
                                margin="normal"
                                value={formData.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.password && !!errors.password}
                                helperText={touched.password && errors.password}
                            />

                            <FormControlLabel
                                control={<Checkbox name="terms" checked={formData.terms} onChange={handleChange} onBlur={handleBlur} sx={{ color: "#d60812", '&.Mui-checked': { color: '#d60812' } }} />}
                                label={<Link component="button" variant="body2" 
                                    sx={{
                                        textDecoration: "underline",
                                        color: "#d60812"
                                    }}
                                    onClick={() => handleOpenModal("Términos y condiciones de renta")}>Acepto términos y condiciones de renta</Link>}
                                error={touched.terms && !!errors.terms}
                                helperText={touched.terms && errors.terms}
                            />
                            <FormControlLabel
                                control={<Checkbox name="privacy" checked={formData.privacy} onChange={handleChange} onBlur={handleBlur} sx={{ color: "#d60812", '&.Mui-checked': { color: '#d60812' } }} />}
                                label={<Link component="button" variant="body2"
                                    sx={{
                                        textDecoration: "underline",
                                        color: "#d60812"
                                    }}
                                    onClick={() => handleOpenModal("Política de datos personales")}>Acepto la política de datos personales</Link>}
                                error={touched.privacy && !!errors.privacy}
                                helperText={touched.privacy && errors.privacy}
                            />
                            <FormControlLabel
                                control={<Checkbox name="notifications" checked={formData.notifications} onChange={handleChange} onBlur={handleBlur} sx={{ color: "#d60812", '&.Mui-checked': { color: '#d60812' } }} />}
                                label="Deseo recibir notificaciones vía correo y WhatsApp"
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

            <Modal open={openModal} onClose={handleCloseModal}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
                    <Typography variant="h6" component="h2">
                        {modalContent}
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </Typography>
                </Box>
            </Modal>
        </Container>
    );
};

export default CheckoutPage;
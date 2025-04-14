"use client";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  TextField,
  Autocomplete,
  FormControlLabel,
  Checkbox,
  Button,
  Container,
  Link,
  Modal,
} from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import RentalStepper from "../components/Stepper";
import { useBooking } from "../contexts/BookingContext";
import { useSearch } from "../contexts/SearchContext";

// Ejemplo de locaciones
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

const formatCurrency = (amount) => {
  return amount.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
};

const CheckoutPage = () => {
  const router = useRouter();

  // Extrae datos globales desde BookingContext
  const { selectedCar, selectedInsurance, selectedExtras, setUserData } =
    useBooking();
  // Extrae los datos de búsqueda desde SearchContext
  const { searchData } = useSearch();

  // Formateo nativo de fechas sin librerías externas.
  const pickupDateString = searchData?.pickupDate
    ? new Date(searchData.pickupDate).toLocaleDateString("es-MX")
    : "";
  const returnDateString = searchData?.returnDate
    ? new Date(searchData.returnDate).toLocaleDateString("es-MX")
    : "";

  // Calcular el número de días usando diferencia en milisegundos.
  const rentalDays =
    searchData && searchData.pickupDate && searchData.returnDate
      ? Math.ceil(
          (new Date(searchData.returnDate) - new Date(searchData.pickupDate)) /
            (1000 * 60 * 60 * 24)
        )
      : 1;

  // VEHÍCULO: costo diario y total
  const dailyCarCost = selectedCar ? selectedCar.price : 0;
  const totalCarCost = dailyCarCost * rentalDays;

  // SEGURO: extraer costo numérico y total
  const parseInsuranceCost = (insuranceString) => {
    if (!insuranceString) return 0;
    const numericPart = insuranceString.replace(/[^\d.]/g, "");
    return parseFloat(numericPart) || 0;
  };
  const dailyInsuranceCost = selectedInsurance
    ? parseInsuranceCost(selectedInsurance.total)
    : 0;
  const totalInsuranceCost = dailyInsuranceCost * rentalDays;

  // EXTRA: Arreglo base para lookup
  const baseExtras = [
    { id: "conductor_adicional", nombre: "Conductor Adicional", precio: 110 },
    {
      id: "conductor_menor",
      nombre: "Conductor Menor de 25 Años",
      precio: 110,
    },
    { id: "baby_seat", nombre: "Baby Seat (Grupo 0+)", precio: 150 },
    { id: "child_seat", nombre: "Child Seat (Grupo 0/1/2)", precio: 150 },
    { id: "booster", nombre: "Booster", precio: 150 },
  ];

  let extrasInfo = [];
  let totalExtrasCost = 0;

  for (const extraId in selectedExtras) {
    const cantidad = selectedExtras[extraId];
    if (cantidad > 0) {
      const extraDef = baseExtras.find((ex) => ex.id === extraId);
      if (extraDef) {
        const costPerDay = extraDef.precio;
        const lineCost = costPerDay * cantidad * rentalDays;
        totalExtrasCost += lineCost;
        extrasInfo.push({
          id: extraId,
          nombre: extraDef.nombre,
          cantidad,
          costPerDay,
          lineCost,
        });
      }
    }
  }

  // Subtotal, IVA y total
  const subTotal = totalCarCost + totalInsuranceCost + totalExtrasCost;
  const taxRate = 0.16; // IVA al 16%
  const ivaCost = subTotal * taxRate;
  const totalWithIva = subTotal + ivaCost;

  // Manejo del formulario del usuario
  const [formData, setFormData] = useState({
    name: "",
    pickupLocation: locations[0],
    deliveryLocation: locations[0],
    email: "",
    confirmEmail: "",
    phone: "",
    password: "",
    terms: false,
    privacy: false,
    notifications: false,
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Estado y contenido para el Modal
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const handleOpenModal = (content) => {
    setModalContent(content);
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
    tempErrors.confirmEmail = formData.confirmEmail
      ? ""
      : "Este campo es requerido.";
    if (
      formData.email &&
      formData.confirmEmail &&
      formData.email !== formData.confirmEmail
    ) {
      tempErrors.confirmEmail = "Los correos electrónicos no coinciden.";
    }
    tempErrors.phone = formData.phone ? "" : "Este campo es requerido.";
    tempErrors.password = formData.password ? "" : "Este campo es requerido.";
    tempErrors.terms = formData.terms
      ? ""
      : "Debe aceptar los términos y condiciones.";
    tempErrors.privacy = formData.privacy
      ? ""
      : "Debe aceptar la política de datos personales.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const isFormValid = () => {
    return (
      formData.name &&
      formData.email &&
      formData.confirmEmail &&
      formData.phone &&
      formData.password &&
      formData.terms &&
      formData.privacy
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validate()) {
      setUserData(formData);
      router.push("/confirm");
    } else {
      console.log("Formulario inválido", errors);
    }
  };

  return (
    <Container sx={{ marginTop: 4, mb: 3, maxWidth: "100vw", paddingX: 2 }}>
      <RentalStepper />
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          justifyContent: "center",
          alignItems: "flex-start",
          mt: 3,
        }}
      >
        {/* Resumen del Pedido */}
        <Box sx={{ width: { xs: "100%", md: "40%" } }}>
          <Card sx={{ backgroundColor: "#f5f5f5", p: 2, width: "100%" }}>
            <CardContent>
              <Typography variant="h6" align="center" gutterBottom>
                <b>Resumen de la Renta</b>
              </Typography>
              <Divider sx={{ my: 2 }} />

              {/* Vehículo */}
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                <b>Vehículo Seleccionado:</b>
              </Typography>
              {selectedCar ? (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <img
                      src={selectedCar.image}
                      alt={selectedCar.name}
                      style={{ width: "100%", maxWidth: 300, borderRadius: 8 }}
                    />
                    <Typography variant="body1" fontWeight="bold">
                      {selectedCar.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {selectedCar.category}
                    </Typography>
                  </Box>
                  {/* Sección Fechas */}
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    <b>Fechas de la Renta:</b>
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 1,
                    }}
                  >
                    <Typography variant="body2">
                      {pickupDateString} - {returnDateString}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      ({rentalDays} días)
                    </Typography>
                  </Box>
                  {/* Costo del vehículo */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 1,
                    }}
                  >
                    <Typography variant="body2" fontStyle="italic">
                      {formatCurrency(dailyCarCost)} /día
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {formatCurrency(totalCarCost)}
                    </Typography>
                  </Box>
                </>
              ) : (
                <Typography variant="body2">
                  No se ha seleccionado un vehículo.
                </Typography>
              )}

              <Divider sx={{ my: 2 }} />

              {/* Seguro */}
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                <b>Seguro Seleccionado:</b>
              </Typography>
              {selectedInsurance ? (
                <>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      {selectedInsurance.nombre}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {selectedInsurance.total} /día
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Typography variant="body2" fontStyle="italic">
                      ({rentalDays} días) = {formatCurrency(totalInsuranceCost)}
                    </Typography>
                  </Box>
                </>
              ) : (
                <Typography variant="body2">
                  No se ha seleccionado un seguro.
                </Typography>
              )}

              <Divider sx={{ my: 2 }} />

              {/* Extras */}
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                <b>Extras Seleccionados:</b>
              </Typography>
              {extrasInfo && extrasInfo.length > 0 ? (
                extrasInfo.map((ex) => (
                  <Box
                    key={ex.id}
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2">
                      {ex.nombre} x {ex.cantidad}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {formatCurrency(ex.lineCost)}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2">
                  No se han seleccionado extras.
                </Typography>
              )}

              <Divider sx={{ my: 2 }} />

              {/* IVA antes del Total */}
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
              >
                <Typography variant="body2" fontWeight="bold">
                  IVA (16%)
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {formatCurrency(ivaCost)}
                </Typography>
              </Box>

              {/* Total General */}
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
              >
                <Typography variant="h6" fontWeight="bold">
                  TOTAL:
                </Typography>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ color: "#d60812" }}
                >
                  {formatCurrency(totalWithIva)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Formulario de Datos del Usuario */}
        <Box sx={{ width: { xs: "100%", md: "50%" } }}>
          <Card sx={{ p: 3, width: "100%" }}>
            <Typography variant="h5" gutterBottom>
              Información de la Reserva
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
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Lugar de retiro"
                    variant="outlined"
                    margin="normal"
                  />
                )}
                value={formData.pickupLocation}
                onChange={(event, newValue) =>
                  setFormData((prev) => ({ ...prev, pickupLocation: newValue }))
                }
                sx={{ width: "100%" }}
              />
              <Autocomplete
                options={locations}
                getOptionLabel={(option) => `${option.city} - ${option.name}`}
                groupBy={(option) => option.city}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Lugar de entrega"
                    variant="outlined"
                    margin="normal"
                  />
                )}
                value={formData.deliveryLocation}
                onChange={(event, newValue) =>
                  setFormData((prev) => ({
                    ...prev,
                    deliveryLocation: newValue,
                  }))
                }
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
                control={
                  <Checkbox
                    name="terms"
                    checked={formData.terms}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    sx={{
                      color: "#d60812",
                      "&.Mui-checked": { color: "#d60812" },
                    }}
                  />
                }
                label={
                  <Link
                    variant="body2"
                    sx={{ textDecoration: "underline", color: "#d60812" }}
                    href="/terminos-y-condiciones"
                    target="_blank"
                  >
                    Acepto términos y condiciones de renta
                  </Link>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="privacy"
                    checked={formData.privacy}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    sx={{
                      color: "#d60812",
                      "&.Mui-checked": { color: "#d60812" },
                    }}
                  />
                }
                label={
                  <Link
                    variant="body2"
                    sx={{ textDecoration: "underline", color: "#d60812" }}
                    href="/aviso-de-privacidad"
                    target="_blank"
                  >
                    Acepto la política de datos personales
                  </Link>
                }
              />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 2,
                  mt: 2,
                }}
              >
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#d60812", height: 55 }}
                  type="submit"
                  fullWidth
                  disabled={!isFormValid()}
                >
                  Pago al entregar
                </Button>
                <Button
                  variant="text"
                  color="inherit"
                  fullWidth
                  sx={{ height: 55 }}
                  disabled={!isFormValid()}
                >
                  <img
                    src="https://www.mtbguatemala.com/wp-content/plugins/woocommerce-paypal-payments/modules/ppcp-wc-gateway/assets/images/paypal-button.svg"
                    alt="Comprar ahora con PayPal"
                    style={{ width: "100%" }}
                  />
                </Button>
              </Box>
            </form>
          </Card>
        </Box>
      </Box>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            {modalContent}
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </Typography>
        </Box>
      </Modal>
    </Container>
  );
};

export default CheckoutPage;

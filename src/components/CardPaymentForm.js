// components/CardPaymentForm.jsx
import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    TextField,
    Typography
} from "@mui/material";
import Image from "next/image";
import mastercardIcon from "../../public/icons/cards/mastercard.svg";
import visaIcon from "../../public/icons/cards/visa.svg";
import amexIcon from "../../public/icons/cards/AXP_BlueBoxLogo_Alternate_SMALLscale_RGB_DIGITAL_80x80.png";

/**
 * CardPaymentForm
 *
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - onPay: (cardData: {cardNumber, expMonth, expYear, cvc}) => void
 */
export default function CardPaymentForm({ open, onClose, onPay }) {
    const [cardNumber, setCardNumber] = useState("");
    const [expMonth, setExpMonth] = useState("");
    const [expYear, setExpYear] = useState("");
    const [cvc, setCvc] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validación básica
        if (
            !/^\d{16}$/.test(cardNumber.replace(/\s+/g, "")) ||
            !/^\d{2}$/.test(expMonth) ||
            !/^\d{2}$/.test(expYear) ||
            !/^\d{3,4}$/.test(cvc)
        ) {
            setError("Por favor verifica los datos de la tarjeta.");
            return;
        }
        setError("");
        onPay({
            cardNumber: cardNumber.replace(/\s+/g, ""),
            expMonth,
            expYear,
            cvc,
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", fontSize: "1.5rem", color: "#333" }}>
                Ingresa datos de tu tarjeta
            </DialogTitle>
            <DialogContent>
                <Box sx={{ textAlign: "center", mb: 3 }}>
                    <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.9rem" }}>
                        Métodos de pago aceptados:
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 1 }}>
                        <Image src={mastercardIcon} alt="MasterCard" width={50} height={30} style={{ objectFit: "contain" }} />
                        <Image src={visaIcon} alt="Visa" width={50} height={30} style={{ objectFit: "contain" }} />
                        <Image src={amexIcon} alt="American Express" width={50} height={30} style={{ objectFit: "contain" }} />
                    </Box>
                </Box>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        mt: 1,
                        p: 2,
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <TextField
                        label="Número de tarjeta"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        inputProps={{ maxLength: 19 }}
                        fullWidth
                        sx={{ bgcolor: "#f9f9f9", borderRadius: "4px" }}
                    />
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <TextField
                            label="Mes (MM)"
                            placeholder="MM"
                            value={expMonth}
                            onChange={(e) => setExpMonth(e.target.value)}
                            inputProps={{ maxLength: 2 }}
                            sx={{ flex: 1, bgcolor: "#f9f9f9", borderRadius: "4px" }}
                        />
                        <TextField
                            label="Año (AA)"
                            placeholder="AA"
                            value={expYear}
                            onChange={(e) => setExpYear(e.target.value)}
                            inputProps={{ maxLength: 2 }}
                            sx={{ flex: 1, bgcolor: "#f9f9f9", borderRadius: "4px" }}
                        />
                        <TextField
                            label="CVC"
                            placeholder="123"
                            value={cvc}
                            onChange={(e) => setCvc(e.target.value)}
                            inputProps={{ maxLength: 4 }}
                            sx={{ flex: 1, bgcolor: "#f9f9f9", borderRadius: "4px" }}
                        />
                    </Box>
                    {error && (
                        <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                            {error}
                        </Typography>
                    )}
                </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center", mt: 2 }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    sx={{
                        borderRadius: "20px",
                        px: 3,
                        color: "#d60812",
                        borderColor: "#d60812",
                        "&:hover": {
                            bgcolor: "#fbe9ea",
                            borderColor: "#d60812",
                        },
                    }}
                >
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!cardNumber || !expMonth || !expYear || !cvc}
                    sx={{
                        bgcolor: "#10906a",
                        color: "white",
                        borderRadius: "20px",
                        px: 3,
                        "&:hover": { bgcolor: "#0e805c" },
                    }}
                >
                    Pagar
                </Button>
            </DialogActions>
        </Dialog>
    );
}

import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    TextField,
    Typography,
} from "@mui/material";
import Image from "next/image";
import CreditCardPreview from "./CreditCardPreview";
import mastercardIcon from "../../public/icons/cards/mastercard.svg";
import visaIcon from "../../public/icons/cards/visa.svg";
import amexIcon from "../../public/icons/cards/AXP_BlueBoxLogo_Alternate_SMALLscale_RGB_DIGITAL_80x80.png";

export default function CardPaymentForm({ open, onClose, onPay }) {
    const [cardNumber, setCardNumber] = useState("");
    const [expMonth, setExpMonth] = useState("");
    const [expYear, setExpYear] = useState("");
    const [cvc, setCvc] = useState("");
    const [name, setName] = useState("");
    const [focused, setFocused] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validación final antes de enviar
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
            name,
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle
                sx={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    color: "#333",
                }}
            >
                Ingresa datos de tu tarjeta
            </DialogTitle>
            <DialogContent>
                {/* Logotipos */}
                <Box sx={{ textAlign: "center", mb: 3 }}>
                    <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>
                        Métodos de pago aceptados:
                    </Typography>
                    <Box
                        sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 1 }}
                    >
                        <Image
                            src={mastercardIcon}
                            alt="MasterCard"
                            width={50}
                            height={30}
                        />
                        <Image src={visaIcon} alt="Visa" width={50} height={30} />
                        <Image
                            src={amexIcon}
                            alt="American Express"
                            width={50}
                            height={30}
                        />
                    </Box>
                </Box>

                {/* Vista previa */}
                <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                    <CreditCardPreview
                        number={cardNumber.replace(/\s+/g, "")}
                        name={name}
                        expiry={`${expMonth}/${expYear}`}
                        cvc={cvc}
                        focused={focused}
                    />
                </Box>

                {/* Formulario */}
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                    {/* Nombre libre (solo texto) */}
                    <TextField
                        label="Nombre en la tarjeta"
                        placeholder="NOMBRE APELLIDO"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onFocus={() => setFocused("name")}
                        onBlur={() => setFocused("")}
                        fullWidth
                        inputProps={{ style: { textTransform: "uppercase" } }}
                        sx={{ bgcolor: "#f9f9f9", borderRadius: "4px" }}
                    />

                    {/* Número de tarjeta: solo dígitos y grupos de 4 */}
                    <TextField
                        label="Número de tarjeta"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => {
                            const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
                            const formatted = raw.match(/.{1,4}/g)?.join(" ") || raw;
                            setCardNumber(formatted);
                        }}
                        onFocus={() => setFocused("number")}
                        onBlur={() => setFocused("")}
                        inputProps={{
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                            maxLength: 19, // 16 dígitos + 3 espacios
                        }}
                        fullWidth
                        sx={{ bgcolor: "#f9f9f9", borderRadius: "4px" }}
                    />

                    {/* Mes, Año y CVC: solo dígitos */}
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <TextField
                            label="Mes (MM)"
                            placeholder="MM"
                            value={expMonth}
                            onChange={(e) =>
                                setExpMonth(e.target.value.replace(/\D/g, "").slice(0, 2))
                            }
                            onFocus={() => setFocused("expiry")}
                            onBlur={() => setFocused("")}
                            inputProps={{
                                inputMode: "numeric",
                                pattern: "[0-9]*",
                                maxLength: 2,
                            }}
                            sx={{ flex: 1, bgcolor: "#f9f9f9", borderRadius: "4px" }}
                        />
                        <TextField
                            label="Año (AA)"
                            placeholder="AA"
                            value={expYear}
                            onChange={(e) =>
                                setExpYear(e.target.value.replace(/\D/g, "").slice(0, 2))
                            }
                            onFocus={() => setFocused("expiry")}
                            onBlur={() => setFocused("")}
                            inputProps={{
                                inputMode: "numeric",
                                pattern: "[0-9]*",
                                maxLength: 2,
                            }}
                            sx={{ flex: 1, bgcolor: "#f9f9f9", borderRadius: "4px" }}
                        />
                        <TextField
                            label="CVC"
                            placeholder="123"
                            value={cvc}
                            onChange={(e) =>
                                setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))
                            }
                            onFocus={() => setFocused("cvc")}
                            onBlur={() => setFocused("")}
                            inputProps={{
                                inputMode: "numeric",
                                pattern: "[0-9]*",
                                maxLength: 3,
                            }}
                            sx={{ flex: 1, bgcolor: "#f9f9f9", borderRadius: "4px" }}
                        />
                    </Box>

                    {/* Error */}
                    {error && (
                        <Typography color="error" variant="caption">
                            {error}
                        </Typography>
                    )}

                    {/* Botones */}
                    <DialogActions sx={{ justifyContent: "center", mt: 2 }}>
                        <Button
                            onClick={onClose}
                            variant="outlined"
                            sx={{
                                borderRadius: "20px",
                                px: 3,
                                color: "#d60812",
                                borderColor: "#d60812",
                                "&:hover": { bgcolor: "#fbe9ea" },
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="contained"
                            type="submit"
                            disabled={!cardNumber || !expMonth || !expYear || !cvc || !name}
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
                </Box>
            </DialogContent>
        </Dialog>
    );
}

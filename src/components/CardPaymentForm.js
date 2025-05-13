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
    Typography,
} from "@mui/material";
import Image from "next/image";
import CreditCardPreview from "./CreditCardPreview";
import mastercardIcon from "../../public/icons/cards/mastercard.svg";
import visaIcon from "../../public/icons/cards/visa.svg";
import amexIcon from "../../public/icons/cards/AXP_BlueBoxLogo_Alternate_SMALLscale_RGB_DIGITAL_80x80.png";
import CryptoJS from "crypto-js";
//import dotenv from "dotenv";
//dotenv.config();

/** Valida tarjeta con algoritmo Luhn */
function luhnCheck(ccNum) {
    let sum = 0;
    let alt = false;
    for (let i = ccNum.length - 1; i >= 0; i--) {
        let n = parseInt(ccNum[i], 10);
        if (alt) {
            n *= 2;
            if (n > 9) n -= 9;
        }
        sum += n;
        alt = !alt;
    }
    return sum % 10 === 0;
}

/**
 * CardPaymentForm
 *
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - data: {
 *     mp_order: string,
 *     mp_reference: string,
 *     mp_amount: string,    // e.g. "100.00"
 *     mp_concept: string,   // e.g. "3"
 *     mp_node: string,      // e.g. "20"
 *     mp_currency: string,  // "1" or "2"
 *   }
 */
export default function CardPaymentForm({ open, onClose, data }) {
    const [cardNumber, setCardNumber] = useState("");
    const [expMonth, setExpMonth] = useState("");
    const [expYear, setExpYear] = useState("");
    const [cvc, setCvc] = useState("");
    const [name, setName] = useState("");
    const [focused, setFocused] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const rawNumber = cardNumber.replace(/\s+/g, "");
        // Validaciones básicas
        if (
            !/^\d{16}$/.test(rawNumber) ||
            !/^\d{2}$/.test(expMonth) ||
            !/^\d{2}$/.test(expYear) ||
            !/^\d{3,4}$/.test(cvc) ||
            name.trim() === ""
        ) {
            setError("Por favor verifica los datos de la tarjeta.");
            return;
        }
        // Luhn
        if (!luhnCheck(rawNumber)) {
            setError("Número de tarjeta inválido.");
            return;
        }
        setError("");

        // Generar firma HMAC-SHA256
        const secret = process.env.NEXT_PUBLIC_HMAC_SECRET;
        const signatureBase = `${data.mp_order}${data.mp_reference}${data.mp_amount}`;
        const mp_signature = CryptoJS.HmacSHA256(signatureBase, secret).toString(
            CryptoJS.enc.Hex
        );

        // Construir y enviar formulario oculto a Flap
        const form = document.createElement("form");
        form.method = "POST";
        form.action =
            "https://prepro.adquiracloud.mx/clb/endpoint/automovilisticaAndrade";
        form.style.display = "none";
        const origin = window.location.origin;
        const fields = {
            mp_account: "8559",
            mp_node: data.mp_node,
            mp_order: data.mp_order,
            mp_reference: data.mp_reference,
            mp_product: "1",
            mp_concept: data.mp_concept,
            mp_amount: data.mp_amount,
            mp_currency: data.mp_currency,
            mp_urlsuccess: `${origin}/api/flap/responsePayment`,
            mp_urlfailure: `${origin}/api/flap/responsePayment`,
            mp_signature,
            mp_paymentmethod: "TDX|CIE|AMEX|CLABE",
            // datos de tarjeta
            card_number: rawNumber,
            exp_month: expMonth,
            exp_year: expYear,
            cvc,
            card_holder: name.trim(),
        };
        Object.entries(fields).forEach(([k, v]) => {
            const inp = document.createElement("input");
            inp.name = k;
            inp.value = v;
            form.appendChild(inp);
        });
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);

        // Desechar datos sensibles
        setCardNumber("");
        setExpMonth("");
        setExpYear("");
        setCvc("");
        setName("");
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle
                sx={{ textAlign: "center", fontWeight: "bold", fontSize: "1.5rem", color: "#333" }}
            >
                Ingresa datos de tu tarjeta
            </DialogTitle>
            <DialogContent>
                {/* Logotipos */}
                <Box sx={{ textAlign: "center", mb: 3 }}>
                    <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>
                        Métodos de pago aceptados:
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 1 }}>
                        <Image src={mastercardIcon} alt="MasterCard" width={50} height={30} />
                        <Image src={visaIcon} alt="Visa" width={50} height={30} />
                        <Image src={amexIcon} alt="American Express" width={50} height={30} />
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
                <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField
                        label="Nombre en la tarjeta"
                        placeholder="NOMBRE APELLIDO"
                        value={name}
                        onChange={(e) => setName(e.target.value.toUpperCase())}
                        onFocus={() => setFocused("name")}
                        onBlur={() => setFocused("")}
                        fullWidth
                        inputProps={{ style: { textTransform: "uppercase" } }}
                        sx={{ bgcolor: "#f9f9f9", borderRadius: "4px" }}
                    />
                    <TextField
                        label="Número de tarjeta"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => {
                            const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
                            setCardNumber(raw.match(/.{1,4}/g)?.join(" ") || raw);
                        }}
                        onFocus={() => setFocused("number")}
                        onBlur={() => setFocused("")}
                        inputProps={{ inputMode: "numeric", pattern: "[0-9]*", maxLength: 19 }}
                        fullWidth
                        sx={{ bgcolor: "#f9f9f9", borderRadius: "4px" }}
                    />
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <TextField
                            label="Mes (MM)"
                            placeholder="MM"
                            value={expMonth}
                            onChange={(e) => setExpMonth(e.target.value.replace(/\D/g, "").slice(0, 2))}
                            onFocus={() => setFocused("expiry")}
                            onBlur={() => setFocused("")}
                            inputProps={{ inputMode: "numeric", pattern: "[0-9]*", maxLength: 2 }}
                            sx={{ flex: 1, bgcolor: "#f9f9f9", borderRadius: "4px" }}
                        />
                        <TextField
                            label="Año (AA)"
                            placeholder="AA"
                            value={expYear}
                            onChange={(e) => setExpYear(e.target.value.replace(/\D/g, "").slice(0, 2))}
                            onFocus={() => setFocused("expiry")}
                            onBlur={() => setFocused("")}
                            inputProps={{ inputMode: "numeric", pattern: "[0-9]*", maxLength: 2 }}
                            sx={{ flex: 1, bgcolor: "#f9f9f9", borderRadius: "4px" }}
                        />
                        <TextField
                            label="CVC"
                            placeholder="123"
                            value={cvc}
                            onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                            onFocus={() => setFocused("cvc")}
                            onBlur={() => setFocused("")}
                            inputProps={{ inputMode: "numeric", pattern: "[0-9]*", maxLength: 4 }}
                            sx={{ flex: 1, bgcolor: "#f9f9f9", borderRadius: "4px" }}
                        />
                    </Box>
                    {error && (
                        <Typography color="error" variant="caption">
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
                        "&:hover": { bgcolor: "#fbe9ea" },
                    }}
                >
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={
                        !cardNumber ||
                        !expMonth ||
                        !expYear ||
                        !cvc ||
                        !name ||
                        !data
                    }
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

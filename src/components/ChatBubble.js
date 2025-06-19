import React, { useState } from "react";
import { Box, IconButton, Paper } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const WHATSAPP_GREEN = "#25D366";

const ChatBubble = () => {
    const [open, setOpen] = useState(false);
    const [swapped, setSwapped] = useState(false);

    const toggleChat = () => setOpen((prev) => !prev);
    const handleSwap = () => setSwapped((prev) => !prev);

    // Define qué burbuja va al frente y cuál atrás
    const front = swapped ? "whatsapp" : "chat";
    const back = swapped ? "chat" : "whatsapp";

    const size = 100;
    const offset = 30;
    const iconSz = 60;

    // Genera estilos comunes para cada burbuja
    // isFront determina si es la burbuja del frente (la que se puede abrir)
    const getCommonSx = (isFront, type, swappedPos = false) => {
        const bgColor = type === "chat" ? "#fff" : WHATSAPP_GREEN;
        // Si swapped, intercambia las posiciones left y bottom
        let leftValue, bottomValue, zIndexValue;
        if (swappedPos) {
            leftValue = isFront ? offset : 0;
            bottomValue = isFront ? offset : 0;
            zIndexValue = isFront ? 10 : 5;
        } else {
            leftValue = isFront ? 0 : offset;
            bottomValue = isFront ? 0 : offset;
            zIndexValue = isFront ? 10 : 5;
        }
        return {
            position: "absolute",
            width: size,
            height: size,
            borderRadius: "50%",
            boxShadow: 4,
            left: leftValue,
            bottom: bottomValue,
            zIndex: zIndexValue,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            backgroundColor: bgColor,
            transition:
                "left 0.5s cubic-bezier(.4,2,.6,1), bottom 0.5s cubic-bezier(.4,2,.6,1)",
            // override hover sin cambiar color
            "&:hover": {
                backgroundColor: bgColor,
            },
            // borde blanco en la burbuja trasera
            ...(zIndexValue === 5 ? { border: "3px solid #fff" } : {}),
        };
    };

    return (
        <Box sx={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999 }}>
            <Box sx={{ position: "relative", width: size + offset, height: size + offset }}>
                {/* Burbuja ATRÁS (hace swap) */}
                {back === "chat" ? (
                    <IconButton
                        onClick={handleSwap}
                        sx={getCommonSx(false, "chat", swapped)}
                        disableRipple
                    >
                        <Box
                            component="img"
                            src="/bot/Bot-IA-Alpha-Cabeza.webp"
                            alt="Chatbot"
                            sx={{ width: iconSz, height: iconSz }}
                        />
                    </IconButton>
                ) : (
                    <IconButton
                        onClick={handleSwap}
                        sx={getCommonSx(false, "whatsapp", swapped)}
                        disableRipple
                    >
                        <WhatsAppIcon sx={{ fontSize: 36, color: "#fff" }} />
                    </IconButton>
                )}

                {/* Burbuja DELANTE (abre chat o WhatsApp) */}
                {front === "chat" ? (
                    <IconButton
                        onClick={toggleChat}
                        sx={getCommonSx(true, "chat", swapped)}
                        disableRipple
                    >
                        <Box
                            component="img"
                            src="/bot/Bot-IA-Alpha-Cabeza.webp"
                            alt="Chatbot"
                            sx={{ width: iconSz, height: iconSz }}
                        />
                    </IconButton>
                ) : (
                    <IconButton
                        href="https://wa.me/525545773150?text=Hola%2C%20me%20gustar%C3%ADa%20hacer%20una%20reserva."
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={getCommonSx(true, "whatsapp", swapped)}
                        disableRipple
                    >
                        <WhatsAppIcon sx={{ fontSize: 36, color: "#fff" }} />
                    </IconButton>
                )}
            </Box>

            {/* Panel de chat */}
            {open && (
                <Paper
                    sx={{
                        position: "absolute",
                        bottom: size + offset + 20,
                        right: 0,
                        width: 380,
                        height: 520,
                        borderRadius: 2,
                        boxShadow: 6,
                        overflow: "hidden",
                        zIndex: 10000,
                        display: "flex",
                        flexDirection: "column",
                        transition: "opacity 0.3s ease",
                    }}
                >
                    <Box sx={{ textAlign: "right", p: 1 }}>
                        <IconButton onClick={toggleChat} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <iframe
                        src="https://app-webhook-pd.pymesdigital.store/webhook/d3d04c98-9076-45c8-bf6c-d3e2bd3fb62a/chat"
                        width="100%"
                        height="100%"
                        style={{ border: "none" }}
                        title="Chatbot"
                    />
                </Paper>
            )}
        </Box>
    );
};

export default ChatBubble;

import React, { useState } from "react";
import { Box, IconButton, Paper } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const WHATSAPP_GREEN = "#25D366";

const ChatBubble = () => {
    const [open, setOpen] = useState(false);
    const toggleChat = () => setOpen((prev) => !prev);

    // Tamaños
    const size = 100;
    const iconSz = 60;
    // WhatsApp reducido al 70%
    const waSize = size * 0.6;
    const waIconSz = iconSz * 0.6;

    return (
        <Box sx={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
            {/* WhatsApp burbuja (arriba, más pequeña) */}
            <IconButton
                component="a"
                href="https://wa.me/525545773150?text=Hola%2C%20me%20gustar%C3%ADa%20hacer%20una%20reserva."
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                    width: waSize,
                    height: waSize,
                    borderRadius: "50%",
                    boxShadow: 4,
                    backgroundColor: WHATSAPP_GREEN,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: .3,
                    '&:hover': { backgroundColor: WHATSAPP_GREEN },
                    '@media (max-width: 600px)': {
                        width: waSize * 0.8,
                        height: waSize * 0.8,
                    },
                }}
                disableRipple
            >
                <WhatsAppIcon sx={{
                    fontSize: waIconSz,
                    color: "#fff",
                    '@media (max-width: 600px)': {
                        fontSize: waIconSz * 0.8,
                    },
                }} />
            </IconButton>

            {/* Chatbot burbuja (abajo, tamaño normal) */}
            <IconButton
                onClick={toggleChat}
                sx={{
                    width: size,
                    height: size,
                    borderRadius: "50%",
                    boxShadow: 4,
                    backgroundColor: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    '&:hover': { backgroundColor: "#fff" },
                    '@media (max-width: 600px)': {
                        width: size * 0.8,
                        height: size * 0.8,
                    },
                }}
                disableRipple
            >
                <Box
                    component="img"
                    src="/bot/Bot-IA-Alpha-Cabeza.webp"
                    alt="Chatbot"
                    sx={{
                        width: iconSz,
                        height: iconSz,
                        '@media (max-width: 600px)': {
                            width: iconSz * 0.8,
                            height: iconSz * 0.8,
                        },
                    }}
                />
            </IconButton>

            {/* Panel de chat */}
            {open && (
                <Paper
                    sx={{
                        position: "absolute",
                        bottom: size + 20,
                        right: 0,
                        width: 480,
                        height: 640,
                        borderRadius: 2,
                        boxShadow: 6,
                        overflow: "hidden",
                        zIndex: 10000,
                        display: "flex",
                        flexDirection: "column",
                        transition: "opacity 0.3s ease",
                        '@media (max-width: 600px)': {
                            width: '90vw',
                            height: '70vh',
                            minHeight: '320px',
                            bottom: 10,
                            right: 10,
                            borderRadius: 2,
                        },
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1 }}>
                        <Box
                            component="img"
                            src="/logos/Qardeal_logo_completo_color.png"
                            alt="Qardeal Logo"
                            sx={{ height: 160, width: 200, mr: 1, mb: -7, mt: -7, ml: -2, objectFit: 'contain' }}
                        />
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

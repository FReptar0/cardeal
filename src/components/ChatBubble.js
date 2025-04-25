import React, { useState } from "react";
import { Box, IconButton, Paper } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ChatBubble = () => {
    const [open, setOpen] = useState(false);

    const toggleChat = () => {
        setOpen(!open);
    };

    return (
        <Box sx={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999 }}>
            {/* Burbuja de chat */}
            <IconButton 
                onClick={toggleChat} 
                sx={{
                    backgroundColor: "transparent", // Sin fondo
                    color: "white",
                    width: { xs: 90, md: 110 }, // Tamaño más pequeño en móvil
                    height: { xs: 90, md: 110 }, // Tamaño más pequeño en móvil
                    borderRadius: "50%",
                    boxShadow: 3,
                    "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" } // Fondo ligero al hacer hover
                }}
            >
                <Box
                    component="img"
                    src="/bot/Bot-IA-Alpha-Cabeza.webp"
                    alt="Chatbot Icon"
                    sx={{ width: { xs: 70, md: 100 }, height: { xs: 70, md: 100 } }} // Imagen más pequeña en móvil
                />
            </IconButton>

            {/* Ventana de chat con iframe */}
            {open && (
                <Paper 
                    sx={{
                        position: "absolute",
                        bottom: 80,
                        right: 0,
                        width: 400,  // Aumenté el tamaño
                        height: 550, // Más altura
                        borderRadius: 2,
                        boxShadow: 5,
                        overflow: "hidden",
                        zIndex: 9999,
                        display: "flex",
                        flexDirection: "column"
                    }}
                >
                    {/* Botón de cierre */}
                    <Box sx={{ textAlign: "right", p: 1 }}>
                        <IconButton onClick={toggleChat} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    {/* Iframe con interactividad */}
                    <iframe 
                        src="https://qwebhook.pymesdigital.store/webhook/d3d04c98-9076-45c8-bf6c-d3e2bd3fb62a/chat"
                        width="100%"
                        height="100%"
                        style={{ border: "none", pointerEvents: "auto" }}
                        title="Chatbot"
                    />
                </Paper>
            )}
        </Box>
    );
};

export default ChatBubble;

import React, { useState } from "react";
import { Box, IconButton, Paper } from "@mui/material";
import ChatIcon from "@mui/icons-material/SmartToy";
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
                    backgroundColor: "#007bff",
                    color: "white",
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    boxShadow: 3,
                    "&:hover": { backgroundColor: "#0056b3" }
                }}
            >
                <ChatIcon fontSize="large" />
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
                        src="https://webhookpd.pymesdigital.store/webhook/1e9a0cb7-5707-4995-b37c-f207423f5272/chat"
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

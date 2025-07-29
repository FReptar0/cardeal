import React, { useState, useEffect } from "react";
import { Box, IconButton, Paper, Alert, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import { SupportAgent } from "@mui/icons-material";
import { validateIframeUrl } from "@/utils/security";

const WHATSAPP_GREEN = "#25D366";

const ChatBubble = () => {
  const [open, setOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false); // Estado separado para el chatbot
  const [iframeValidation, setIframeValidation] = useState({ isValid: false, sanitizedUrl: '', error: '' });

  const toggleChat = () => setOpen((prev) => !prev);
  const toggleChatbot = () => setChatOpen((prev) => !prev); // Nueva función para el chatbot

  // Validate chatbot iframe URL
  useEffect(() => {
    const chatbotUrl = "https://app-webhook-pd.pymesdigital.store/webhook/d3d04c98-9076-45c8-bf6c-d3e2bd3fb62a/chat";
    const validation = validateIframeUrl(chatbotUrl);
    setIframeValidation(validation);
  }, []);

  // Tamaños
  const size = 80; // Tamaño reducido
  const iconSz = 50; // Tamaño reducido

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column-reverse", // Cambiar el orden para que la X esté abajo
        alignItems: "flex-end",
        gap: 0.5,
      }}
    >
      {/* Burbuja principal (X) */}
      <IconButton
        id="bubble-open"
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
          transition: "transform 0.3s ease, opacity 0.3s ease",
          transform: open ? "scale(1)" : "scale(1)", // Sin rotación
          "&:hover": { backgroundColor: "#f0f0f0" },
        }}
        disableRipple
      >
        {open ? (
          <CloseIcon sx={{ fontSize: iconSz }} />
        ) : (
          <SupportAgent sx={{ fontSize: iconSz, color: (theme) => theme.palette.primary.buttons }} />
        )}
      </IconButton>

      {/* Opciones desplegables */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 1,
          transition: "opacity 0.3s ease, transform 0.3s ease",
          opacity: open ? 1 : 0,
          transform: open ? "scale(1)" : "scale(0.9)",
          pointerEvents: open ? "auto" : "none", // Evitar clics cuando está oculto
        }}
      >
        {/* WhatsApp burbuja */}
        <IconButton
          id="bubble-whatsapp"
          component="a"
          href="https://wa.me/525545773150?text=Hola%2C%20me%20gustar%C3%ADa%20hacer%20una%20reserva."
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            width: size,
            height: size,
            borderRadius: "50%",
            boxShadow: 4,
            backgroundColor: "#25D366",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.3s ease, opacity 0.3s ease",
            transform: open ? "scale(1)" : "scale(0.9)",
            opacity: open ? 1 : 0,
            "&:hover": { backgroundColor: "#1DA851" },
          }}
          disableRipple
        >
          <WhatsAppIcon sx={{ fontSize: iconSz * 0.8, color: "#fff" }} />
        </IconButton>

        {/* Chatbot burbuja */}
        <IconButton
          id="bubble-bot"
          onClick={toggleChatbot}
          sx={{
            width: size,
            height: size,
            borderRadius: "50%",
            boxShadow: 4,
            backgroundColor: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.3s ease, opacity 0.3s ease",
            transform: open ? "scale(1)" : "scale(0.9)",
            opacity: open ? 1 : 0,
            "&:hover": { backgroundColor: "#f0f0f0" },
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
            }}
          />
        </IconButton>

        {/* Panel de chat */}
        {chatOpen && (
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
              transition: "opacity 0.3s ease, transform 0.3s ease",
              opacity: chatOpen ? 1 : 0,
              transform: chatOpen ? "scale(1)" : "scale(0.9)",
              "@media (max-width: 600px)": {
                width: "90vw",
                height: "70vh",
                minHeight: "320px",
                bottom: 10,
                right: 10,
                borderRadius: 2,
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1,
              }}
            >
              <Box
                component="img"
                src="/logos/Qardeal_logo_completo_color.png"
                alt="Qardeal Logo"
                sx={{
                  height: 160,
                  width: 200,
                  mr: 1,
                  mb: -7,
                  mt: -7,
                  ml: -2,
                  objectFit: "contain",
                }}
              />
              <IconButton onClick={toggleChatbot} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
            {iframeValidation.isValid ? (
              <iframe
                src={iframeValidation.sanitizedUrl}
                width="100%"
                height="100%"
                style={{ border: "none" }}
                title="Chatbot de soporte"
                sandbox="allow-scripts allow-same-origin allow-forms"
                loading="lazy"
              />
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  p: 2,
                }}
              >
                <Alert severity="error" sx={{ mb: 2 }}>
                  Chat no disponible
                </Alert>
                {iframeValidation.error && (
                  <Typography variant="caption" color="text.secondary">
                    {iframeValidation.error}
                  </Typography>
                )}
              </Box>
            )}
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default ChatBubble;

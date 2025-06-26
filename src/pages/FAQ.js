import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Container,
  Box,
  TextField,
  InputAdornment,
} from "@mui/material";
import { ExpandMore, Search, Phone, Email } from "@mui/icons-material";
import Link from "next/link";
import { faqData } from "../data/faq.json"; // Ajusta la ruta según tu estructura

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedPanel, setExpandedPanel] = useState(null);

  // Filtrar preguntas basado en el término de búsqueda
  const filteredFAQ = faqData.filter(
    (item) =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Manejar la expansión de paneles
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : null);
  };

  // Función para formatear respuestas con saltos de línea
  const formatAnswer = (answer) => {
    return answer.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < answer.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: "120px", marginBottom: "40px" }}>
      {/* Título */}
      <Typography 
        variant="h3" 
        align="center" 
        gutterBottom
        sx={{ 
          mb: 4,
          fontWeight: 'bold',
          color: 'primary.main'
        }}
      >
        Preguntas Frecuentes
      </Typography>

      {/* Barra de búsqueda */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar pregunta..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            }
          }}
        />
      </Box>

      {/* Mensaje cuando no hay resultados */}
      {filteredFAQ.length === 0 && searchTerm && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No se encontraron preguntas que coincidan con tu búsqueda
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Intenta con otros términos de búsqueda
          </Typography>
        </Box>
      )}

      {/* Lista de FAQ */}
      <Box sx={{ mt: 2 }}>
        {filteredFAQ.map((faq) => (
          <Accordion
            key={faq.id}
            expanded={expandedPanel === `panel${faq.id}`}
            onChange={handleAccordionChange(`panel${faq.id}`)}
            sx={{
              mb: 1,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              '&:before': {
                display: 'none',
              },
              '&.Mui-expanded': {
                margin: '8px 0',
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{
                backgroundColor: 'rgba(0,0,0,0.02)',
                '&.Mui-expanded': {
                  backgroundColor: 'rgba(0,0,0,0.04)',
                },
                '& .MuiAccordionSummary-content': {
                  margin: '12px 0',
                },
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 500,
                  fontSize: '1.1rem'
                }}
              >
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                pt: 2,
                pb: 3,
                px: 3,
              }}
            >
              <Typography 
                variant="body1" 
                sx={{ 
                  lineHeight: 1.6,
                  color: 'text.secondary'
                }}
              >
                {formatAnswer(faq.answer)}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Información de contacto adicional */}
      {!searchTerm && (
        <Box 
          sx={{ 
            mt: 4, 
            p: 3, 
            backgroundColor: 'primary.main', 
            color: 'white', 
            borderRadius: 2,
            textAlign: 'center'
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            ¿No encontraste lo que buscabas?
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Contáctanos directamente para obtener ayuda personalizada
          </Typography>
          
          {/* Contenedor para teléfono y email */}
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'center',
              alignItems: 'center',
              gap: { xs: 2, sm: 4 }
            }}
          >
            {/* Teléfono con Link */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Phone sx={{ mr: 1 }} />
              <Link href="tel:8003332886" style={{ textDecoration: 'none' }}>
                <Typography 
                  variant="h6" 
                  component="span"
                  sx={{ 
                    color: 'white', 
                    textDecoration: 'none',
                    '&:hover': {
                      opacity: 0.8,
                      textDecoration: 'none'
                    },
                    '&:visited': {
                      color: 'white',
                      textDecoration: 'none'
                    }
                  }}
                >
                  800 333 2886
                </Typography>
              </Link>
            </Box>

            {/* Email con Link */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Email sx={{ mr: 1 }} />
              <Link href="mailto:atencionaclientes@qardeal.com.mx" style={{ textDecoration: 'none' }}>
                <Typography 
                  variant="body2" 
                  component="span"
                  sx={{ 
                    color: 'white', 
                    textDecoration: 'none',
                    '&:hover': {
                      opacity: 0.8,
                      textDecoration: 'none'
                    },
                    '&:visited': {
                      color: 'white',
                      textDecoration: 'none'
                    }
                  }}
                >
                  atencionaclientes@qardeal.com.mx
                </Typography>
              </Link>
            </Box>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default FAQ;
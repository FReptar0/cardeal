import React from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";

const retencionesData = [
  {
    categoria: "ECONOMICO",
    sin: "$14,000.00",
    p80: "$10,000.00",
    p90: "$6,000.00",
    p95: "$3,000.00",
  },
  {
    categoria: "COMPACTO",
    sin: "$17,000.00",
    p80: "$12,000.00",
    p90: "$7,000.00",
    p95: "$4,000.00",
  },
  {
    categoria: "FULL",
    sin: "$25,000.00",
    p80: "$16,000.00",
    p90: "$10,000.00",
    p95: "$5,000.00",
  },
  {
    categoria: "SUV 5",
    sin: "$35,000.00",
    p80: "$18,000.00",
    p90: "$11,500.00",
    p95: "$5,500.00",
  },
  {
    categoria: "SUV 5 LX",
    sin: "$45,000.00",
    p80: "$21,000.00",
    p90: "$14,000.00",
    p95: "$6,000.00",
  },
  {
    categoria: "SUV 7",
    sin: "$45,000.00",
    p80: "$24,000.00",
    p90: "$16,000.00",
    p95: "$7,000.00",
  },
];

const headerStyle = {
  background: "#10906a",
  color: "white",
  fontWeight: "bold",
  fontSize: "16px",
};

const Retenciones = () => (
  <Container maxWidth="md" sx={{ mt: 16, mb: 8 }}>
    <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
      TABLA DE RETENCIONES
    </Typography>
    <Typography variant="subtitle1" align="center" gutterBottom>
      (Depósito en garantía)
    </Typography>
    <Box
      sx={{
        border: "2px solid #10906a",
        borderRadius: 2,
        p: 2,
        background: "#fff",
      }}
    >
      <TableContainer component={Paper} elevation={0}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={headerStyle}>CLASE O CATEGORÍA</TableCell>
              <TableCell sx={headerStyle}>SIN PROTECCIONES</TableCell>
              <TableCell sx={headerStyle}>PROTECCIÓN 80%</TableCell>
              <TableCell sx={headerStyle}>PROTECCIÓN 90%</TableCell>
              <TableCell sx={headerStyle}>PROTECCIÓN 95%</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {retencionesData.map((row) => (
              <TableRow key={row.categoria}>
                <TableCell sx={{ fontWeight: "bold", color: "#10906a" }}>
                  {row.categoria}
                </TableCell>
                <TableCell>{row.sin}</TableCell>
                <TableCell>{row.p80}</TableCell>
                <TableCell>{row.p90}</TableCell>
                <TableCell>{row.p95}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  </Container>
);

export default Retenciones;

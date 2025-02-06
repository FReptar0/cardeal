import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Collapse,
  Link,
  useMediaQuery
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LoginIcon from "@mui/icons-material/Login";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useTheme } from "@mui/material/styles";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [activePath, setActivePath] = useState("");

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  // Se ejecuta solo en el cliente
  useEffect(() => {
    if (typeof window !== "undefined") {
      setActivePath(window.location.pathname);
    }
  }, []);

  // Cierra el menú cuando la pantalla se agranda
  useEffect(() => {
    if (isDesktop) {
      setOpen(false);
    }
  }, [isDesktop]);

  const handleNavigation = (path) => {
    if (typeof window !== "undefined") {
      window.location.href = path;
    }
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#F5F5F5", color: "#000" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* LOGO */}
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#2F6135" }}>
            <span style={{ color: "#2F6135" }}>CAR</span>
            <span style={{ color: "#D32F2F" }}>DEAL</span>
          </Typography>

          {/* MENÚ NORMAL (SOLO EN ESCRITORIO) */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 5, width: "100%", justifyContent: "end", marginRight: "32px"}}>
            {["/", "/disponible", "/categorias", "/ofertas"].map((path, index) => (
              <Button
                key={index}
                sx={{
                  color: "#000",
                  borderBottom: activePath === path ? "2px solid #141414" : "none",
                  borderRadius: 0,
                }}
                onClick={() => handleNavigation(path)}
              >
                {path === "/" ? "Inicio" : path.replace("/", "").charAt(0).toUpperCase() + path.slice(2)}
              </Button>
            ))}
          </Box>

          {/* ICONOS Y MENÚ HAMBURGUESA */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <IconButton color="inherit">
              <AccountCircleIcon />
            </IconButton>

            {/* ÍCONO MENÚ (SOLO EN MÓVILES) */}
            <IconButton
              color="inherit"
              sx={{ display: { md: "none" } }}
              onClick={() => setOpen(!open)}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* MENÚ QUE SE EXPANDE HACIA ABAJO */}
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box sx={{ backgroundColor: "#F5F5F5", textAlign: "center", py: 2, paddingTop: "0px" }}>
            
          {["/", "/disponible", "/categorias", "/ofertas"].map((path, index) => (
            <Box sx={{display: "flex", width: "100%", justifyContent: "center"}} id="xd">
            <Link
  key={index}
  sx={{
    color: "#000",
    display: "block",
    textDecoration: "none",
    width: "90%",
    display: "flex",
    py: 1,
    fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`, // ✅ Comillas para la lista de fuentes
    fontWeight: 500,
    fontSize: "0.875rem",
    lineHeight: 1.75,
    letterSpacing: "0.02857em",
    textTransform: "uppercase",
    borderBottom: activePath === path ? "2px solid #141414" : "none",
    cursor: "pointer",
  }}
  onClick={() => handleNavigation(path)}
>
  {path === "/" ? "Inicio" : path.replace("/", "").charAt(0).toUpperCase() + path.slice(2)}
</Link>
            </Box>
          ))}
          </Box>
        
      </Collapse>
    </>
  );
};

export default Header;

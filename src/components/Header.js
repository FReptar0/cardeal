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
  Menu,
  MenuItem,
  useMediaQuery
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useTheme } from "@mui/material/styles";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [activePath, setActivePath] = useState("");
  const [anchorEl, setAnchorEl] = useState(null); // Control del menú de usuario
  const openMenu = Boolean(anchorEl); // Determina si el menú está abierto
  const [showMenu, setShowMenu] = useState(true);
  const [isTop, setIsTop] = useState(true);

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

  // Abre el menú de usuario
  const handleClickUserIcon = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Cierra el menú de usuario
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    // Aquí podrías agregar la lógica de cierre de sesión
    console.log("Cerrar sesión");
    handleCloseMenu(); // Cierra el menú al hacer clic en cerrar sesión
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsTop(scrollTop === 0);
      setShowMenu(scrollTop === 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <AppBar position="sticky" sx={{ background: isTop ? "#F5F5F5" : "linear-gradient(to bottom, rgba(245, 245, 245, 0.9), rgba(245, 245, 245, 0.7))", color: "#000", transition: "background 0.3s, height 0.3s", height: isTop ? "100px" : "60px" }}>
        <Toolbar sx={{ justifyContent: "space-between", minHeight: "60px !important" }}>
          {/* LOGO */}
          <Box
            sx={{ display: "flex", alignItems: "center", height: "100%", cursor: "pointer" }}
            onClick={() => handleNavigation("/")}
          >
            <img
              src="/logos/Qardeal_logo completo verde y rojo.png"
              alt="Logo"
              style={{ width: isTop ? 350 : 200, height: "auto", transition: "width 0.3s" }} // Ajusta el tamaño aquí
            />
          </Box>

          {/* MENÚ NORMAL (SOLO EN ESCRITORIO) */}
          {isTop && (
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 5, width: "100%", justifyContent: "end", marginRight: "32px" }}>
              {["/", "/disponible", "/categorias", "/ofertas", "/atencion-cliente"].map((path, index) => (
                <Button
                  key={index}
                  sx={{
                    color: "#000",
                    textDecoration: "none",
                    fontWeight: activePath === path ? "bold" : "normal",
                    borderBottom: activePath === path ? "2px solid #141414" : "none",
                    cursor: "pointer",
                  }}
                  onClick={() => handleNavigation(path)}
                >
                  {path === "/" ? "Inicio" : path.replace("/", "").charAt(0).toUpperCase() + path.slice(2)}
                </Button>
              ))}
            </Box>
          )}

          {/* ICONOS Y MENÚ HAMBURGUESA */}
          {isTop && (
            <Box sx={{ display: "flex", gap: 2 }}>
              <IconButton color="inherit" onClick={handleClickUserIcon}>
                <AccountCircleIcon />
              </IconButton>

              {/* MENÚ DESPLEGABLE DE USUARIO */}
              <Menu
                anchorEl={anchorEl} // El elemento que dispara el menú
                open={openMenu} // Si el menú está abierto
                onClose={handleCloseMenu} // Cerrar el menú al hacer clic fuera
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem onClick={
                  () => handleNavigation("/perfil")
                }>Mi perfil</MenuItem>
                <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
              </Menu>

              {/* ÍCONO MENÚ (SOLO EN MÓVILES) */}
              <IconButton
                color="inherit"
                sx={{ display: { md: "none" } }}
                onClick={() => setOpen(!open)}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* MENÚ QUE SE EXPANDE HACIA ABAJO */}
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box sx={{ backgroundColor: "#F5F5F5", textAlign: "center", py: 2, paddingTop: "0px" }}>
          {["/", "/disponible", "/categorias", "/ofertas", "/atencion-cliente"].map((path, index) => (
            <Box key={index} sx={{ display: "flex", width: "100%", justifyContent: "center" }}>
              <Link
                href={path}
                sx={{
                  color: "#000",
                  display: "block",
                  textDecoration: "none",
                  width: "90%",
                  py: 1,
                  fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
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

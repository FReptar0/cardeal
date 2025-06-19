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
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../contexts/AuthContext"; // Asegúrate de que la ruta sea correcta

const Header = () => {
  const [open, setOpen] = useState(false);
  const [activePath, setActivePath] = useState("");
  const [anchorEl, setAnchorEl] = useState(null); // Control del menú de usuario
  const openMenu = Boolean(anchorEl); // Determina si el menú está abierto
  const [showMenu, setShowMenu] = useState(true);
  const [isTop, setIsTop] = useState(true);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  // Obtener el estado de autenticación del AuthContext
  const { isLoggedIn, logout } = useAuth();

  useEffect(() => {
    localStorage.setItem("isHeaderTop", JSON.stringify(isTop));
  }, [isTop]);

  // Se ejecuta solo en el cliente para obtener la ruta activa
  useEffect(() => {
    if (typeof window !== "undefined") {
      setActivePath(window.location.pathname);
    }
  }, []);

  // Cierra el menú de navegación si la pantalla es grande
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

  // Maneja la apertura del menú del usuario
  const handleClickUserIcon = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Cierra el menú del usuario
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    console.log("Cerrar sesión");
    handleCloseMenu(); // Cierra el menú
    logout();
    // Opcionalmente, redirigir a la página principal
    handleNavigation("/");
  };

  // Función para iniciar sesión: redirige a la página de login
  const handleLogin = () => {
    handleCloseMenu();
    handleNavigation("/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setIsTop(scrollTop === 0);
      setShowMenu(scrollTop === 0);
      if (scrollTop > 0) {
        setOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const formatPathName = (path) => {
    if (path === "/") return "Inicio";
    if (path === "/atencion-cliente") return "Atención a clientes";
    if (path === "/vehiculos") return "Vehículos";
    if (path === "/sucursales") return "Sucursales";
    if (path === "/soluciones-empresariales") return "Convenios corporativos";
    if (path === "/FAQ") return "Preguntas frecuentes";
    return (
      path.replace("/", "").charAt(0).toUpperCase() +
      path.slice(2).toLowerCase()
    );
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          background: "#F5F5F5",
          color: "#000",
          transition: "background 0.3s, height 0.3s",
          height: isTop ? "100px" : "60px",
        }}
      >
        <Toolbar
          sx={{ justifyContent: "space-between", minHeight: "60px !important" }}
        >
          {/* LOGO */}
          <Box
            sx={{
              width: isTop ? 350 : 200,
              height: "auto",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            onClick={() => handleNavigation("/")}
          >
            <img
              src="/logos/Qardeal_logo_completo_color.png"
              alt="Logo"
              id="logoHeader"
              style={{
                width: "100%",
                height: "auto",
                transition: "width 0.3s",
              }}
            />
          </Box>

          {/* MENÚ NORMAL (SOLO EN ESCRITORIO) */}
          {isTop && (
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 3,
                width: "100%",
                justifyContent: "end",
                marginRight: "32px",
              }}
            >
              {[
                "/",
                "/vehiculos",
                "/sucursales",
                "/soluciones-empresariales",
                "/atencion-cliente",
                "/FAQ",
              ].map((path, index) => (
                <Button
                  key={index}
                  sx={{
                    color: "#000",
                    textDecoration: "none",
                    fontWeight: activePath === path ? "bold" : "normal",
                    borderBottom:
                      activePath === path ? "2px solid #141414" : "none",
                    cursor: "pointer",
                    textTransform: "none", // Se asegura que solo la primera letra sea mayúscula y las demás minúsculas
                  }}
                  onClick={() => handleNavigation(path)}
                >
                  {formatPathName(path)}
                </Button>
              ))}
            </Box>
          )}

          {/* ICONOS Y MENÚ HAMBURGUESA */}
          {isTop && (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column", // Asegura que el texto esté debajo del icono
                  alignItems: "center", // Centra el texto horizontalmente
                  cursor: "pointer",
                  width: "80px", // Aumenta el ancho del contenedor
                }}
                onClick={handleClickUserIcon}
              >
                <IconButton color="inherit" sx={{ marginBottom: "2px" }}>
                  <AccountCircleIcon />
                </IconButton>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#000",
                    display: "block",
                    textDecoration: "none",
                    textAlign: "center", // Centra el texto
                    fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
                    fontWeight: 500,
                    fontSize: "0.75rem", // Tamaño más pequeño
                    letterSpacing: "0.02857em",
                    textTransform: "none", // Se asegura que solo la primera letra sea mayúscula y las demás minúsculas
                    cursor: "pointer",
                    transition: "background 0.3s",
                    borderRadius: "5px",
                    marginTop: "4px", // Espaciado entre el icono y el texto
                  }}
                >
                  {isLoggedIn ? "Mi perfil" : "Iniciar sesión"}
                </Typography>
              </Box>

              {/* MENÚ DESPLEGABLE DE USUARIO */}
              <Menu
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleCloseMenu}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                {isLoggedIn ? (
                  <>
                    <MenuItem onClick={() => handleNavigation("/perfil")}>
                      Mi perfil
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
                  </>
                ) : (
                  <MenuItem onClick={handleLogin}>Iniciar Sesión</MenuItem>
                )}
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

      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box
          id="collapsedMenu"
          sx={{
            backgroundColor: "#F5F5F5",
            textAlign: "center",
            py: 2,
            paddingTop: "0px",
            position: "relative",
            top: "100px",
            left: 0,
            width: "100%",
            zIndex: 3,
          }}
        >
          {[
            "/", // Inicio
            "/vehiculos", // Vehículos
            "/sucursales", // Sucursales
            "/soluciones-empresariales", // Convenios corporativos
            "/atencion-cliente", // Atención a clientes
            "/FAQ", // Preguntas frecuentes
          ].map((path, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
              }}
            >
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
                  textTransform: "none", // Se asegura que solo la primera letra sea mayúscula y las demás minúsculas
                  borderBottom:
                    activePath === path ? "2px solid #141414" : "none",
                  cursor: "pointer",
                  transition: "background 0.3s",
                  borderRadius: "5px",
                  "&:hover": {
                    backgroundColor: "#D6D6D6",
                  },
                }}
              >
                {formatPathName(path)}
              </Link>
            </Box>
          ))}
        </Box>
      </Collapse>
    </>
  );
};

export default Header;

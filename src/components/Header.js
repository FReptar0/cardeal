import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Collapse,
  Menu,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../contexts/AuthContext";
import Link from "next/link"; // Import de Next.js Link
import Image from "next/image";
import { useRouter } from "next/router"; // Para obtener la ruta actual

const Header = () => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [showMenu, setShowMenu] = useState(true);
  const [isTop, setIsTop] = useState(true);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const router = useRouter(); // Hook de Next.js para obtener la ruta actual
  const activePath = router.pathname; // Ruta actual

  // Obtener el estado de autenticación del AuthContext
  const { isLoggedIn, logout } = useAuth();

  useEffect(() => {
    localStorage.setItem("isHeaderTop", JSON.stringify(isTop));
  }, [isTop]);

  // Cierra el menú de navegación si la pantalla es grande
  useEffect(() => {
    if (isDesktop) {
      setOpen(false);
    }
  }, [isDesktop]);

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
    handleCloseMenu();
    logout();
    router.push("/"); // Usar router.push en lugar de window.location.href
  };

  // Función para iniciar sesión
  const handleLogin = () => {
    handleCloseMenu();
    router.push("/login"); // Usar router.push
  };

  // Función para navegar al perfil
  const handleProfileNavigation = () => {
    handleCloseMenu();
    router.push("/perfil"); // Usar router.push
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
          <Link href="/" passHref legacyBehavior>
            <Box
              component="a"
              sx={{
                width: isTop ? 350 : 200,
                height: "auto",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              <Image
                src="/logos/Qardeal_logo_completo_color.png"
                alt="Logo"
                id="logoHeader"
                width={isTop ? 350 : 200}
                height={isTop ? 100 : 60}
                style={{
                  width: "100%",
                  height: "auto",
                  transition: "width 0.3s",
                  objectFit: "contain",
                }}
                priority
              />
            </Box>
          </Link>

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
                <Link key={index} href={path} passHref legacyBehavior>
                  <Button
                    component="a"
                    sx={{
                      color: "#000",
                      textDecoration: "none",
                      fontWeight: activePath === path ? "bold" : "normal",
                      borderBottom:
                        activePath === path ? "2px solid #141414" : "none",
                      cursor: "pointer",
                      textTransform: "none",
                    }}
                  >
                    {formatPathName(path)}
                  </Button>
                </Link>
              ))}
            </Box>
          )}

          {/* ICONOS Y MENÚ HAMBURGUESA */}
          {isTop && (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                  width: "80px",
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
                    textAlign: "center",
                    fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
                    fontWeight: 500,
                    fontSize: "0.75rem",
                    letterSpacing: "0.02857em",
                    textTransform: "none",
                    cursor: "pointer",
                    transition: "background 0.3s",
                    borderRadius: "5px",
                    marginTop: "4px",
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
                    <MenuItem onClick={handleProfileNavigation}>
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
            "/",
            "/vehiculos",
            "/sucursales",
            "/soluciones-empresariales",
            "/atencion-cliente",
            "/FAQ",
          ].map((path, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
              }}
            >
              <Link href={path} passHref legacyBehavior>
                <Box
                  component="a"
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
                    textTransform: "none",
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
                </Box>
              </Link>
            </Box>
          ))}
        </Box>
      </Collapse>
    </>
  );
};

export default Header;

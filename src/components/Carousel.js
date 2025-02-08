import React, { useRef } from "react";
import Slider from "react-slick";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material"; // Íconos de flechas
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import cars from "../data/cars.json"; // Importar datos del JSON

const Carousel = () => {
  const sliderRef = useRef(null); // Referencia al Slider

  const settings = {
    dots: true,
    infinite: true,
    speed: 800, // Transición más fluida
    slidesToShow: 3, // 3 por defecto
    slidesToScroll: 1,
    autoplay: true, // Activa la animación automática
    autoplaySpeed: 5000, // Cambia cada 5 segundos
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } }, // 2 en medianas
      { breakpoint: 600, settings: { slidesToShow: 1 } }, // 1 en chicas
    ],
    centerMode: true,
    centerPadding: "10px",
  };

  const slogans = [
    "Confort y estilo en cada viaje",
    "La mejor elección para tu aventura",
    "Seguridad y rendimiento garantizados",
  ];

  return (
    <Box
      id="sectionTwo"
      sx={{
        height: "70vh",
        width: "80%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "auto",
        position: "relative", // Necesario para posicionar las flechas
      }}
    >
      {/* Flecha izquierda */}
      <IconButton
        id="flechaIzquierda"
        onClick={() => sliderRef.current.slickPrev()}
        sx={{
          position: "absolute",
          top: "48%",
          left: "-60px",
          zIndex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          padding: "10px",
          borderRadius: "50%",
        }}
      >
        <ArrowBack style={{ color: "white" }} />
      </IconButton>

      <Slider ref={sliderRef} {...settings} style={{ width: "100%" }}>
        {cars.map((car, index) => (
          <Card
            key={index}
            sx={{
              padding: "20px",
              textAlign: "center",
              transition: "transform 0.3s ease-in-out",
              "&:hover": { transform: "scale(1.03)" }, // Efecto hover
            }}
          >
            <CardMedia
              component="img"
              height="150"
              width="150"
              image={car.image}
              alt={car.name}
              sx={{ objectFit: "contain" }} // Esto asegura que las imágenes se ajusten bien sin distorsión
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {car.name.replace(" o Similar", "")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {car.description}
              </Typography>
              <Typography variant="body2" color="text.primary" sx={{ marginTop: 1 }}>
                {slogans[index % slogans.length]}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Slider>

      {/* Flecha derecha */}
      <IconButton
        id="flechaDerecha"
        onClick={() => sliderRef.current.slickNext()}
        sx={{
          position: "absolute",
          top: "48%",
          right: "-60px",
          zIndex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          padding: "10px",
          borderRadius: "50%",
        }}
      >
        <ArrowForward style={{ color: "white" }} />
      </IconButton>
    </Box>
  );
};

export default Carousel;

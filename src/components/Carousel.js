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

const images = [
  { src: "/cars/Miata.png", title: "Mazda MX-5 Miata" },
  { src: "/cars/crv.png", title: "Honda CR-V Touring" },
  { src: "/cars/f150.png", title: "Ford F-150 XLT" },
  { src: "/cars/Miata.png", title: "Mazda MX-5 Miata" },
  { src: "/cars/Versa.png", title: "Nissan Versa Advance" },
  { src: "/cars/f150.png", title: "Ford F-150 XLT" },
];

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
        {images.map((item, index) => (
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
              image={item.src}
              alt={item.title}
              sx={{ objectFit: "contain" }} // Esto asegura que las imágenes se ajusten bien sin distorsión
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Slider>

      {/* Flecha derecha */}
      <IconButton
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

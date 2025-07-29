// components/Carousel.js
import React, { useRef } from "react";
import Slider from "react-slick";
import PropTypes from "prop-types";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  useTheme,
} from "@mui/material";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import cars from "../data/cars.json";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Carousel = React.memo(function Carousel() {
  const sliderRef = useRef(null);
  const theme = useTheme();

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 4500,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <Box
      component="section"
      role="region"
      aria-label="Carrusel de vehículos"
      sx={{
        position: "relative",
        width: "100%",
        overflow: "visible",
        px: { xs: 2, md: 0 },
      }}
    >
      <IconButton
        onClick={() => sliderRef.current.slickPrev()}
        aria-label="Imagen anterior del carrusel"
        sx={{
          position: "absolute",
          top: "50%",
          left: { xs: 8, md: 16 },
          transform: "translateY(-50%)",
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[3],
          zIndex: 2,
          "&:hover": { backgroundColor: theme.palette.background.paper },
        }}
      >
        <ArrowBackIosNew />
      </IconButton>
      <IconButton
        onClick={() => sliderRef.current.slickNext()}
        aria-label="Siguiente imagen del carrusel"
        sx={{
          position: "absolute",
          top: "50%",
          right: { xs: 8, md: 16 },
          transform: "translateY(-50%)",
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[3],
          zIndex: 2,
          "&:hover": { backgroundColor: theme.palette.background.paper },
        }}
      >
        <ArrowForwardIos />
      </IconButton>

      <Box
        sx={{
          "& .slick-dots": {
            bottom: -28,
            "& li": { margin: "0 4px" },
            "& li button:before": {
              fontSize: "10px",
              color: theme.palette.text.disabled,
              opacity: 1,
            },
            "& li.slick-active button:before": {
              color: theme.palette.primary.main,
            },
          },
        }}
      >
        <Slider ref={sliderRef} {...settings}>
          {cars.map((car, i) => (
            <Box key={i} px={{ xs: 1, md: 2 }}>
              <Card
                sx={{
                  bgcolor: "#fff",
                  borderRadius: 2,
                  boxShadow: 3,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  transition: "transform 0.3s",
                  "&:hover": { transform: "scale(1.05)" },
                  marginBottom: 2,
                }}
              >
                <CardMedia
                  component="img"
                  image={car.image}
                  alt={car.name}
                  sx={{
                    height: { xs: 220, md: 300 }, // más altura
                    objectFit: "contain",
                    bgcolor: "#fff",
                    p: { xs: 4, md: 5 }, // padding uniforme
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      fontWeight: 700,
                      textAlign: "center",
                      fontSize: { xs: "1rem", md: "1.1rem" },
                    }}
                  >
                    {car.name.replace(" o Similar", "")}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: "center" }}
                  >
                    {car.description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
});

// PropTypes validation
Carousel.propTypes = {
  // This component doesn't receive props
};

export default Carousel;

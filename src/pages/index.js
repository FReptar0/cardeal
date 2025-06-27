import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import Carousel from "../components/Carousel";
import CarouselFlota from "../components/CarouselFlota";
import Hero from "../components/Hero";
import { useSearch } from "@/contexts/SearchContext";
import { useBooking } from "@/contexts/BookingContext";

// Hook personalizado para animaciones de scroll
const useScrollAnimation = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Desconectar el observer después de que se active la animación
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
};

// Componente de animación reutilizable
const AnimatedSection = ({ 
  children, 
  delay = 0, 
  direction = "left", 
  duration = "0.8s",
  style = {},
  ...props 
}) => {
  const [ref, isVisible] = useScrollAnimation(0.1);
  
  const getTransform = () => {
    switch (direction) {
      case "left":
        return isVisible ? "translateX(0)" : "translateX(-100px)";
      case "right":
        return isVisible ? "translateX(0)" : "translateX(100px)";
      case "up":
        return isVisible ? "translateY(0)" : "translateY(50px)";
      case "scale":
        return isVisible ? "scale(1)" : "scale(0.8)";
      default:
        return isVisible ? "translateX(0)" : "translateX(-100px)";
    }
  };

  const animationStyle = {
    transform: getTransform(),
    opacity: isVisible ? 1 : 0,
    transition: `all ${duration} cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`,
    ...style
  };

  return (
    <div ref={ref} style={animationStyle} {...props}>
      {children}
    </div>
  );
};

export default function Index() {
  const { clearSearch } = useSearch();
  const { clearBooking } = useBooking();
  
  useEffect(() => {
    clearSearch();
    clearBooking();
  }, []);

  return (
    <Box sx={{ width: "100%", textAlign: "center" }}>
      {/* Sección Hero */}
      <AnimatedSection 
        id="sectionOne" 
        style={{ width: "100%" }}
        direction="scale"
        duration="1s"
      >
        <Hero />
      </AnimatedSection>

      {/* Sección de video */}
      <AnimatedSection
        direction="left"
        delay={0.2}
        duration="1s"
        style={{
          width: "100%",
          backgroundColor: "black",
          overflow: "hidden",
          position: "relative",
          aspectRatio: "16 / 9",
          maxHeight: "600px",
          marginTop: "10%",
        }}
      >
        <video
          src="/videos/LOGO.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </AnimatedSection>

      {/* Sección Nuestra Flota */}
      <AnimatedSection
        id="sectionTwo"
        direction="up"
        delay={0.1}
        duration="0.8s"
        style={{
          paddingTop: "80px",
          paddingBottom: "40px",
          width: "100%",
          backgroundColor: "#fff",
        }}
      >
        {/* Título animado por separado */}
        <AnimatedSection 
          direction="left" 
          delay={0.3}
          style={{ textAlign: "center" }}
        >
          <h2 
            style={{ 
              fontSize: "44px", 
              marginBottom: "10px",
              WebkitBackgroundClip: "text",
              color: "transparent",
              background: "linear-gradient(135deg, #10906a, #0d7a57)",
              fontWeight: "bold",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
          >
            Nuestra flota
          </h2>
        </AnimatedSection>
        
        {/* Subtítulo animado */}
        <AnimatedSection 
          direction="right" 
          delay={0.5}
          style={{ textAlign: "center" }}
        >
          <p style={{ 
            fontSize: "1.3rem", 
            fontWeight: "600",
            color: "#555"
          }}>
            Tenemos los mejores autos de acuerdo a tus necesidades
          </p>
        </AnimatedSection>
        
        {/* Carousel animado */}
        <AnimatedSection 
          direction="up" 
          delay={0.7}
          style={{ width: "100%", marginTop: "24px", display: "flex", justifyContent: "center" }}
        >
          <CarouselFlota />
        </AnimatedSection>
      </AnimatedSection>
    </Box>
  );
}
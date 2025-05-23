"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  IconButton,
} from "@mui/material";
import dynamic from "next/dynamic";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import RentalStepper from "../components/Stepper";
import CompactHeader from "../components/CompactHeader";
import { useBooking } from "../contexts/BookingContext";
import { useSearch } from "../contexts/SearchContext";

const SearchBar = dynamic(() => import("../components/SearchBar"), {
  ssr: false,
});

const extrasCatalogo = [
  {
    id: "ADD",
    nombre: "Conductor Adicional",
    descripcion:
      "Se pueden incluir conductores adicionales con un costo extra por día.",
    codeExtras: "ADD",
    imagen: "/extras/adicional.webp",
  },
  {
    id: "UAGE",
    nombre: "Conductor Menor de 25 Años",
    descripcion:
      "Los conductores menores de 25 años generan un cargo adicional por día.",
    codeExtras: "UAGE",
    imagen: "/extras/menor.webp",
  },
  {
    id: "BABY",
    nombre: "Baby Seat (Grupo 0+)",
    descripcion: "Bebé (grupo 0+), niños de 1 a 13 kilos.",
    codeExtras: "BABY",
    imagen: "/extras/baby-seat.webp",
  },
  {
    id: "CHILD",
    nombre: "Child Seat (Grupo 0/1/2)",
    descripcion: "Niños de 1 a 25 kilos.",
    codeExtras: "CHILD",
    imagen: "/extras/child-seat.webp",
  },
  {
    id: "BOOST",
    nombre: "Booster",
    descripcion: "Asiento para niños de 18 a 45 kilos.",
    codeExtras: "BOOST",
    imagen: "/extras/Booster.webp",
  },
];

const ExtrasRenta = () => {
  const router = useRouter();
  const booking = useBooking();
  const search = useSearch();

  const { selectedExtras, setSelectedExtras, selectedCar, isCarLoaded } =
    booking;

  const { searchData } = search;

  const [extrasDisponibles, setExtrasDisponibles] = useState([]);
  const [headerIsTop, setHeaderIsTop] = useState(true);
  const [showCompactHeader, setShowCompactHeader] = useState(false);
  const [hideSearchSection, setHideSearchSection] = useState(false);
  const [searchDataLocal, setSearchDataLocal] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (
      isCarLoaded &&
      selectedCar?.category &&
      searchData?.pickupLocation?.id &&
      searchData?.returnLocation?.id &&
      searchData?.pickupDate &&
      searchData?.returnDate &&
      searchData?.pickupTime &&
      searchData?.returnTime
    ) {
      console.log("🚀 Ejecutando fetch con:", {
        category: selectedCar.category,
        pickup: searchData.pickupLocation.id,
        return: searchData.returnLocation.id,
      });

      const obtenerExtras = async () => {
        const response = await fetch("/api/extras", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pickupLocationId: searchData.pickupLocation.id,
            returnLocationId: searchData.sameOffice
              ? searchData.pickupLocation.id
              : searchData.returnLocation.id,
            pickupDateTime: `${searchData.pickupDate} ${searchData.pickupTime}`,
            returnDateTime: `${searchData.returnDate} ${searchData.returnTime}`,
            classCode: selectedCar.category,
            allExtras: extrasCatalogo,
          }),
        });

        const data = await response.json();
        console.log("📥 Extras recibidos:", data);
        const precioPorDia = (total, dias) => (dias > 0 ? total / dias : total);

        const dataConPrecioBase = data.map((extra) => ({
          ...extra,
          precio: precioPorDia(extra.precio, rentalDays),
        }));

        setExtrasDisponibles(dataConPrecioBase);
      };

      obtenerExtras();
    }
  }, [
    isCarLoaded,
    selectedCar?.category,
    searchData?.pickupLocation?.id,
    searchData?.returnLocation?.id,
    searchData?.pickupDate,
    searchData?.returnDate,
    searchData?.pickupTime,
    searchData?.returnTime,
    searchData?.sameOffice,
  ]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const interval = setInterval(() => {
        const headerTop = JSON.parse(localStorage.getItem("isHeaderTop"));
        if (headerTop === null) return;
        setHeaderIsTop(headerTop);
        setShowCompactHeader(!headerTop);
        setHideSearchSection(!headerTop);
      }, 100);

      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    console.log("Selected extras:", selectedExtras);
  }, [selectedExtras]);

  const rentalDays =
    searchData && searchData.pickupDate && searchData.returnDate
      ? Math.ceil(
          (new Date(searchData.returnDate) - new Date(searchData.pickupDate)) /
            (1000 * 60 * 60 * 24)
        )
      : 1;

  const modificarCantidad = (id, operacion) => {
    const extra = extrasDisponibles.find((e) => e.id === id);
    if (!extra) return;

    const limites = {
      ADD: 1,
      UAGE: 1,
      BABY: 2,
      CHILD: 2,
      BOOST: 2,
    };

    const prev = selectedExtras[id] || {
      id: extra.id,
      nombre: extra.nombre,
      precio: extra.precio,
      cantidad: 0,
    };

    const maximo = limites[extra.id] || Infinity;
    let nuevaCantidad = prev.cantidad;

    if (operacion === "sumar") {
      if (nuevaCantidad >= maximo) return; // no permitir más
      nuevaCantidad += 1;
    } else {
      nuevaCantidad = Math.max(0, nuevaCantidad - 1);
    }

    const updated = { ...selectedExtras };
    if (nuevaCantidad > 0) {
      updated[id] = { ...prev, cantidad: nuevaCantidad };
    } else {
      delete updated[id];
    }
    setSelectedExtras(updated);
  };

  const total = Object.values(selectedExtras || {}).reduce(
    (acc, extra) => acc + extra.precio * extra.cantidad * rentalDays,
    0
  );

  const irAcheckout = () => {
    router.push("/checkout");
  };

  if (!isCarLoaded) {
    console.log("⏳ Esperando que se cargue el coche desde localStorage...");
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ textAlign: "center", marginTop: "148px" }}>
      <Box
        sx={{
          overflow: "hidden",
          maxHeight: hideSearchSection ? 0 : "1000px",
          opacity: hideSearchSection ? 0 : 1,
          transform: hideSearchSection ? "translateY(-20px)" : "translateY(0)",
          transition: "all 0.5s ease-in-out",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            width: "100%",
            margin: "0 auto",
            boxSizing: "border-box",
            gap: 1,
          }}
        >
          <SearchBar onValuesChange={setSearchDataLocal} />
        </Box>
      </Box>

      {isClient && (
        <CompactHeader
          searchData={searchDataLocal}
          headerIsTop={headerIsTop}
          showCompactHeader={showCompactHeader}
        />
      )}

      <Box sx={{ width: "100%" }}>
        <RentalStepper />
      </Box>

      <Typography variant="h4" fontWeight="bold" sx={{ mt: 3 }}>
        Extras para tu renta
      </Typography>
      <Typography variant="body1" mb={4}>
        Añade servicios adicionales para mejorar tu experiencia
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {extrasDisponibles.map((extra) => {
          const cantidad = selectedExtras?.[extra.id]?.cantidad || 0;

          return (
            <Grid item xs={12} sm={6} md={12} key={extra.id}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignItems: "stretch",
                  height: "100%",
                  overflow: "hidden",
                }}
              >
                <CardMedia
                  component="img"
                  sx={{
                    m: "8px",
                    width: { xs: 90, sm: 110, md: 125 },
                    height: "auto",
                    objectFit: "contain",
                    marginX: "auto",
                  }}
                  image={extra.imagen}
                  alt={extra.nombre}
                />

                <CardContent
                  sx={{
                    flex: 1,
                    textAlign: "left",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    p: 2,
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    {extra.nombre}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {extra.descripcion}
                  </Typography>
                </CardContent>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    pr: 2,
                    pb: { xs: 2, md: 0 },
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ color: "#d60812" }}
                  >
                    {extra.precio.toFixed(2)} MXN/DÍA
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <IconButton
                      onClick={() => modificarCantidad(extra.id, "restar")}
                      disabled={cantidad === 0}
                      sx={{
                        "& .MuiSvgIcon-root": {
                          fontSize: { xs: "1.3rem", md: "1.8rem" },
                        },
                      }}
                    >
                      <RemoveIcon />
                    </IconButton>

                    <Typography variant="h6">{cantidad}</Typography>

                    <IconButton
                      onClick={() => modificarCantidad(extra.id, "sumar")}
                      sx={{
                        "& .MuiSvgIcon-root": {
                          fontSize: { xs: "1.3rem", md: "1.8rem" },
                        },
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 4,
          p: 2,
          backgroundColor: "#f8f8f8",
          borderRadius: "8px",
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          TOTAL de extras:
        </Typography>
        <Typography variant="h5" fontWeight="bold" sx={{ color: "#d60812" }}>
          {total.toFixed(2)} MXN
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4, pb: 3 }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#d60812",
            color: "white",
            fontWeight: "bold",
            padding: "12px 30px",
            fontSize: "16px",
          }}
          onClick={irAcheckout}
        >
          CONTINUAR
        </Button>
      </Box>
    </Container>
  );
};

export default ExtrasRenta;

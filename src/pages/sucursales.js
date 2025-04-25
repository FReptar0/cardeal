import React from "react";
import { Box, Typography, Divider, Grid, Link } from "@mui/material";

export default function Sucursales() {
    // Ubicaciones para CDMX
    const cdmxLocations = [
        {
            address:
                "Interior del Aeropuerto Internacional Benito Juárez Terminal 1, local 048 Puerta 4 área Nacional, CDMX",
            iframeSrc:
                "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.474563694194!2d-99.0877233135102!3d19.43509573503314!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1fc0a6b509847%3A0x984b414774d46f0!2sTerminal%201%2C%20M%C3%A9xico%20(Lic.%20Benito%20Ju%C3%A1rez)%2C%20Ciudad%20de%20M%C3%A9xico%2C%20CDMX!5e0!3m2!1ses!2smx!4v1743634450270!5m2!1ses!2smx",
            link: "https://maps.app.goo.gl/J7ZVacAc4VoH67DV8",
            wazeLink: "https://ul.waze.com/ul?place=ChIJo2vFDQr80YURR4-CxwwHcH0&ll=19.43531000%2C-99.08367000&navigate=yes&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location",
        },
        {
            address:
                "Interior del Aeropuerto Internacional Benito Juárez Terminal 1, local 160 Puerta 7 Internacional, CDMX",
            iframeSrc:
                "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.474563694194!2d-99.0877233135102!3d19.43509573503314!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1fc0a6b509847%3A0x984b414774d46f0!2sTerminal%201%2C%20M%C3%A9xico%20(Lic.%20Benito%20Ju%C3%A1rez)%2C%20Ciudad%20de%20M%C3%A9xico%2C%20CDMX!5e0!3m2!1ses!2smx!4v1743634450270!5m2!1ses!2smx",
            link: "https://maps.app.goo.gl/J7ZVacAc4VoH67DV8",
            wazeLink: "https://ul.waze.com/ul?place=ChIJo2vFDQr80YURR4-CxwwHcH0&ll=19.43531000%2C-99.08367000&navigate=yes&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location",
        },
    ];

    // Ubicaciones para EDOMEX
    const edoMexLocations = [
        {
            address:
                "Blvd. Manuel Avila Camacho #1834, Col. Ciudad Satélite, CP 53100 Naucalpan Edo. Mex",
            iframeSrc:
                "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3760.949854941677!2d-99.24005131930578!3d19.50079309678385!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d20321b44a6373%3A0x1166a8c037637600!2sPerif.%20Blvd.%20Manuel%20%C3%81vila%20Camacho%201834%2C%20Cd.%20Sat%C3%A9lite%2C%2053100%20Naucalpan%20de%20Ju%C3%A1rez%2C%20M%C3%A9x.!5e0!3m2!1ses!2smx!4v1743634604254!5m2!1ses!2smx",
            link: "https://maps.app.goo.gl/7VXfPvDwTpXLHX6f7",
            wazeLink: "https://ul.waze.com/ul?place=ChIJc2NKtCED0oURAHZjN8CoZhE&ll=19.50052010%2C-99.23726180&navigate=yes&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location",
            hours: "Horario de atención: 9:00 AM - 6:00 PM",
        },
    ];

    // Renderizado de las ubicaciones
    // Agregamos un segundo parámetro 'withLabel' para indicar si se muestra la etiqueta "Próxima apertura".
    const renderLocations = (locations, withLabel = false) =>
        locations.map((loc, index) => (
            <Box
                key={index}
                sx={{
                    position: "relative", // Para poder posicionar la etiqueta arriba a la derecha
                    mb: 6,
                    p: 2,
                    backgroundColor: "background.paper",
                    borderRadius: 2,
                    boxShadow: 2,
                }}
            >
                {/* Etiqueta "Próxima apertura" en la esquina superior derecha */}
                {withLabel && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            backgroundColor: "#D32F2F",
                            color: "#fff",
                            fontWeight: "bold",
                            px: 2,
                            py: 1,
                            borderRadius: "0 0 0 8px",
                            zIndex: 999,
                        }}
                    >
                        Próxima apertura
                    </Box>
                )}

                <Grid
                    container
                    spacing={4}
                    direction={{ xs: "column", md: "row" }}
                    alignItems="stretch"
                >
                    {/* Contenedor para el mapa con relación 16:9 */}
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                position: "relative",
                                width: "100%",
                                paddingTop: "56.25%", // Relación 16:9
                                borderRadius: 2,
                                overflow: "hidden",
                                boxShadow: 1,
                            }}
                        >
                            <iframe
                                title={`map-${index}`}
                                src={loc.iframeSrc}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    border: 0,
                                }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </Box>
                    </Grid>

                    {/* Texto de la ubicación */}
                    <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "column",
                        }}
                    >
                        <Box sx={{ textAlign: "center", px: { xs: 1, md: 4 } }}>
                            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                                {loc.address}
                            </Typography>
                            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
                                <Link
                                    href={loc.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: 60,
                                        height: 60,
                                        borderRadius: "50%",
                                        border: "1px solid #cecece",
                                        cursor: "pointer",
                                        transition: "transform 0.2s",
                                        ":hover": {
                                            transform: "scale(1.1)",
                                        },
                                    }}
                                >
                                    <img
                                        src="/icons/ic-google-maps.png"
                                        alt="Google Maps"
                                        style={{ width: 32, height: 32 }}
                                    />
                                </Link>
                                {loc.wazeLink && (
                                    <Link
                                        href={loc.wazeLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            width: 60,
                                            height: 60,
                                            borderRadius: "50%",
                                            border: "1px solid #cecece",
                                            cursor: "pointer",
                                            transition: "transform 0.2s",
                                            ":hover": {
                                                transform: "scale(1.1)",
                                            },
                                        }}
                                    >
                                        <img
                                            src="/icons/ic-waze.svg"
                                            alt="Waze"
                                            style={{ width: 32, height: 32 }}
                                        />
                                    </Link>
                                )}
                            </Box>
                            {loc.hours && (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    {loc.hours}
                                </Typography>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        ));

    return (
        <Box sx={{ maxWidth: 1200, mx: "auto", pt: 10, px: { xs: 2, md: 4 }, mt: 8 }}>
            {/* Título principal */}
            <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
                Sucursales
            </Typography>

            <Typography
                variant="subtitle1"
                align="center"
                sx={{ mb: 8, color: "text.secondary" }}
            >
                Encuentra nuestras sucursales en CDMX y EDOMEX
            </Typography>

            {/* Sección CDMX */}
            <Box sx={{ mb: 8 }}>
                <Typography variant="h5" align="center" sx={{ fontWeight: "medium", mb: 1 }}>
                    CDMX
                </Typography>
                <Divider sx={{ mb: 4, width: "50%", mx: "auto" }} />
                {/* Se indica 'withLabel = true' para mostrar el indicador de "Próxima apertura" */}
                {renderLocations(cdmxLocations, true)}
            </Box>

            {/* Sección EDOMEX */}
            <Box sx={{ mb: 6 }}>
                <Typography variant="h5" align="center" sx={{ fontWeight: "medium", mb: 1 }}>
                    EDOMEX
                </Typography>
                <Divider sx={{ mb: 4, width: "50%", mx: "auto" }} />
                {renderLocations(edoMexLocations)}
            </Box>
        </Box>
    );
}

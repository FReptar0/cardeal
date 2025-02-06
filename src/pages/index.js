import React from 'react'
import { Box, Grid } from "@mui/material";


export default function index() {
  return (
    <Box sx={{width: "100%", textAlign: "center", display: "flex", alignContent: "center", justifyContent: "center"}}>
      <div id='sectionOne' style={{height: "90vh", width: "90%", display: 'flex', alignItems: "center"}}>
        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
          <Grid size={6}>
            <img style={{width: "95vh", marginTop: "-50px"}} src='/images-seguros/Miata3.png'></img>
            <h2 style={{fontWeight: 300, fontSize: "2.5rem", textAlign: "start", marginLeft: "50px"}}>Renta un <span style={{color: "#ff3f60"}}>SUEÑO</span>, renta un <span style={{color: "#10906a"}}>AUTO</span>. <br></br> Rápido y sencillo.</h2>
          </Grid>
          <Grid size={6}>
            <Box sx={{background: "gray"}}>

            </Box>
          </Grid>
        </Grid>
      </div>
    </Box>
  )
}

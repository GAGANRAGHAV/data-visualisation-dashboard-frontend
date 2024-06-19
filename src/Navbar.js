import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import './App.css'
const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
          Data Visualization Dashboard
        </Typography>
        {/* <Typography variant="h4">Data Visualization Dashboard</Typography> */}

        <Button variant="contained" className="blue">Heatmap</Button>
        <Button variant="contained" color="success">Piechart</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

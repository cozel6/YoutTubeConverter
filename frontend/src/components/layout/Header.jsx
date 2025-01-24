import React from "react";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';

export default function Header() {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h5" sx={{ flexGrow: 2, fontWeight: 'bold' , letterSpacing: 1.5 , color: 'white' , fontFamily: 'Montserrat'}}>
                    YouTube Converter
                </Typography>
                <Box>
                    <Button color="inherit" component={RouterLink} to="/ "> Home</Button>
                    <Button color="inherit" component={RouterLink} to="/about"> About</Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
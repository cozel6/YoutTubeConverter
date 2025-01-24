import React from "react";
import { Box , Typography } from "@mui/material";

export default function Footer() {
    return (
        <Box component = "footer" sx ={{
            py: 2,
            px: 2,
            mt: 'auto',
            backgroundColor: 'primary.main',
            color: 'white',
            textAlign: 'center',
        }}>
            <Typography variant="body1">
                © 2025 YouTube Converter
            </Typography> 
            <Typography variant="body2">
                All rights reserved / This application is created for practice purposes
            </Typography>
        </Box>
    )
}
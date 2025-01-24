import React from 'react';
import { AppRouter } from './router/AppRouter';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { Box } from '@mui/material';

export default function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <AppRouter />
      <Footer />
    </Box>
  );
}

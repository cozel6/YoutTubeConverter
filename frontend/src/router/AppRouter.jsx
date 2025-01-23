import React from 'react';
import {
    BrowserRouter,
    Route,
    Routes
 } from 'react-router-dom';

 import Home  from '../pages/Home';
 import About  from '../pages/About';

export const AppRouter = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<h2>404 - Page Not Found</h2>} />
        </Routes>
    </BrowserRouter>
)
import React from 'react';
import {
    Route,
    Routes
 } from 'react-router-dom';

 import Home  from '../pages/Home';
 import About  from '../pages/About';

export const AppRouter = () => (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<h2>404 - Page Not Found</h2>} />
        </Routes>
)
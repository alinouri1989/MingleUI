import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import ProtectedRoutes from './ProtectedRoutes';
import Home from '../pages/Home/Home';
import Sign from '../pages/Sign/Sign';

function AppRoutes() {
   
    const user = false; 

    return (
        <Routes>
            {/* Default Route */}
            <Route
                path="/"
                element={user ? <Home /> : <Navigate to="/giris-yap" replace />}
            />
            {/* If not valid path navigate "/" */}
            <Route path="/*" element={<Navigate to="/" replace />} />

            {/* Public Routes */}
            {!user && (
                <>
                    <Route path="/giris-yap" element={<Sign />} />
                    <Route path="/uye-ol" element={<Sign />} />
                    <Route path="/sifre-yenile" element={<Sign />} />
                </>
            )}

            {/* If user is valid */}
            {user && (
                <>
                    <Route
                        path="/giris-yap"
                        element={<Navigate to="/" replace />}
                    />
                    <Route
                        path="/uye-ol"
                        element={<Navigate to="/" replace />}
                    />
                    <Route
                        path="/sifre-yenile"
                        element={<Navigate to="/" replace />}
                    />
                </>
            )}
            {/* Protected Routes */}
        </Routes>
    );
}

export default AppRoutes;

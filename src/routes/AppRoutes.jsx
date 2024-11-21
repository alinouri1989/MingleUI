import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Sign from "../pages/Sign/Sign.jsx";
import Layout from '../Layout/Layout.jsx';
import Chats from '../components/Chats/Chats.jsx';
import Archives from '../components/Archives/Archives.jsx';
import Groups from '../components/Groups/Groups.jsx';
import Calls from '../components/Calls/Calls.jsx';
import Home from '../components/Home/Home.jsx';


function AppRoutes() {
    const user = true;

    return (
        <Routes>
            {/* Public Routes */}
            {!user && (
                <>
                    <Route path="/giris-yap" element={<Sign />} />
                    <Route path="/uye-ol" element={<Sign />} />
                    <Route path="/sifre-yenile" element={<Sign />} />
                    {/* Eğer bir kullanıcı giriş yapmadan başka bir rota denerse */}
                    <Route path="*" element={<Navigate to="/giris-yap" replace />} />
                </>
            )}

            {/* Protected Routes */}
            {user && (
                <>
                    {/* Layout ile korunan rotalar */}
                    <Route path="/" element={<Layout />}>
                        <Route path="anasayfa" element={<Home />} />
                        <Route path="sohbetler" element={<Chats />} />
                        <Route path="arsivler" element={<Archives />} />
                        <Route path="gruplar" element={<Groups />} />
                        <Route path="aramalar" element={<Calls />} />
                    </Route>
                    //! Daha sonra burada sohbet, grup gibi rotalar'a *sohbetId tarzı yapılanma ile dinamikleştirilecek

                    {/* Eğer giriş yapmış kullanıcı public rotalara ulaşmaya çalışırsa */}
                    <Route path="/giris-yap" element={<Navigate to="/" replace />} />
                    <Route path="/uye-ol" element={<Navigate to="/" replace />} />
                    <Route path="/sifre-yenile" element={<Navigate to="/" replace />} />
                </>
            )}

            {/* Default: Kullanıcı giriş durumu fark etmeksizin tanımlı olmayan rotalar */}
            <Route path="*" element={<Navigate to={user ? "/" : "/giris-yap"} replace />} />
        </Routes>
    );
}

export default AppRoutes;

import { useSelector } from 'react-redux';
import { Route, Routes, Navigate } from 'react-router-dom';

import Sign from "../pages/Sign/Sign.jsx";
import Layout from '../Layout/Layout.jsx';
import Chats from '../components/Chats/Chats.jsx';
import Archives from '../components/Archives/Archives.jsx';
import Groups from '../components/Groups/Groups.jsx';
import Calls from '../components/Calls/Calls.jsx';
import Home from '../components/Home/Home.jsx';

import { SignalRProvider } from '../contexts/SignalRContext'; // SignalRProvider'ı burada kullanıyoruz.

function AppRoutes() {
    const { user } = useSelector((state) => state.auth);

    return (
        <Routes>
            {/* Public Routes */}
            {!user && (
                <>
                    <Route path="/giris-yap" element={<Sign />} />
                    <Route path="/uye-ol" element={<Sign />} />
                    <Route path="/sifre-yenile" element={<Sign />} />
                    {/* Kullanıcı giriş yapmadan başka bir rota denerse */}
                    <Route path="*" element={<Navigate to="/giris-yap" replace />} />
                </>
            )}

            {/* Protected Routes */}
            {user && (
                <Route
                    path="/"
                    element={
                        <SignalRProvider>
                            <Layout />
                        </SignalRProvider>
                    }
                >
                    <Route path="anasayfa" element={<Home />} />
                    <Route path="sohbetler" element={<Chats />} />
                    <Route path="sohbetler/:id" element={<Chats />} />
                    <Route path="arsivler" element={<Archives />} />
                    <Route path="arsivler/:id" element={<Archives />} />
                    <Route path="gruplar" element={<Groups />} />
                    <Route path="gruplar/:id" element={<Groups />} />
                    <Route path="aramalar" element={<Calls />} />
                    <Route path="aramalar/:id" element={<Calls />} />
                </Route>
            )}

            {/* Default: Tanımlı olmayan rotalar */}
            <Route path="*" element={<Navigate to={user ? "/anasayfa" : "/giris-yap"} replace />} />
        </Routes>
    );
}

export default AppRoutes;

import { useSelector } from 'react-redux';
import { Route, Routes, Navigate } from 'react-router-dom';

import Sign from "../pages/Sign/Sign.jsx";
import Layout from '../layout/Layout.jsx';
import Chats from '../components/Chats/Chats.jsx';
import Archives from '../components/Archives/Archives.jsx';
import Groups from '../components/Groups/Groups.jsx';
import Calls from '../components/Calls/Calls.jsx';
import Home from '../components/Home/Home.jsx';

function AppRoutes() {

    const { user } = useSelector((state) => state.auth);

    return (
        <Routes>
            {!user && (
                <>
                    <Route path="/giris-yap" element={<Sign />} />
                    <Route path="/uye-ol" element={<Sign />} />
                    <Route path="/sifre-yenile" element={<Sign />} />
                    <Route path="*" element={<Navigate to="/giris-yap" replace />} />
                </>
            )}

            {user && (
                <>
                    <Route path="/" element={<Navigate to="/anasayfa" replace />} />

                    <Route path="/" element={<Layout />}>
                        <Route path="anasayfa" element={<Home />} />
                        <Route path="sohbetler" element={<Chats />} />
                        <Route path="sohbetler/:id" element={<Chats />} />
                        <Route path="arsivler" element={<Archives />} />
                        <Route path="arsivler/:id" element={<Chats />} />
                        <Route path="gruplar" element={<Groups />} />
                        <Route path="gruplar/:id" element={<Groups />} />
                        <Route path="aramalar" element={<Calls />} />
                        <Route path="aramalar/:id" element={<Calls />} />
                    </Route>

                    <Route path="/giris-yap" element={<Navigate to="/anasayfa" replace />} />
                    <Route path="/uye-ol" element={<Navigate to="/anasayfa" replace />} />
                    <Route path="/sifre-yenile" element={<Navigate to="/anasayfa" replace />} />
                </>
            )}

            <Route path="*" element={<Navigate to={user ? "/anasayfa" : "/giris-yap"} replace />} />
        </Routes>
    );
}

export default AppRoutes;

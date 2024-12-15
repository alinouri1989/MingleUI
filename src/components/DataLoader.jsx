import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getJwtFromCookie } from "../store/helpers/getJwtFromCookie";
import { authApi } from "../store/Slices/auth/authApi";
import { setUser } from "../store/Slices/auth/authSlice";
import MinglePreLoader from "../shared/components/MinglePreLoader/MinglePreLoader";

const DataLoader = ({ children }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    // State: Loading durumunu kontrol eder
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            const jwt = getJwtFromCookie(); // JWT'yi cookie'den al

            if (jwt) {
                try {
                    // Kullanıcı bilgilerini almak için getUserProfile çağrısı
                    const userProfile = await dispatch(
                        authApi.endpoints.getUserProfile.initiate()
                    ).unwrap();

                    // Kullanıcı bilgilerini ve token'ı Redux store'a kaydet
                    dispatch(
                        setUser({
                            user: userProfile,
                            token: jwt,
                        })
                    );
                } catch (error) {
                    console.error("Failed to fetch user profile:", error);
                }
            }

            // İşlem tamamlandığında bir timeout ile loading'i kaldır
            setTimeout(() => {
                setIsLoading(false); // 1 saniye gecikmeli olarak içeriği göster
            },900);
        };

        initializeAuth();
    }, [dispatch]);

    // Eğer loading devam ediyorsa özel bir loading component göster
    if (isLoading) {
        return (
            <MinglePreLoader />
        );
    }

    return <>{children}</>;
};

export default DataLoader;

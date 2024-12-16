import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getJwtFromCookie } from "../store/helpers/getJwtFromCookie";
import { authApi } from "../store/Slices/auth/authApi";
import { setUser } from "../store/Slices/auth/authSlice";
import MinglePreLoader from "../shared/components/MinglePreLoader/MinglePreLoader";
import { applyTheme } from "../helpers/applyTheme";

const DataLoader = ({ children }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    // State: Loading durumunu kontrol eder
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            const jwt = getJwtFromCookie();

            if (jwt) {
                try {

                    const userProfile = await dispatch(
                        authApi.endpoints.getUserProfile.initiate()
                    ).unwrap();

                    dispatch(
                        setUser({
                            user: userProfile,
                            token: jwt,
                        })
                    );

                    // Kullanıcı teması ayarla
                    const theme = userProfile?.settings?.theme || "DefaultSystemMode";

                    if (theme === "DefaultSystemMode" || theme === "Light") {
                        applyTheme("Light");
                    } else if (theme === "Dark") {
                        applyTheme("Dark");
                    }
                } catch (error) {
                    console.error("Failed to fetch user profile:", error);
                }
            }

            // İşlem tamamlandığında bir timeout ile loading'i kaldır
            setTimeout(() => {
                setIsLoading(false); // 1 saniye gecikmeli olarak içeriği göster
            }, 900);
        };

        initializeAuth();
    }, [dispatch]);

    // Eğer loading devam ediyorsa özel bir loading component göster
    if (isLoading) {
        return <MinglePreLoader />;
    }

    return <>{children}</>;
};

export default DataLoader;

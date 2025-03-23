import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getJwtFromCookie } from "../store/helpers/getJwtFromCookie";
import { authApi } from "../store/Slices/auth/authApi";
import { setUser } from "../store/Slices/auth/authSlice";

import { setUserProfileTheme } from "../helpers/applyTheme";
import { SignalRProvider } from "../contexts/SignalRContext";
import MinglePreLoader from "../shared/components/MinglePreLoader/MinglePreLoader";
import { ErrorAlert } from "../helpers/customAlert";

const DataLoader = ({ children }) => {

    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const updateHeight = () => {
            if (window.innerWidth < 900) {
                document.documentElement.style.setProperty("--app-height", `${window.innerHeight}px`);
            } else {
                document.documentElement.style.setProperty("--app-height", "100vh");
            }
        };

        updateHeight();
        window.addEventListener("resize", updateHeight);

        return () => window.removeEventListener("resize", updateHeight);
    }, []);


    useEffect(() => {
        const initializeAuth = async () => {
            const jwt = getJwtFromCookie();

            if (jwt) {
                try {
                    const userProfile = await dispatch(
                        authApi.endpoints.getUserProfile.initiate()
                    ).unwrap();

                    const updatedUserProfile = setUserProfileTheme(userProfile);

                    dispatch(
                        setUser({
                            user: updatedUserProfile,
                            token: jwt,
                        })
                    );
                } catch (error) {
                    ErrorAlert("Bir hata meydana geldi");
                }
            }

            setTimeout(() => {
                setIsLoading(false);
            }, 900);
        };

        initializeAuth();
    }, [dispatch]);

    if (isLoading) {
        return <MinglePreLoader />;
    }

    return user ? <SignalRProvider>{children}</SignalRProvider> : <>{children}</>;
};

export default DataLoader;

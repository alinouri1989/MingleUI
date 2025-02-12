import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getJwtFromCookie } from "../store/helpers/getJwtFromCookie";
import { authApi } from "../store/Slices/auth/authApi";
import { setUser } from "../store/Slices/auth/authSlice";
import MinglePreLoader from "../shared/components/MinglePreLoader/MinglePreLoader";
import { setUserProfileTheme } from "../helpers/applyTheme";
import { SignalRProvider } from "../contexts/SignalRContext";

const DataLoader = ({ children }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const [isLoading, setIsLoading] = useState(true);

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
                    console.error("Failed to fetch user profile:", error);
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

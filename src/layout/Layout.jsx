import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import Sidebar from "./Sidebar/Sidebar";
import Dashboard from "./Dashboard/Dashboard";
import { useSelector } from "react-redux";
import "./style.scss";

const Layout = () => {
    const { isActiveContent } = useSelector((state) => state.activeContent);
    const [isWideScreen, setIsWideScreen] = useState(window.innerWidth >= 900);

    useEffect(() => {
        const handleResize = () => {
            setIsWideScreen(window.innerWidth >= 900);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="layout-container">
            {/* Ekran 900px altı ve isActiveContent aktifse Header'ı render etme */}
            {isWideScreen || !isActiveContent ? <Header /> : null}

            <div className="main-content">
                <div className="outlet-content">
                    {isWideScreen ? (
                        <>
                            <Dashboard />
                            <Outlet />
                        </>
                    ) : (
                        isActiveContent
                            ? <Outlet />
                            : <Dashboard />
                    )}
                </div>
                <Sidebar />
            </div>
        </div>
    );
};

export default Layout;

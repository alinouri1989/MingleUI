import { Outlet } from "react-router-dom";

import Header from "./Header/Header";
import Sidebar from "./Sidebar/Sidebar";

import Dashboard from "./Dashboard/Dashboard";
import "./style.scss";

const Layout = () => {
    return (
        <div className="layout-container">
            <Header />
            <div className="main-content">
                <Sidebar />
                <div className="outlet-content">
                    <Dashboard />
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;

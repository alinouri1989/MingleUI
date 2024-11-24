import React from "react";
import { useLocation } from "react-router-dom";

import UserImage from "../../assets/users/hamza.png";
import ChatsList from "./components/ChatsList";
import CallsList from "./components/CallsList";
import ArchivesList from "./components/ArchivesList";
import GroupsList from "./components/GroupsList";

import "./style.scss";

function Dashboard() {
    const location = useLocation();

    const renderComponent = () => {
        switch (location.pathname) {
            case "/sohbetler":
                return <ChatsList />;
            case "/anasayfa":
                return <ChatsList />;
            case "/aramalar":
                return <CallsList />;
            case "/arsivler":
                return <ArchivesList />;
            case "/gruplar":
                return <GroupsList />;
            default:
                return <p>Sonuç yok</p>;
        }
    };

    return (
        <div className="dashboard-container">
            <div className="user-info-box">
                <img src={UserImage} alt="Kullanıcı Resmi" />
                <p>Hamza Doğan</p>
            </div>
            <div className="dynamic-list-box">{renderComponent()}</div>
        </div>
    );
}

export default Dashboard;

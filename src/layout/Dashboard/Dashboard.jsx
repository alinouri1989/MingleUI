import React from "react";
import { useLocation } from "react-router-dom";
import UserImage from "../../assets/users/hamza.png";
import ChatsList from "./components/ChatsList";
import CallsList from "./components/CallsList";
import ArchivesList from "./components/ArchivesList";
import GroupsList from "./components/GroupsList";
import { useSelector } from "react-redux";

import "./style.scss";

function Dashboard() {
    const location = useLocation();
    const { user } = useSelector(state => state.auth);

    const renderComponent = () => {
        if (location.pathname.includes("/sohbetler")) {
            return <ChatsList />;
        } else if (location.pathname.includes("/aramalar")) {
            return <CallsList />;
        } else if (location.pathname.includes("/arsivler")) {
            return <ArchivesList />;
        } else if (location.pathname.includes("/gruplar")) {
            return <GroupsList />;
        } else if (location.pathname.includes("/anasayfa")) {
            return <ChatsList />;
        } else {
            return <p>Sonuç yok</p>;
        }
    };

    return (
        <div className="dashboard-container">
            <div className="user-info-box">
                <img src={user.profilePhoto} alt="User" />
                <p>{user.displayName}</p>
            </div>
            <div className="dynamic-list-box">{renderComponent()}</div>
        </div>
    );
}

export default Dashboard;

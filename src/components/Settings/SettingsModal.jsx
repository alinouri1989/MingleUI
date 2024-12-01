import React, { useState } from "react";
import CloseButton from "../../contexts/components/CloseModalButton.jsx";
import { IoMdSettings } from "react-icons/io";
import { FaUserCog } from "react-icons/fa";
import { IoIosHelpCircle } from "react-icons/io";
import { PiPaintBrushFill } from "react-icons/pi";

import Account from "./Components/Account.jsx"
import Theme from "./Components/Theme.jsx"
import Help from "./Components/Help.jsx"


import "./style.scss";

function SettingsModal({ closeModal }) {

  const menuItems = [
    { id: "account", icon: <FaUserCog />, text: "Hesap", component: <Account /> },
    { id: "theme", icon: <PiPaintBrushFill />, text: "Tema", component: <Theme /> },
    { id: "help", icon: <IoIosHelpCircle />, text: "Yardım", component: <Help /> },
  ];

  const [activeMenu, setActiveMenu] = useState("account");

  return (
    <div className="setting-general-box">
      <CloseButton closeModal={closeModal} />
      <div className="title-box">
        <IoMdSettings />
        <p>Ayarlar</p>
      </div>
      <div className="contents-box">
        <div className="sidebar">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`menu-item ${activeMenu === item.id ? "active" : ""}`}
              onClick={() => setActiveMenu(item.id)}
            >
              <div className={`active-item-line ${activeMenu === item.id ? "visible" : ""}`}></div>
              {item.icon}
              <p>{item.text}</p>
            </div>
          ))}
        </div>

        <div className="dynamic-content">
          {menuItems.find((item) => item.id === activeMenu)?.component}
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;

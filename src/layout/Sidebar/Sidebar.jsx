import React, { useState } from "react";
import { HiMenu } from "react-icons/hi";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { PiPhoneFill } from "react-icons/pi";
import { HiArchiveBox } from "react-icons/hi2";
import { HiUserGroup } from "react-icons/hi2";
import { AiFillHome } from "react-icons/ai";
import { IoMdSettings } from "react-icons/io";

import "./style.scss";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar-container ${isOpen ? "open" : ""}`}>
      <div className="top-box">
        <button className="nav-buttons" id="menu-btn" onClick={toggleSidebar}>
          <HiMenu />
        </button>

        <div className="navigation-buttons">
          <button className="nav-buttons">
            <IoChatbubbleEllipses />
            {isOpen && <span>Sohbetler</span>}
          </button>
          <button className="nav-buttons">
            <PiPhoneFill />
            {isOpen && <span>Aramalar</span>}
          </button>
          <button className="nav-buttons">
            <HiArchiveBox />
            {isOpen && <span>Arşivler</span>}
          </button>
          <button className="nav-buttons">
            <HiUserGroup />
            {isOpen && <span>Gruplar</span>}
          </button>
          <button className="nav-buttons">
            <AiFillHome />
            {isOpen && <span>Anasayfa</span>}
          </button>
        </div>
      </div>
      <div className="bottom-box">
        <button className="nav-buttons">
          <IoMdSettings />
          {isOpen && <span>Ayarlar</span>}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;

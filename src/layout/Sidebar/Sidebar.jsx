import React, { useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useModal } from "../../contexts/ModalContext.jsx";
import { HiMenu } from "react-icons/hi";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { PiPhoneFill } from "react-icons/pi";
import { HiArchiveBox } from "react-icons/hi2";
import { HiUserGroup } from "react-icons/hi2";
import { AiFillHome } from "react-icons/ai";
import { IoMdSettings } from "react-icons/io";

import { useOutsideClick } from "../../hooks/useOutsideClick";
import "./style.scss";
import SettingsModal from "../../components/Settings/SettingsModal.jsx";

function Sidebar() {

  const [isOpen, setIsOpen] = useState(false);
  const { showModal, closeModal } = useModal();
  const location = useLocation();
  const navigate = useNavigate();

  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { icon: <IoChatbubbleEllipses className="icon" />, label: "Sohbetler", path: "/sohbetler" },
    { icon: <PiPhoneFill className="icon" />, label: "Aramalar", path: "/aramalar" },
    { icon: <HiArchiveBox className="icon" />, label: "Arşivler", path: "/arsivler" },
    { icon: <HiUserGroup className="icon" />, label: "Gruplar", path: "/gruplar" },
    { icon: <AiFillHome className="icon" />, label: "Anasayfa", path: "/anasayfa" },
  ];


  useOutsideClick(sidebarRef, () => {
    if (isOpen) setIsOpen(false);
  });

  // -------------- Handlers --------------
  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleSettings = () => {
    showModal(<SettingsModal closeModal={closeModal} />)
  }

  return (
    <div ref={sidebarRef} className={`sidebar-container ${isOpen ? "open" : ""}`}>
      <div className="top-box">
        <button
          className={`nav-buttons ${isOpen ? "open" : ""}`}
          id="menu-btn"
          onClick={toggleSidebar}
        >
          <HiMenu className="icon" />
        </button>

        <div className="navigation-buttons">
          {navItems.map((item, index) => (
            <button
              key={index}
              className={`nav-buttons ${isOpen ? "open" : ""} ${location.pathname === item.path ? "active" : ""
                }`}
              onClick={() => handleNavigation(item.path)}
            >
              {item.icon}
              {isOpen && <span>{item.label}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="bottom-box" style={{ width: isOpen ? "100%" : "" }}>
        <button
          className={`nav-buttons ${isOpen ? "open" : ""} ${location.pathname === "/ayarlar" ? "active" : ""
            }`}
          onClick={() => handleSettings()}
        >
          <IoMdSettings className="icon" />
          {isOpen && <span>Ayarlar</span>}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;

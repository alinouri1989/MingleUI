import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSignalR } from "../../contexts/SignalRContext.jsx";
import { motion } from "framer-motion";

import { IoMdSettings } from "react-icons/io";
import { FaUserCog } from "react-icons/fa";
import { PiPaintBrushFill } from "react-icons/pi";
import { MdSecurity } from "react-icons/md";
import { LuLogOut } from "react-icons/lu";
import { RiInformation2Fill } from "react-icons/ri";

import Account from "./Components/Account.jsx"
import Theme from "./Components/Theme.jsx"
import Help from "./Components/Help.jsx"
import Security from "./Components/Security.jsx";

import { useLogoutUserMutation } from "../../store/Slices/auth/authApi.js";
import { ErrorAlert, SuccessAlert } from "../../helpers/customAlert.js";
import { applyTheme } from "../../helpers/applyTheme.js";

import { opacityEffect } from "../../shared/animations/animations.js";
import CloseButton from "../../contexts/components/CloseModalButton.jsx";
import "./style.scss";

function SettingsModal({ closeModal }) {

  const dispatch = useDispatch();
  const { chatConnection, notificationConnection, callConnection } = useSignalR();

  const menuItems = [
    { id: "account", icon: <FaUserCog />, text: "Hesap", component: <Account /> },
    { id: "theme", icon: <PiPaintBrushFill />, text: "Tema", component: <Theme /> },
    { id: "security", icon: <MdSecurity />, text: "Güvenlik", component: <Security /> },
    { id: "help", icon: <RiInformation2Fill />, text: "Yardım", component: <Help /> },
  ];

  const [activeMenu, setActiveMenu] = useState("account");
  const [logoutUser] = useLogoutUserMutation();

  const handleLogout = async () => {
    try {
      await Promise.all([
        chatConnection.stop().catch(() => ErrorAlert("Bir hata meydana geldi")),
        notificationConnection.stop().catch(() => ErrorAlert("Bir hata meydana geldi")),
        callConnection.stop().catch(() => ErrorAlert("Bir hata meydana geldi"))
      ]);

      await logoutUser();
      dispatch({ type: 'RESET_STORE' });
      applyTheme("Light");
      SuccessAlert('Çıkış Yapıldı');
      closeModal();
    } catch {
      ErrorAlert('Çıkış Yapılamıyor');
    }
  };

  return (
    <div className="setting-general-box">
      <CloseButton closeModal={closeModal} />
      <div className="title-box">
        <IoMdSettings />
        <p>Ayarlar</p>
      </div>
      <div className="contents-box">
        <div className="sidebar">
          <div className="menu-list">
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
          <div className="menu-item logout"
            onClick={handleLogout}>
            <LuLogOut className="icon" />
            <p>Çıkış</p>
          </div>
        </div>

        <motion.div
          className="dynamic-content"
          key={activeMenu}
          variants={opacityEffect(0.8)}
          initial="initial"
          animate="animate"
        >
          {menuItems.find((item) => item.id === activeMenu)?.component}
        </motion.div>
      </div>
    </div>
  );
}

export default SettingsModal;

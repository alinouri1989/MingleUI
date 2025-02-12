import React, { useState } from "react";
import CloseButton from "../../contexts/components/CloseModalButton.jsx";
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
import { motion } from "framer-motion";  // motion import ediyoruz

import "./style.scss";
import { authApi, useLogoutUserMutation } from "../../store/Slices/auth/authApi.js";
import { ErrorAlert, SuccessAlert } from "../../helpers/customAlert.js";
import { useDispatch } from "react-redux";
import { userSettingsApi } from "../../store/Slices/userSettings/userSettingsApi.js";
import { opacityEffect } from "../../shared/animations/animations.js";
import { applyTheme } from "../../helpers/applyTheme.js";
import { useSignalR } from "../../contexts/SignalRContext.jsx";



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
      // SignalR bağlantılarını durdur
      await Promise.all([
        chatConnection.stop().catch((err) => console.error("chatConnection durdurulamadı:", err)),
        notificationConnection.stop().catch((err) => console.error("notificationConnection durdurulamadı:", err)),
        callConnection.stop().catch((err) => console.error("callConnection durdurulamadı:", err))
      ]);

      console.log("Tüm SignalR bağlantıları başarıyla durduruldu.");

      // Logout işlemleri
      await logoutUser();
      dispatch({ type: 'RESET_STORE' });
      applyTheme("Light");
      SuccessAlert('Çıkış Yapıldı');
      closeModal();
    } catch (err) {
      console.error("Logout işlemi sırasında hata oluştu:", err);
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
          key={activeMenu} // activeMenu değiştiğinde key'i değiştirecek ve animasyon tetiklenecek
          variants={opacityEffect(0.8)} // opacity animasyonunu buraya ekliyoruz
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

import { useState } from "react";

import { ChatBackgroundColorsThemes } from "../../../constants/ChatBackgroundColors";
import { ErrorAlert, SuccessAlert } from "../../../helpers/customAlert";
import { useDispatch, useSelector } from "react-redux";
import { useChangeChatBackgroundMutation, useChangeThemeMutation } from "../../../store/Slices/userSettings/userSettingsApi";
import PreLoader from "../../../shared/components/PreLoader/PreLoader";
import { applyTheme } from "../../../helpers/applyTheme";

const Theme = () => {

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [changeChatBackground, { isLoading: chatBackgroundLoading }] = useChangeChatBackgroundMutation();
  const [changeTheme, { isLoading: themeLoading }] = useChangeThemeMutation();

  const isLoading = chatBackgroundLoading || themeLoading;


  const handleThemeChange = async (newTheme) => {
    const themeReverseMapping = {
      DefaultSystemMode: 0,
      Light: 1,
      Dark: 2,
    };

    try {
      await changeTheme(themeReverseMapping[newTheme]);
      
      if (newTheme === "DefaultSystemMode" || newTheme === "Light") {
        applyTheme("Light");
      } else if (newTheme === "Dark") {
        applyTheme("Dark");
      }

      SuccessAlert("Tema değiştirildi");
    } catch (error) {
      ErrorAlert("Tema değiştirilemedi");
    }
  };


  const handleSelectedChatBackgroundColor = async (colorId) => {
    try {
      await changeChatBackground(colorId);
      SuccessAlert("Duvar kağıdı değiştirildi");
    } catch (error) {
      ErrorAlert("Duvar kağıdı değiştirilemedi")
    }
  }

  return (
    <div className="theme-box">
      {/* Tema Ayarları */}
      <div className="theme-select">
        <h3>Tema</h3>
        <select
          value={user?.settings?.theme || "DefaultSystemMode"}
          onChange={(e) => handleThemeChange(e.target.value)}
        >
          <option value="DefaultSystemMode">Varsayılan Sistem Modu</option>
          <option value="Light">Açık</option>
          <option value="Dark">Koyu</option>
        </select>
      </div>

      <div className="wallpaper">
        <label>Sohbet Duvar Kağıdı</label>
        <div className="grid">
          {ChatBackgroundColorsThemes.map((gradient) => (
            <div
              key={gradient.id}
              className={`gradient-box ${user?.settings?.chatBackground === gradient.id ? "selected" : ""
                }`}
              onClick={() => handleSelectedChatBackgroundColor(gradient.id)}
              style={{
                background: gradient.backgroundImage,
              }}
            ></div>
          ))}
        </div>
      </div>
      {isLoading && <PreLoader />}
    </div>
  );
};

export default Theme;

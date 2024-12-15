import { useState } from "react";

import { ChatBackgroundColorsThemes } from "../../../constants/ChatBackgroundColors";
import { ErrorAlert, SuccessAlert } from "../../../helpers/customAlert";
import { useDispatch, useSelector } from "react-redux";
import { useChangeChatBackgroundMutation } from "../../../store/Slices/userSettings/userSettingsApi";
import PreLoader from "../../../shared/components/PreLoader/PreLoader";


const Theme = () => {

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [themeMode, setThemeMode] = useState();
  const [changeChatBackground, { isLoading }] = useChangeChatBackgroundMutation();


  const handleThemeChange = (newTheme) => {
    try {


    } catch (error) {

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
          value={themeMode}
          onChange={(e) => handleThemeChange(e.target.value)}
        >
          <option value="Dark">Koyu</option>
          <option value="Light">Açık</option>
          <option value="DefaultSystemMode">Varsayılan Sistem Modu</option>
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

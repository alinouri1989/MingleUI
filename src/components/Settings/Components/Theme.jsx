import { useState } from "react";

import { ChatBackgroundColorsThemes } from "../../../constants/ChatBackgroundColors";
import { SuccessAlert } from "../../../helpers/customAlert";

const Theme = () => {


  const [themeMode, setThemeMode] = useState("Light"); // Backend'den gelen başlangıç teması
  const [selectedColorId, setSelectedColorId] = useState("color1");

  //!Example for Redux and Database Integration 
  // const themeMode = useSelector((state) => state.theme.mode); // Redux'tan tema bilgisi al
  // const dispatch = useDispatch();


  const handleThemeChange = (newTheme) => {
    try {
      setThemeMode(newTheme);
      // Burada veritabanına kayıt işlemi yapılabilir dispatch ile redux metodu çağırarak
      
    } catch (error) {
      
    }
  };

  const handleSelectedChatBackgroundColor = (colorId) => {
    setSelectedColorId(colorId);
    try {
      SuccessAlert("Duvar kağıdı değiştirildi");
    
    } catch (error) {
      
    }
    //! Dispatch ile veritabanına ve redux üzerinde kayıt işlemi yapılacak ve sohbet üzerinde o redux'a göre arka plan değişir.
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
              className={`gradient-box ${selectedColorId === gradient.id ? "selected" : ""
                }`}
              onClick={() => handleSelectedChatBackgroundColor(gradient.id)}
              style={{
                background: gradient.backgroundImage,
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Theme;

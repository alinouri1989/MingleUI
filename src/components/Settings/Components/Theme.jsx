import { useState } from "react";

import { ChatBackgroundColorsThemes } from "../../../constants/ChatBackgroundColors";
import { SuccessAlert } from "../../../helpers/customAlert";
import { setChatBackgroundColor } from "../../../store/Slices/ChatBackgroundColor";
import { useDispatch, useSelector } from "react-redux";


const Theme = () => {

  const dispatch = useDispatch();
  const [themeMode, setThemeMode] = useState("Light"); // Backend'den gelen başlangıç teması
  const { colorId } = useSelector((state) => state.chatBackgroundColor);
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
    dispatch(setChatBackgroundColor({ colorId }));
    try {
      SuccessAlert("Duvar kağıdı değiştirildi");

    } catch (error) {

    }
  }


  //   useEffect(() => {
  //     // Backend'den varsayılan `colorId` al
  //     axios.get('http://localhost:5000/api/default-chat-background').then((response) => {
  //         const colorId = response.data.colorId;
  //         const matchedColor = ChatBackgroundColors.find((color) => color.id === colorId);
  //         dispatch(chatBackgroundColorActions.setInitialState({
  //             colorId,
  //             backgroundImage: matchedColor ? matchedColor.backgroundImage : '',
  //         }));
  //     });
  // }, []);
  // Data Loader Kısmı için aktarılabilir.


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
              className={`gradient-box ${colorId === gradient.id ? "selected" : ""
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

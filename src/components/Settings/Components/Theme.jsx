import { useState } from "react";

const Theme = () => {
  const gradients = [
    { colorId: "color1", colorCode: "white" },
    { colorId: "color2", colorCode: "linear-gradient(to right, #ff7eb3, #ff758c)" },
    { colorId: "color3", colorCode: "linear-gradient(to right, #8e9eab, #eef2f3)" },
    { colorId: "color4", colorCode: "linear-gradient(to right, #00c6ff, #0072ff)" },
    { colorId: "color5", colorCode: "linear-gradient(to right, #f6d365, #fda085)" },
    { colorId: "color6", colorCode: "linear-gradient(to right, #84fab0, #8fd3f4)" },
    { colorId: "color7", colorCode: "linear-gradient(to right, #a1c4fd, #c2e9fb)" },
    { colorId: "color8", colorCode: "linear-gradient(to right, #ff9a9e, #fad0c4)" },
  ];

  const [themeMode, setThemeMode] = useState("Light"); // Backend'den gelen başlangıç teması
  const [selectedColorId, setSelectedColorId] = useState("color1");

  //!Example for Redux and Database Integration 
  // const themeMode = useSelector((state) => state.theme.mode); // Redux'tan tema bilgisi al
  // const dispatch = useDispatch();


  const handleThemeChange = (newTheme) => {
    setThemeMode(newTheme);
    // Burada veritabanına kayıt işlemi yapılabilir dispatch ile redux metodu çağırarak
  };
  const handleSelectedChatBackgroundColor = (colorId) => {
    setSelectedColorId(colorId);
    //! Dispatch ile veritabanına ve redux üzerinde kayıt işlemi yapılacak ve sohbet üzerinde o redux'a göre arka plan değişir.
  }


  return (
    <div className="theme-box">
      {/* Tema Ayarları */}
      <div className="theme-select">
        <label>Tema</label>
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
          {gradients.map((gradient) => (
            <div
              key={gradient.colorId}
              className={`gradient-box ${selectedColorId === gradient.colorId ? "selected" : ""
                }`}
              onClick={() => handleSelectedChatBackgroundColor(gradient.colorId)}
              style={{
                background: gradient.colorCode,
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Theme;

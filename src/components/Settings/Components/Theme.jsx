import { ChatBackgroundColorsThemes } from "../../../constants/ChatBackgroundColors";
import { ErrorAlert, SuccessAlert } from "../../../helpers/customAlert";
import { useSelector } from "react-redux";
import { useChangeChatBackgroundMutation, useChangeThemeMutation } from "../../../store/Slices/userSettings/userSettingsApi";
import PreLoader from "../../../shared/components/PreLoader/PreLoader";
import { applyTheme } from "../../../helpers/applyTheme";

const Theme = () => {

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

      if (newTheme === "Dark") {
        await changeChatBackground("color9");
      }

      if (newTheme === "Light" || newTheme === "DefaultSystemMode") {
        await changeChatBackground("color1");
      }

      if (newTheme === "DefaultSystemMode" || newTheme === "Light") {
        applyTheme("Light");
      } else if (newTheme === "Dark") {
        applyTheme("Dark");
      }

      SuccessAlert("Tema değiştirildi");
    } catch {
      ErrorAlert("Tema değiştirilemedi");
    }
  };

  const handleSelectedChatBackgroundColor = async (colorId) => {
    try {
      if (user.userSettings.chatBackground === colorId) {
        return;
      }
      await changeChatBackground(colorId);
      SuccessAlert("Duvar kağıdı değiştirildi");
    } catch {
      ErrorAlert("Duvar kağıdı değiştirilemedi")
    }
  };

  const handleKeyDown = (event, colorId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSelectedChatBackgroundColor(colorId);
    }
  };

  return (
    <div className="theme-box">
      <div className="theme-select">
        <h3>Tema</h3>
        <select
          value={user?.userSettings?.theme || "DefaultSystemMode"}
          onChange={(e) => handleThemeChange(e.target.value)}
        >
          <option value="DefaultSystemMode">Varsayılan Sistem Modu</option>
          <option value="Light">Açık</option>
          <option value="Dark">Koyu</option>
        </select>
      </div>

      <div className="wallpaper">
        <h4>Sohbet Duvar Kağıdı</h4>
        <div className="grid">
          {user?.userSettings?.theme === "Dark" ? (
            <div
              className="gradient-box selected"
              style={{ backgroundColor: "#161616" }}
            ></div>
          ) : (
            ChatBackgroundColorsThemes.map((gradient) => (
              <div
                key={gradient.id}
                role="button"
                tabIndex={0}
                className={`gradient-box ${user?.userSettings?.chatBackground === gradient.id ? "selected" : ""}`}
                onClick={() => handleSelectedChatBackgroundColor(gradient.id)}
                onKeyDown={(event) => handleKeyDown(event, gradient.id)}
                style={{
                  background: gradient.backgroundImage,
                }}
              ></div>
            ))
          )}
        </div>
      </div>

      {isLoading && <PreLoader />}
    </div>
  );
};

export default Theme;
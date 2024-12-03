import { useState } from "react";
import { TbEdit } from "react-icons/tb";
import { FaCheck } from "react-icons/fa";
import userImage from "../../../assets/users/hamza.png";
import ChangePassword from "./ChangePassword";
import { ErrorAlert, SuccessAlert } from "../../../helpers/customAlert";

function Account() {

  const email = "hamzadogan20@gmail.com"
  const [username, setUserName] = useState("Hamza Doğan");
  const [phone, setPhoneName] = useState("0546 893 44 13");
  const [biography, setBiography] = useState("Merhaba, Ben Mingle kullanıyorum!");


  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingBiography, setIsEditingBiography] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);


  const handleUsernameChange = () => {
    setIsEditingUsername(!isEditingUsername);
  };

  const handlePhoneChange = () => {
    setIsEditingPhone(!isEditingPhone);
  };

  const handleBiographyChange = () => {
    setIsEditingBiography(!isEditingBiography);
  };

  const handleChangePassword = () => {
    setIsEditingPassword(!isEditingPassword)
  }
  const handleLogout = () => {
   SuccessAlert("İşlem Başarılı");
  }

  return (
    <div className="account-box">
      {isEditingPassword ?
        <ChangePassword handleChangePassword={handleChangePassword} /> :
        <>
          <h3>Hesap</h3>
          <div className="image-box">
            <img src={userImage} alt="User Profile Image" />
            <button className="edit-btn">
              <TbEdit />
            </button>
          </div>
          <div className="name-box">
            {isEditingUsername ? (
              <input
                onChange={(e) => setUserName(e.target.value)}
                value={username}
                type="text"
                placeholder="Ad soyad giriniz..."
                autoFocus
              />
            ) : (
              <p>{username}</p>
            )}
            <button className="edit-btn" onClick={handleUsernameChange}>
              {isEditingUsername ? <FaCheck /> : <TbEdit />}
            </button>
          </div>

          <div className="email-and-phone-box">
            <div className="email-box">
              <p>Email</p>
              <span>{email}</span>
            </div>
            <div className="phone-box">
              <p>Telefon</p>
              <div className="phone-edit-box">
                {isEditingPhone ? (
                  <input
                    onChange={(e) => setPhoneName(e.target.value)}
                    value={phone}
                    type="text"
                    placeholder="Telefon numarası giriniz..."
                    autoFocus
                  />
                ) : (
                  <p>{phone}</p>
                )}
                <button className="edit-btn" onClick={handlePhoneChange}>
                  {isEditingPhone ? <FaCheck /> : <TbEdit />}
                </button>
              </div>
            </div>
            <div className="biography-box">
              <div className="biograpy-edit-box">
                <p>Biyografi</p>
                <button className="edit-btn" onClick={handleBiographyChange}>
                  {isEditingBiography ? <FaCheck /> : <TbEdit />}
                </button>
              </div>

              {!isEditingBiography &&
                <span className="biography-span">{biography}</span>
              }

              {isEditingBiography && (
                <textarea
                  onChange={(e) => setBiography(e.target.value)}
                  value={biography}
                  type="text"
                  placeholder="Biyografi giriniz..."
                  autoFocus
                />
              )}
            </div>
          </div>
          <div className="option-buttons">
            <button onClick={handleChangePassword}>Şifre Değiştir</button>
            <button onClick={() => handleLogout()}>Çıkış Yap</button>
          </div>
        </>
      }
    </div>
  );
}

export default Account;

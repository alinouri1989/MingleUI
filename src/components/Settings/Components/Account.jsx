import { useState } from "react";
import { TbEdit } from "react-icons/tb";
import { FaCheck } from "react-icons/fa";
import { MdClose } from 'react-icons/md';
import userImage from "../../../assets/users/hamza.png";
import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded';
import ImageSearchRoundedIcon from '@mui/icons-material/ImageSearchRounded';
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useSelector } from "react-redux";

function Account() {

  const { user } = useSelector(state => state.auth);

  const email = "hamzadogan20@gmail.com"
  const [username, setUserName] = useState("Hamza Doğan");
  const [phone, setPhoneName] = useState("0546 893 44 13");
  const [biography, setBiography] = useState("Merhaba, Ben Mingle kullanıyorum!");

  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingBiography, setIsEditingBiography] = useState(false);

  const [isShowProfileImage, setIsShowProfileImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);


  // User Image Edit States
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  //! User Informations Edit Handlers

  const handleUsernameChange = () => {
    setIsEditingUsername(!isEditingUsername);
  };

  const handlePhoneChange = () => {
    setIsEditingPhone(!isEditingPhone);
  };

  const handleBiographyChange = () => {
    setIsEditingBiography(!isEditingBiography);
  };

  //! User Profile Image Menu Item Handlers

  const handleChangeProfileImage = () => {
    handleClose();
    document.getElementById("image-upload-input").click();
  };

  const handleShowProfileImage = () => {
    handleClose();
    setIsShowProfileImage(true);
  };

  const handleDeleteProfileImage = () => {
    handleClose();
    setSelectedImage(null);
  };

  // Resim seçme işlemi
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="account-box">
      <h3>Hesap</h3>
      <div className="image-box">
        <img
          className="profile-image"
          src={selectedImage || userImage}
          alt="User Profile Image"
        />
        <IconButton
          className={"edit-btn"}
          aria-label="more"
          id="long-button"
          aria-controls={open ? "long-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <TbEdit />
        </IconButton>
        <Menu
          className="menu-box"
          id="long-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "long-button",
          }}
          slotProps={{
            paper: {
              style: {
                maxHeight: 48 * 3,
                width: "18ch",
                borderRadius: "8px",
                border: "4px solid #CFD5F2",
                fontWeight: "bold",
                boxShadow: "none",
                marginLeft: "36px",
                marginTop: "-27px"
              },
            },
          }}
        >

          <MenuItem
            onClick={handleShowProfileImage}
            sx={{ color: "#585CE1" }}
          >

            <ListItemIcon sx={{ color: "inherit" }}>
              <ImageSearchRoundedIcon />
            </ListItemIcon>
            <ListItemText
              primary="Görüntüle"
              primaryTypographyProps={{
                fontFamily: "Montserrat",
                fontWeight: "700",
                fontSize: "14px",
              }}
            />
          </MenuItem>

          <MenuItem
            onClick={handleChangeProfileImage}
            sx={{ color: "#585CE1" }}
          >
            <ListItemIcon fontSize={"small"} sx={{ color: "inherit" }}>
              <AddPhotoAlternateRoundedIcon />
            </ListItemIcon>
            <ListItemText
              primary="Değiştir"
              primaryTypographyProps={{
                fontFamily: "Montserrat",
                fontWeight: "700",
                fontSize: "14px",
              }}
            />
          </MenuItem>

          <MenuItem
            onClick={handleDeleteProfileImage}
            sx={{ color: "#EB6262" }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <DeleteOutlineRoundedIcon />
            </ListItemIcon>
            <ListItemText
              primary="Kaldır"
              primaryTypographyProps={{
                fontFamily: "Montserrat",
                fontWeight: "700",
                fontSize: "14px",
              }}
            />
          </MenuItem>
        </Menu>
        {isShowProfileImage &&
          <div className="full-size-profil-image-box">
            <img src={selectedImage || userImage} alt="UserImage" />
            <button onClick={() => setIsShowProfileImage(false)}>
              <MdClose />
            </button>
          </div>
        }
        <input
          id="image-upload-input"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageUpload}
        />
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
          <span>{user.email}</span>
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
    </div >
  );
}

export default Account;

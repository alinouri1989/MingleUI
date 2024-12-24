import { useState } from "react";
import { TbEdit } from "react-icons/tb";
import { FaCheck } from "react-icons/fa";
import { MdClose } from 'react-icons/md';
import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded';
import ImageSearchRoundedIcon from '@mui/icons-material/ImageSearchRounded';
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useSelector } from "react-redux";
import { ErrorAlert, SuccessAlert } from "../../../helpers/customAlert";
import { useUpdateDisplayNameMutation, useUpdatePhoneNumberMutation, useUpdateBiographyMutation, useRemoveProfilePhotoMutation, useUpdateProfilePhotoMutation } from "../../../store/Slices/userSettings/userSettingsApi";
import PreLoader from "../../../shared/components/PreLoader/PreLoader";
import { defaultProfilePhoto } from "../../../constants/DefaultProfilePhoto";

function Account() {

  const { user } = useSelector(state => state.auth);

  const [username, setUserName] = useState(user?.displayName || "");
  const [phone, setPhoneName] = useState(user?.phoneNumber || "Belirtilmedi");
  const [biography, setBiography] = useState(user?.biography || "");
  const [selectedImage, setSelectedImage] = useState(user?.profilePhoto || "");

  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingBiography, setIsEditingBiography] = useState(false);

  const [isShowProfileImage, setIsShowProfileImage] = useState(false);


  const [updateDisplayName, { isLoading: isLoadingDisplayName }] = useUpdateDisplayNameMutation();
  const [updateBiography, { isLoading: isLoadingBiography }] = useUpdateBiographyMutation();
  const [updatePhoneNumber, { isLoading: isLoadingPhoneNumber }] = useUpdatePhoneNumberMutation();
  const [updateProfilePhoto, { isLoading: isLoadingProfilePhoto }] = useUpdateProfilePhotoMutation();
  const [removeProfilePhoto, { isLoading: isLoadingRemovePhoto }] = useRemoveProfilePhotoMutation();

  const isLoading =
    isLoadingDisplayName ||
    isLoadingBiography ||
    isLoadingPhoneNumber ||
    isLoadingProfilePhoto ||
    isLoadingRemovePhoto;

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

  const handleUsernameChange = async () => {
    setIsEditingUsername(!isEditingUsername);

    if (user.displayName != username) {
      try {
        await updateDisplayName(username);
        SuccessAlert("Ad Soyad Değiştirildi")
      } catch (error) {
        ErrorAlert("İsim Değiştirilemedi");
      }
    }
  };

  const handlePhoneChange = async () => {
    setIsEditingPhone(!isEditingPhone);

    if (user.phoneNumber != phone) {
      try {
        await updatePhoneNumber(phone);
        SuccessAlert("Telefon Numarası Güncellendi")
      } catch (error) {
        ErrorAlert("Güncelleme Başarısız");
      }
    }
  };

  const handleBiographyChange = async () => {
    setIsEditingBiography(!isEditingBiography);

    if (user.biography != biography) {
      try {
        await updateBiography(biography);
        SuccessAlert("Biyografi Güncellendi")
      } catch (error) {
        ErrorAlert("Biyografi Güncellenemedi");
      }
    }
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

  const handleDeleteProfileImage = async () => {
    handleClose();
    try {
      await removeProfilePhoto();
      SuccessAlert("Fotoğraf Kaldırıldı")
      setSelectedImage(defaultProfilePhoto)
    } catch {
      ErrorAlert("Kaldırılamadı")
    }
  };

  // Resim seçme işlemi
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }

    try {
      await updateProfilePhoto(file)
      SuccessAlert("Fotoğraf Güncellendi")
    } catch (error) {
      ErrorAlert("Fotoğraf Güncellenemedi")
    }
  };

  return (
    <div className="account-box">
      <h3>Hesap</h3>
      <div className="image-box">
        <img
          className="profile-image"
          src={user?.profilePhoto || ""}
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

          {selectedImage !== defaultProfilePhoto &&
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
          }
        </Menu>
        {isShowProfileImage &&
          <div className="full-size-profil-image-box">
            <img src={user.profilePhoto} alt="UserImage" />
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
          <span>{user?.email}</span>
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
      {isLoading && <PreLoader />}
    </div >
  );
}

export default Account;

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
import { convertFileToBase64 } from "../../../store/helpers/convertFileToBase64";
import { convertFileToByteArray } from "../../../store/helpers/convertFileToByteArray";


import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { biographySchema, displayNameSchema, phoneNumberSchema } from "../../../schemas/AccountSchemas";

function Account() {

  const { user } = useSelector(state => state.auth);
  const isDarkMode = user?.userSettings?.theme == "Dark";

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

  const { register: registerDisplayName, handleSubmit: handleDisplayNameSubmit, formState: { errors: displayNameErrors } } = useForm({
    resolver: zodResolver(displayNameSchema),
    defaultValues: { displayName: user?.displayName },
  });

  const { register: registerPhone, handleSubmit: handlePhoneSubmit, formState: { errors: phoneNumberErrors } } = useForm({
    resolver: zodResolver(phoneNumberSchema),
    defaultValues: { phoneNumber: user?.phoneNumber || "Belirtilmedi" },
  });

  const { register: registerBio, handleSubmit: handleBioSubmit, formState: { errors: bioErrors } } = useForm({
    resolver: zodResolver(biographySchema),
    defaultValues: { bio: user?.biography || "" },
  });


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

  const onSubmitForDisplayName = async (data) => {
    setIsEditingUsername(!isEditingUsername);  // Toggle out of edit mode

    if (user.displayName !== data.displayName) {
      try {
        await updateDisplayName(data.displayName);  // Use data from form submission
        SuccessAlert("Ad Soyad Değiştirildi");
      } catch (error) {
        ErrorAlert("İsim Değiştirilemedi");
      }
    }
    else { }
  };

  const onSubmitForPhoneNumber = async (data) => {
    setIsEditingPhone(!isEditingPhone);

    if (user.phoneNumber != data.phoneNumber) {
      try {
        await updatePhoneNumber(data.phoneNumber);
        SuccessAlert("Telefon Numarası Güncellendi")
      } catch (error) {
        ErrorAlert("Telefon Numarası Güncellenemedi");
      }
    }
  };

  const onSubmitForBio = async (data) => {
    setIsEditingBiography(!isEditingBiography);

    if (user.biography != data.bio) {
      try {
        await updateBiography(data.bio);
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

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validExtensions = ["image/png", "image/jpeg", "image/jpg"];

    if (!validExtensions.includes(file.type)) {
      return ErrorAlert("Bir resim dosyası seçiniz");
    }

    try {
      const base64String = await convertFileToBase64(file);
      await updateProfilePhoto(base64String);
      SuccessAlert("Fotoğraf Güncellendi");
    } catch (error) {
      ErrorAlert("Fotoğraf Güncellenemedi");
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
                maxHeight: "auto",
                width: "18ch",
                borderRadius: "8px",
                border: `4px solid ${isDarkMode ? "#222430" : "#CFD5F2"}`,
                fontWeight: "bold",
                backgroundColor: isDarkMode ? "#18191A" : "#FFFFFF",
                color: isDarkMode ? "#E4E6EB" : "#000000",
                boxShadow: "none",
                marginLeft: "36px",
                marginTop: "-27px",
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

      <form onSubmit={handleDisplayNameSubmit(onSubmitForDisplayName)}>
        <div className="name-box">
          {isEditingUsername ? (
            <input
              {...registerDisplayName("displayName")}
              type="text"
              placeholder="Ad soyad giriniz..."
              autoFocus
            />
          ) : (
            <p>{user.displayName}</p>
          )}

          {/* Düzenleme Butonu (Sadece Toggle İşlemi Yapacak) */}
          {!isEditingUsername && (
            <button
              className="edit-btn"
              type="button"
              onClick={() => setIsEditingUsername(true)}
            >
              <TbEdit />
            </button>
          )}

          {/* Kaydet Butonu (Formu Gönderecek) */}
          {isEditingUsername && (
            <button className="edit-btn" type="submit">
              <FaCheck />
            </button>
          )}
        </div>
      </form>

      {displayNameErrors.displayName && (
        <span className="error-messages">{displayNameErrors.displayName.message}</span>
      )}

      <form>
        <div className="email-and-phone-box">
          {/* E-posta */}
          <div className="email-box">
            <p>Email</p>
            <span>{user?.email}</span>
          </div>

          {/* Telefon Numarası */}
          <div className="phone-box">
            <p>Telefon</p>
            <div className="phone-edit-box">
              {isEditingPhone ? (
                <input
                  {...registerPhone("phoneNumber")}
                  type="text"
                  placeholder="Telefon numarası giriniz..."
                  autoFocus
                />
              ) : (
                <p>{user?.phoneNumber || "Belirtilmedi"}</p>
              )}

              {/* Düzenleme Butonu */}
              {!isEditingPhone && (
                <button
                  className="edit-btn"
                  type="button"
                  onClick={() => setIsEditingPhone(true)}
                >
                  <TbEdit />
                </button>
              )}

              {/* Kaydetme Butonu */}
              {isEditingPhone && (
                <button
                  className="edit-btn"
                  type="submit"
                  onClick={handlePhoneSubmit(onSubmitForPhoneNumber)}
                >
                  <FaCheck />
                </button>
              )}
            </div>
            {phoneNumberErrors.phoneNumber && (
              <span className="error-messages">{phoneNumberErrors.phoneNumber.message}</span>
            )}
          </div>

          {/* Biyografi */}
          <div className="biography-box">
            <div className="biograpy-edit-box">
              <p>Biyografi</p>

              {/* Düzenleme Butonu */}
              {!isEditingBiography && (
                <button
                  className="edit-btn"
                  type="button"
                  onClick={() => setIsEditingBiography(true)}
                >
                  <TbEdit />
                </button>
              )}

              {/* Kaydetme Butonu */}
              {isEditingBiography && (
                <button
                  className="edit-btn"
                  type="submit"
                  onClick={handleBioSubmit(onSubmitForBio)}
                >
                  <FaCheck />
                </button>
              )}
            </div>

            {/* Metin veya Düzenleme Alanı */}
            {!isEditingBiography ? (
              <span className="biography-span">{user?.biography}</span>
            ) : (
              <textarea
                {...registerBio("bio")}
                type="text"
                placeholder="Biyografi giriniz..."
                autoFocus
              />
            )}

          </div>
          {bioErrors.bio && (
            <span className="error-messages">{bioErrors.bio.message}</span>
          )}
        </div>
      </form>

      {isLoading && <PreLoader />}
    </div >
  );
}

export default Account;

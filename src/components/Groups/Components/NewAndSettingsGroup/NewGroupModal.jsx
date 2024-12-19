import { useState, useEffect } from "react";
import { useModal } from "../../../../contexts/ModalContext.jsx";

import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded';
import ImageSearchRoundedIcon from '@mui/icons-material/ImageSearchRounded';
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import { MdPersonRemoveAlt1 } from "react-icons/md";
import { HiUserAdd } from "react-icons/hi"
import { MdClose } from 'react-icons/md';
import { TbEdit } from "react-icons/tb";
import { IoMdSettings } from "react-icons/io";

import star from "../../../../assets/svg/star.svg";
import adminPP from "../../../../assets/users/Deneme12.png";
import { defaultGroupPhoto } from "../../../../constants/DefaultProfilePhoto.js";
import AddUser from "../AddUser.jsx";
import CloseModalButton from "../../../../contexts/components/CloseModalButton.jsx";
import { useDispatch } from "react-redux";

import { ErrorAlert, SuccessAlert } from "../../../../helpers/customAlert.js";

import "./style.scss";
import { useCreateGroupMutation } from "../../../../store/Slices/Group/GroupApi.js";
import PreLoader from "../../../../shared/components/PreLoader/PreLoader.jsx";

function NewGroupModal({ closeModal, isGroupSettings }) {

    const dispatch = useDispatch();
    const [createGroup, { isLoading }] = useCreateGroupMutation();

    const [isAddUserModal, setAddUserModal] = useState(false);

    // User Image Edit States
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const [isShowProfileImage, setIsShowProfileImage] = useState(false);
    const [isSaveDisabled, setSaveDisabled] = useState(true);

    // Mock Variables
    const adminName = "Hamza Doğan";
    const adminRole = "Yönetici";
    const isAdmin = true;
    const exitsGroupImage = "https://images.unsplash.com/photo-1733035997778-65e038269fb8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2Nnx8fGVufDB8fHx8fA%3D%3D";
    const exitsGroupName = "Yardımlaşma Grubu";
    const exitsGroupDescription = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores id vitae corporis ex, atque animi distinctio minima commodi explicabo qui?";
    const groupImageDefault = defaultGroupPhoto;

    const mockParticipants = {
        "AjV1coDxdaafW5LSbKFpOfgAF9g1": {
            DisplayName: "Nazmi Koçak",
            Role: 0,
            ProfilePhoto: "https://media.licdn.com/dms/image/v2/D4D03AQFKMmOugHW2hA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1697381628491?e=1739404800&v=beta&t=c3VsHUs3G4KRD-cxHyvgqF7_ougt0B4KMesw06NUeVk"
        },
        "VtDDjqykOzXOSpETtOutQfsSrVo2": {
            DisplayName: "Ferhan HACISALİHOĞLU",
            Role: 1,
            ProfilePhoto: "https://res.cloudinary.com/mingle-realtime-messaging-app/image/upload/v1734185072/DefaultUserProfilePhoto.png"
        },
        "zzQ9tf3j2fc0mvx8obyNshSjY9s1": {
            DisplayName: "Hamza DOĞAN",
            Role: 1,
            ProfilePhoto: "https://res.cloudinary.com/mingle-realtime-messaging-app/image/upload/v1734185072/DefaultUserProfilePhoto.png"
        }
    };

    const initialData = {
        name: isGroupSettings ? exitsGroupName : "",
        description: isGroupSettings ? exitsGroupDescription : "",
        photo: isGroupSettings ? exitsGroupImage : null,
        participants: isGroupSettings ? mockParticipants : null
    };

    const [formData, setFormData] = useState(initialData);


    const getPhotoURL = (photo) => {
        if (photo instanceof File) {
            return URL.createObjectURL(photo);
        }

        return photo || groupImageDefault;
    };

    // Temizlik için useEffect
    useEffect(() => {
        if (formData.photo instanceof File) {
            const objectURL = URL.createObjectURL(formData.photo);
            return () => URL.revokeObjectURL(objectURL);
        }
    }, [formData.photo]);

    useEffect(() => {
        const isSameData = JSON.stringify(formData) === JSON.stringify(initialData);
        setSaveDisabled(isSameData);
    }, [formData]);

    // Handlers for input changes
    const handleGroupNameChange = (e) => setFormData((prev) => ({ ...prev, name: e.target.value }));

    const handleGroupDescriptionChange = (e) => setFormData((prev) => ({ ...prev, description: e.target.value }));

    const handleGroupImageEdit = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, photo: file }));
        }
    };

    // ==== Edit Methods ====

    const handleChangeGroupImage = () => {
        handleClose();
        document.getElementById("image-upload-input").click();
    };

    const handleShowGroupImage = () => {
        handleClose();
        setIsShowProfileImage(true);
    };

    const handleDeleteGroupImage = () => {
        handleClose();
        setFormData((prev) => ({ ...prev, photo: null }));
    };

    // Create

    const handleRemoveUser = (userId) => {
        // formData'daki participants nesnesinin anahtarlarını alıyoruz
        const participantKeys = Object.keys(formData.participants);

        // userId'ye sahip kullanıcıyı buluyoruz
        const userToRemove = participantKeys.find((key) => key === userId);

        if (userToRemove) {
            // formData'dan bu kullanıcıyı çıkarıyoruz
            const updatedParticipants = { ...formData.participants };
            delete updatedParticipants[userToRemove];

            // State'i güncelliyoruz
            setFormData((prevFormData) => ({
                ...prevFormData,
                participants: updatedParticipants
            }));

            const removedUserName = formData.participants[userToRemove].DisplayName;
            SuccessAlert(`${removedUserName} gruptan çıkarıldı.`,1500);
        }
    };

    const handleRoleChange = (userId, newRole) => {
        const updatedParticipants = { ...formData.participants };

        // Kullanıcının rolünü güncelliyoruz
        if (updatedParticipants[userId]) {
            updatedParticipants[userId].Role = Number(newRole);
        }

        setFormData((prevFormData) => ({
            ...prevFormData,
            participants: updatedParticipants
        }));

        SuccessAlert(`Rol Değiştirildi`);
    };

    // Create New Group Logis is here.
    const handleSubmit = async () => {
        try {
            const response = await createGroup(formData);
            
            if (response?.error) {
                const errorMessage = response.error?.data?.message || "Bir hata oluştu, lütfen tekrar deneyin.";
                ErrorAlert(errorMessage);
                return; // Hata durumunda işlemi sonlandır
            }
    
            // Eğer hata yoksa başarı mesajını göster
            SuccessAlert("Grup Oluşturuldu");
            closeModal();
        } catch (error) {
            // Backend'den hata dönerse buraya düşer
            const errorMessage = error?.data?.message || "Bir hata oluştu, lütfen tekrar deneyin.";
            ErrorAlert(errorMessage);
        }
    };

    //For Settings
    const handleSaveChanges = () => {
        console.log("Saved Data: ", formData);
    };

    return (
        <div className="new-group-modal">
            <CloseModalButton closeModal={closeModal} />
            <div className="title-box">
                {isGroupSettings ? (
                    <>
                        <IoMdSettings className="setting-icon" />
                        <p>Grup Ayarları</p>
                    </>
                ) : (
                    <>
                        <img src={star} alt="" />
                        <p>Yeni bir grup oluştur</p>
                    </>
                )}
            </div>
            <div className="contents">
                <div className="choose-group-image">
                    <p>Grup Resmi</p>
                    <div className="group-image-box">
                        <img src={getPhotoURL(formData.photo)} alt="Group" />
                        <label className="edit-image-btn">
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
                                    onClick={handleShowGroupImage}
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
                                    onClick={handleChangeGroupImage}
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
                                    onClick={handleDeleteGroupImage}
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
                            <input
                                id="image-upload-input"
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handleGroupImageEdit}
                            />
                        </label>
                        {isShowProfileImage &&
                            <div className="full-size-group-image-box">
                                <img src={getPhotoURL(formData.photo)} alt="Group" />
                                <button onClick={() => setIsShowProfileImage(false)}>
                                    <MdClose />
                                </button>
                            </div>
                        }
                    </div>
                </div>
                <div className="input-boxs">
                    <div className="input-box">
                        <p>Grup Adı</p>
                        <input
                            type="text"
                            placeholder="Bir grup adı belirle..."
                            value={formData.name}
                            onChange={handleGroupNameChange}
                        />
                    </div>
                    <div className="input-box">
                        <p>Grup Açıklaması</p>
                        <input
                            type="text"
                            placeholder="Grup açıklaması belirle..."
                            value={formData.description}
                            onChange={handleGroupDescriptionChange}
                        />
                    </div>
                </div>

                <div className="group-members-box">
                    <h2>Grup Üyeleri</h2>

                    <div className="group-admin">
                        <img src={adminPP} alt="Admin Profile Image" />
                        <div className="admin-info">
                            <p>{adminName}</p>
                            <span>{adminRole}</span>
                        </div>
                    </div>

                    <div className="other-users">
                        {formData.participants && Object.keys(formData.participants).map((userId) => {
                            const user = formData.participants[userId];  // Mock verisinden kullanıcı bilgisi
                            return (
                                <div className="user-box" key={userId}>
                                    <div className="user-info">
                                        <img src={user.ProfilePhoto} alt={user.DisplayName} />
                                        <div className="username-and-role-box">
                                            <p>{user.DisplayName}</p>
                                            <select
                                                defaultValue={user.Role} // "Admin" -> 0, "Member" -> 1
                                                onChange={(e) =>
                                                    handleRoleChange(userId, e.target.value) // Yeni rol
                                                }
                                            >
                                                <option value={1}>Üye</option> {/* Rol: 1 */}
                                                <option value={0}>Yönetici</option> {/* Rol: 0 */}
                                            </select>
                                        </div>
                                    </div>
                                    {isAdmin && (
                                        <button
                                            className="remove-user-box"
                                            onClick={() => handleRemoveUser(userId)}
                                        >
                                            <MdPersonRemoveAlt1 className="icon" />
                                            <span>Gruptan Çıkar</span>
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="option-buttons">
                        <button onClick={() => setAddUserModal(true)}>
                            <HiUserAdd className="icon" />
                            Üye Ekle
                        </button>
                        {isGroupSettings ? (
                            <button
                                onClick={handleSaveChanges}
                                disabled={isSaveDisabled}
                                className={isSaveDisabled ? "disabled" : ""}
                            >
                                Kaydet
                            </button>
                        ) : (
                            <button onClick={handleSubmit}>Grubu Oluştur</button>
                        )}
                    </div>
                </div>
            </div>
            {isAddUserModal && (
                <AddUser
                    setFormData={setFormData}
                    formData={formData}
                    closeUserModal={() => setAddUserModal(false)}
                />
            )}
            {isLoading && <PreLoader />}
        </div>
    );
}

export default NewGroupModal;
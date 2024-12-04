import { useState } from "react";
import CloseModalButton from "../../../../contexts/components/CloseModalButton.jsx";
import { useModal } from "../../../../contexts/ModalContext.jsx";
import { MdPersonRemoveAlt1 } from "react-icons/md";
import { HiUserAdd } from "react-icons/hi";
import { TbPhotoEdit } from "react-icons/tb";
import star from "../../../../assets/svg/star.svg";
import { IoMdSettings } from "react-icons/io";
import adminPP from "../../../../assets/users/hamza.png";
import AddUser from "../AddUser.jsx";
import "./style.scss";

function NewGroupModal({ closeModal, isGroupSettings }) {
    const [isAddUserModal, setAddUserModal] = useState(false);

    const { showModal } = useModal();
    const adminName = "Hamza Doğan";
    const adminRole = "Kurucu";
    const isAdmin = true;

    const exitsGroupImage = "https://images.unsplash.com/photo-1733035997778-65e038269fb8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2Nnx8fGVufDB8fHx8fA%3D%3D";
    const exitsGroupName = "Yardımlaşma Grubu";
    const exitsGroupDescription = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores id vitae corporis ex, atque animi distinctio minima commodi explicabo qui?";

    // State to store input values
    const [groupName, setGroupName] = useState(isGroupSettings ? exitsGroupName : "");
    const [groupDescription, setGroupDescription] = useState(isGroupSettings ? exitsGroupDescription : "");
    const [groupImage, setGroupImage] = useState(isGroupSettings ? exitsGroupImage : null);

    // Handlers for input changes
    const handleGroupNameChange = (e) => setGroupName(e.target.value);
    const handleGroupDescriptionChange = (e) => setGroupDescription(e.target.value);

    const handleGroupImageEdit = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setGroupImage(imageUrl);
        }
    };

    // Determine if save button should be active
    const isSaveButtonDisabled =
        groupName === exitsGroupName &&
        groupDescription === exitsGroupDescription &&
        groupImage === exitsGroupImage;

    const handleCreateGroup = () => {
        // Your create group logic here
    };

    const handleSaveChanges = () => {
        // Your save changes logic here
    };

    const handleAddUser = () => {
        setAddUserModal(!isAddUserModal);
    };

    const closeUserModal = () => {
        setAddUserModal(!isAddUserModal);
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
                        {groupImage ? (
                            <img src={groupImage} alt="Group" />
                        ) : (
                            <div className="group-image">GRUP</div>
                        )}
                        <label className="edit-image-btn">
                            <TbPhotoEdit />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleGroupImageEdit}
                                style={{ display: "none" }}
                            />
                        </label>
                    </div>
                </div>
                <div className="input-boxs">
                    <div className="input-box">
                        <p>Grup Adı</p>
                        <input
                            type="text"
                            placeholder="Bir grup adı belirle..."
                            value={groupName}
                            onChange={handleGroupNameChange}
                        />
                    </div>
                    <div className="input-box">
                        <p>Grup Açıklaması</p>
                        <input
                            type="text"
                            placeholder="Grup açıklaması belirle..."
                            value={groupDescription}
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
                        <div className="user-box">
                            <div className="user-info">
                                <img
                                    src="https://randomuser.me/api/portraits/men/1.jpg"
                                    alt="User Image"
                                />
                                <div className="username-and-role-box">
                                    <p>Okan Doğan</p>
                                    <select name="" defaultValue="Üye">
                                        <option value="Üye">Üye</option>
                                        <option value="Yönetici">Yönetici</option>
                                    </select>
                                </div>
                            </div>

                            {isAdmin && (
                                <button className="remove-user-box">
                                    <MdPersonRemoveAlt1 className="icon" />
                                    <span>Gruptan Çıkar</span>
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="option-buttons">
                        <button onClick={handleAddUser}>
                            <HiUserAdd className="icon" />
                            Üye Ekle
                        </button>
                        
                        {isGroupSettings ? (
                            <button
                                onClick={handleSaveChanges}
                                disabled={isSaveButtonDisabled}
                                className={isSaveButtonDisabled ? "disabled" : ""}
                            >
                                Kaydet
                            </button>
                        ) : (
                            <button onClick={handleCreateGroup}>Grubu Oluştur</button>
                        )}
                    </div>
                </div>
            </div>
            {isAddUserModal && <AddUser closeUserModal={closeUserModal} />}
        </div>
    );
}

export default NewGroupModal;

import { useState,useEffect } from "react";
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

// Kodun başlangıcında gerekli değişiklikler
function NewGroupModal({ closeModal, isGroupSettings }) {
    const [isAddUserModal, setAddUserModal] = useState(false);

    const { showModal } = useModal();
    const adminName = "Hamza Doğan";
    const adminRole = "Kurucu";
    const isAdmin = true;

    const exitsGroupImage = "https://images.unsplash.com/photo-1733035997778-65e038269fb8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2Nnx8fGVufDB8fHx8fA%3D%3D";
    const exitsGroupName = "Yardımlaşma Grubu";
    const exitsGroupDescription = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores id vitae corporis ex, atque animi distinctio minima commodi explicabo qui?";

    // State for group data
    const initialData = {
        groupName: isGroupSettings ? exitsGroupName : "",
        groupDescription: isGroupSettings ? exitsGroupDescription : "",
        groupImage: isGroupSettings ? exitsGroupImage : null,
        groupMembers: [
            { id: 1, name: "Okan Doğan", role: "Üye", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
            { id: 2, name: "Ayşe Yılmaz", role: "Üye", avatar: "https://randomuser.me/api/portraits/women/2.jpg" }
        ]
    };

    const [formData, setFormData] = useState(initialData);
    const [updatedRoles, setUpdatedRoles] = useState([]);

    // Kaydet butonunun etkinliğini izlemek için state
    const [isSaveDisabled, setSaveDisabled] = useState(true);

    useEffect(() => {
        // formData ve initialData'yı karşılaştır
        const isSameData = JSON.stringify(formData) === JSON.stringify(initialData);
        setSaveDisabled(isSameData);
    }, [formData]);

    // Handlers for input changes
    const handleGroupNameChange = (e) =>
        setFormData((prev) => ({ ...prev, groupName: e.target.value }));
    const handleGroupDescriptionChange = (e) =>
        setFormData((prev) => ({ ...prev, groupDescription: e.target.value }));

    const handleGroupImageEdit = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setFormData((prev) => ({ ...prev, groupImage: imageUrl }));
        }
    };

    const handleRoleChange = (id, newRole) => {
        const updatedMembers = formData.groupMembers.map((member) =>
            member.id === id ? { ...member, role: newRole } : member
        );
        setFormData((prev) => ({ ...prev, groupMembers: updatedMembers }));

        if (!updatedRoles.includes(id)) {
            setUpdatedRoles((prev) => [...prev, id]);
        }
    };

    const handleAddUser = (newUser) => {
        setFormData((prev) => ({
            ...prev,
            groupMembers: [...prev.groupMembers, newUser]
        }));
    };

    const handleRemoveUser = (id) => {
        const filteredMembers = formData.groupMembers.filter(
            (member) => member.id !== id
        );
        setFormData((prev) => ({ ...prev, groupMembers: filteredMembers }));
    };

    const handleSaveChanges = () => {
        console.log("Saved Data: ", formData);
        // Backend service logic here
    };

    const handleSubmit = () => {
        console.log("Final Data: ", formData);
     ü
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
                        {formData.groupImage ? (
                            <img src={formData.groupImage} alt="Group" />
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
                            value={formData.groupName}
                            onChange={handleGroupNameChange}
                        />
                    </div>
                    <div className="input-box">
                        <p>Grup Açıklaması</p>
                        <input
                            type="text"
                            placeholder="Grup açıklaması belirle..."
                            value={formData.groupDescription}
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
                        {formData.groupMembers.map((user) => (
                            <div className="user-box" key={user.id}>
                                <div className="user-info">
                                    <img src={user.avatar} alt="User" />
                                    <div className="username-and-role-box">
                                        <p>{user.name}</p>
                                        <select
                                            defaultValue={user.role}
                                            onChange={(e) =>
                                                handleRoleChange(user.id, e.target.value)
                                            }
                                        >
                                            <option value="Üye">Üye</option>
                                            <option value="Yönetici">Yönetici</option>
                                        </select>
                                    </div>
                                </div>
                                {isAdmin && (
                                    <button
                                        className="remove-user-box"
                                        onClick={() => handleRemoveUser(user.id)}
                                    >
                                        <MdPersonRemoveAlt1 className="icon" />
                                        <span>Gruptan Çıkar</span>
                                    </button>
                                )}
                            </div>
                        ))}
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
                        closeUserModal={() => setAddUserModal(false)}
                        onAddUser={handleAddUser}
                    />
                )}
           
        </div>
    );
}

export default NewGroupModal;
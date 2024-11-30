import CloseModalButton from "../../../../contexts/components/CloseModalButton.jsx";
import { useModal } from "../../../../contexts/ModalContext.jsx"
import { MdPersonRemoveAlt1 } from "react-icons/md";
import { HiUserAdd } from "react-icons/hi";
import { TbPhotoEdit } from "react-icons/tb";
import GroupImage from "../../../../assets/YardimlasmaGrubu.png"
import star from "../../../../assets/svg/star.svg";
import adminPP from "../../../../assets/users/hamza.png";
import "./style.scss";
import AddUser from "../AddUser.jsx";
import { useState } from "react";

function NewGroupModal({ closeModal, isGroupSettings }) {

    const [isAddUserModal, setAddUserModal] = useState(false);

    const { showModal } = useModal()
    const adminName = "Hamza Doğan"
    const adminRole = "Yönetici"
    const isAdmin = true;
    const isGroupImage = false;


    // Set Group Image 
    const handleGroupImageEdit = () => {

    }
    const handleSubmit = () => {

    }

    const handleAddUser = () => {
        setAddUserModal(!isAddUserModal);
    }

    const closeUserModal = () => {
        setAddUserModal(!isAddUserModal);
    }

    return (
        <div className='new-group-modal'>
            <CloseModalButton closeModal={closeModal} />
            <div className="title-box">
                <img src={star} alt="" />
                <p>Yeni bir grup oluştur</p>
            </div>
            <div className="contents">
                <div className="choose-group-image">
                    <p>Grup Resmi</p>
                    <div className="group-image-box">
                        {isGroupImage ? <img src={GroupImage} alt="" /> : <div className="group-image">GRUP</div>}
                        <button onClick={handleGroupImageEdit} className="edit-image-btn"><TbPhotoEdit /></button>
                    </div>
                </div>
                <div className="input-boxs">
                    <div className="input-box">
                        <p>Grup Adı</p>
                        <input type="text" placeholder="Bir grup adı belirle...." />
                    </div>
                    <div className="input-box">
                        <p>Grup Açıklaması</p>
                        <input type="text" placeholder="Grup açıklaması belirle..." />
                    </div>
                </div>

                <div className="group-members-box">
                    <h2>Grup Üyeleri</h2>

                    {/* If there are a lot of admin of group, We can map this div */}
                    <div className="group-admin">
                        <img src={adminPP} alt="Admin Profile Image" />
                        <div className="admin-info">
                            <p>{adminName}</p>
                            <span>{adminRole}</span>
                        </div>
                    </div>

                    <div className="other-users">
                        {/*Do Map Implementation with Real Data */}
                        <div className="user-box">
                            <div className="user-info">
                                <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="User Image" />
                                <div className="username-and-role-box">
                                    <p>Okan Doğan</p>
                                    <select name="" defaultValue="Üye">
                                        <option value="Üye">Üye</option>
                                        <option value="Yönetici">Yönetici</option>
                                    </select>
                                </div>
                            </div>

                            {isAdmin &&
                                <button className="remove-user-box">
                                    <MdPersonRemoveAlt1 className="icon" />
                                    <span>Gruptan Çıkar</span>
                                </button>}
                        </div>
                    </div>

                    <div className="option-buttons">
                        <button onClick={handleAddUser}>
                            <HiUserAdd className="icon" />
                            Üye Ekle
                        </button>
                        <button onClick={handleSubmit} >
                            Grubu Oluştur
                        </button>
                    </div>

                </div>
            </div>
            {isAddUserModal && <AddUser closeUserModal={closeUserModal} />}
        </div>
    )
}

export default NewGroupModal
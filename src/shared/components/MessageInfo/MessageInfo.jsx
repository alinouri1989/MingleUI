import { useSelector } from "react-redux";
import { LuCheckCheck } from "react-icons/lu";
import { formatDateForMessageInfo } from "../../../helpers/dateHelper";
import CloseModalButton from "../../../contexts/components/CloseModalButton";
import "./style.scss";
import { defaultProfilePhoto } from "../../../constants/DefaultProfilePhoto";

function MessageInfo({ closeModal, chatId, messageId }) {

    const { Group } = useSelector(state => state.chat);
    const { groupList } = useSelector(state => state.groupList);

    const chat = Group.find(group => group.id === chatId);
    if (!chat) return <div>Chat not found</div>;

    const message = chat.messages.find(msg => msg.id === messageId);
    if (!message) return <div>Message not found</div>;

    const participants = chat.participants;
    const group = groupList[participants[0]];
    if (!group) return <div>Group not found</div>;

    const deliveredUsers = Object.keys(message.status.delivered || {}).filter(userId => !message.status.read[userId]);
    const readUsers = Object.keys(message.status.read || {});

    const getUserInfo = (userId) => group.participants[userId] || null;

    return (
        <div className="message-info-modal">
            <CloseModalButton closeModal={closeModal} />
            {readUsers.length > 0 && (
                <div className="message-info-section">
                    <div className="title-box">
                        <LuCheckCheck className="read" />
                        <p className="read">Okuyanlar</p>
                    </div>
                    <div className={`user-list ${deliveredUsers.length > 0 ? "first" : ""}`}>
                        {readUsers.map(userId => {
                            const user = getUserInfo(userId);
                            return user ? (
                                <div key={userId} className="user-info">
                                    <div className="image-and-name-box">
                                        <img src={user.profilePhoto} alt={user.displayName} className="profile-photo"
                                            onError={(e) => e.currentTarget.src = defaultProfilePhoto}
                                        />
                                        <span>{user.displayName}</span>
                                    </div>
                                    <p>{formatDateForMessageInfo(message.status.read[userId])}</p>
                                </div>
                            ) : null;
                        })}
                    </div>
                </div>
            )}

            {deliveredUsers.length > 0 ? (
                <div className="message-info-section">
                    <div className="title-box">
                        <LuCheckCheck />
                        <p>Teslim edilenler</p>
                    </div>
                    <div className={`user-list`}>
                        {deliveredUsers.map(userId => {
                            const user = getUserInfo(userId);
                            return user ? (
                                <div key={userId} className="user-info">
                                    <div className="image-and-name-box">
                                        <img src={user.profilePhoto} alt={user.displayName} className="profile-photo" />
                                        <span>{user.displayName}</span>
                                    </div>
                                    <p>{formatDateForMessageInfo(message.status.delivered[userId])}</p>
                                </div>
                            ) : <p>Teslim Edilmedi</p>;
                        })}
                    </div>
                </div>
            ) : readUsers.length == 0 && <div className="no-user">
                <p>Mesaj gönderildi, okuyan veya teslim alan kullanıcı bulunmuyor.</p>
            </div>
            }
        </div >
    );
}

export default MessageInfo;
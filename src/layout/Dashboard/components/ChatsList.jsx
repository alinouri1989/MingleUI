import NewChatModal from "../../../components/Chats/Components/NewChat/NewChatModal";
import { useModal } from "../../../contexts/ModalContext";
import SearchInput from "./SearchInput";
import UserChatCard from "./UserChatCard";
import "./style.scss";


const users = [
    {
        id: 1,
        image: "https://randomuser.me/api/portraits/men/1.jpg",
        status: "online",
        name: "Okan Doğan",
        lastMessage: "Sınav başarılı geç...",
        lastDate: "16:20",
        unReadMessage: 3,
        isArchive: false,
    },
    {
        id: 2,
        image: "https://randomuser.me/api/portraits/women/2.jpg",
        status: "online",
        name: "Ayşe Yılmaz",
        lastMessage: "Toplantı saat kaçta?",
        lastDate: "22.10.2004",
        unReadMessage: 1,
        isArchive: false,
    },
    {
        id: 3,
        image: "https://randomuser.me/api/portraits/men/3.jpg",
        status: "offline",
        name: "Mehmet Kaya",
        lastMessage: "Yarın görüşelim mi?",
        lastDate: "14:45",
        unReadMessage: 2,
        isArchive: false,
    },
    {
        id: 4,
        image: "https://randomuser.me/api/portraits/women/4.jpg",
        status: "offline",
        name: "Elif Çelik",
        lastMessage: "Dosyayı gönderdim.",
        lastDate: "13:30",
        unReadMessage: 0,
        isArchive: false,
    }
];


function ChatsList() {

    const { showModal, closeModal } = useModal();

    const handleNewChat = () => {
        showModal(<NewChatModal closeModal={closeModal} />);
    }

    return (
        <div className="chat-list-box">
            <SearchInput placeholder={"Sohbetlerinizde aratın..."} />
            <div>
                <button onClick={handleNewChat} className="create-buttons">Yeni Sohbet</button>
            </div>
            <div className="user-list">
                {users.map((user) => (
                    <UserChatCard
                        key={user.id}
                        image={user.image}
                        status={user.status}
                        name={user.name}
                        lastMessage={user.lastMessage}
                        lastDate={user.lastDate}
                        unReadMessage={user.unReadMessage}
                        isArchive={user.isArchive}
                    />
                ))}
            </div>
        </div>
    )
}

export default ChatsList
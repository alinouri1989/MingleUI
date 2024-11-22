import SearchInput from "./SearchInput";
import "./style.scss";
import UserMessageCard from "./UserMessageCard";


const users = [
    {
        id: 1,
        image: "https://randomuser.me/api/portraits/men/1.jpg",
        status: "online",
        name: "Okan Doğan",
        lastMessage: "Sınav başarılı geç...",
        lastDate: "16:20",
        unReadMessage: 3,
    },
    {
        id: 2,
        image: "https://randomuser.me/api/portraits/women/2.jpg",
        status: "offline",
        name: "Ayşe Yılmaz",
        lastMessage: "Toplantı saat kaçta?",
        lastDate: "15:00",
        unReadMessage: 1,
    },
    {
        id: 3,
        image: "https://randomuser.me/api/portraits/men/3.jpg",
        status: "online",
        name: "Mehmet Kaya",
        lastMessage: "Yarın görüşelim mi?",
        lastDate: "14:45",
        unReadMessage: 2,
    },
    {
        id: 4,
        image: "https://randomuser.me/api/portraits/women/4.jpg",
        status: "away",
        name: "Elif Çelik",
        lastMessage: "Dosyayı gönderdim.",
        lastDate: "13:30",
        unReadMessage: 0,
    }
];



function ChatsList() {
    return (
        <div className="chat-list-box">
            <SearchInput placeholder={"Sohbetlerinizde aratın..."} />
            <div>
                <button className="create-buttons">Yeni Sohbet</button>
            </div>
            <div className="user-list">
                {users.map((user) => (
                    <UserMessageCard
                        key={user.id}
                        image={user.image}
                        status={user.status}
                        name={user.name}
                        lastMessage={user.lastMessage}
                        lastDate={user.lastDate}
                        unReadMessage={user.unReadMessage}
                    />
                ))}
            </div>
        </div>
    )
}

export default ChatsList
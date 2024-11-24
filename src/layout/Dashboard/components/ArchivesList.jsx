import SearchInput from "./SearchInput";
import "./style.scss";
import UserChatCard from "./UserChatCard";

const users = [
    {
        id: 1,
        image: "https://randomuser.me/api/portraits/men/1.jpg",
        status: "online",
        name: "Okan Doğan",
        lastMessage: "Sınav başarılı geç...",
        lastDate: "16:20",
        unReadMessage: 3,
        isArchive:true,
    },
    {
        id: 2,
        image: "https://randomuser.me/api/portraits/women/2.jpg",
        status: "online",
        name: "Ayşe Yılmaz",
        lastMessage: "Toplantı saat kaçta?",
        lastDate: "15:00",
        unReadMessage: 1,
        isArchive:true,
    },
    {
        id: 3,
        image: "https://randomuser.me/api/portraits/men/3.jpg",
        status: "offline",
        name: "Mehmet Kaya",
        lastMessage: "Yarın görüşelim mi?",
        lastDate: "14:45",
        unReadMessage: 2,
        isArchive:true,
    },
    {
        id: 4,
        image: "https://randomuser.me/api/portraits/women/4.jpg",
        status: "offline",
        name: "Elif Çelik",
        lastMessage: "Dosyayı gönderdim.",
        lastDate: "13:30",
        unReadMessage: 0,
        isArchive:true,
    }
];

  

function ArchivesList() {
    return (
        <div className="archive-list-box">
            <SearchInput placeholder={"Arşivlenmiş sohbetlerde ara"} />
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

export default ArchivesList
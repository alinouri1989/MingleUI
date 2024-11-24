import SearchInput from "./SearchInput";
import "./style.scss";
import UserCallCard from "./UserCallCard";


const users = [
  {
    id: 1,
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    status: "online",
    name: "Okan Doğan",
    callStatus: "unAnsweredIncomingCall",
    lastDate: "12:20",
  },
  {
    id: 2,
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    status: "online",
    name: "Ayşe Yılmaz",
    callStatus: "incomingCall",
    lastDate: "12.08.2024",
  },
  {
    id: 3,
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    status: "offline",
    name: "Mehmet Kaya",
    callStatus:"outgoingCall",
    lastDate: "15.05.2024",
  },
  {
    id: 4,
    image: "https://randomuser.me/api/portraits/women/4.jpg",
    status: "offline",
    name: "Elif Çelik",
    callStatus:"unAnsweredOutgoingCall",
    lastDate: "12.03.2023",
  }
];


function CallsList() {
  return (
    <div className="call-list-box">
      <SearchInput placeholder={"Aratın veya yeni arama başlatın"} />
      <div className="user-list">
                {users.map((user) => (
                    <UserCallCard
                        key={user.id}
                        image={user.image}
                        status={user.status}
                        name={user.name}
                        callStatus={user.callStatus}
                        lastDate={user.lastDate}
                    />
                ))}
            </div>
    </div>
  )
}

export default CallsList
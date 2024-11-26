import { useState } from "react";
import WelcomeScreen from "../WelcomeScreen/WelcomeScreen";



import MessageInputBar from "../../shared/components/MessageInputBar/MessageInputBar";

import GroupMessageBar from "./Components/GroupMessageBar";
import GroupDetailsBar from "./Components/GroupDetailsBar";
import GroupTopBar from "./Components/GroupTopBar";
import "../ChatsAndGroups.scss";

// Props ile kullanıcıyı alıcak. ya da url ile id üzerinden kullanıcı bilgisni alıcak hub durumu felan şimdilik statik

function Chats() {

  // Sidebar açık/kapalı durumu için state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Mock mesajlar
  const Messages = [
    { id: 1, text: 'Merhaba, grup!', timestamp: '09:20', date: '22.09.2024', sender: 'user1', userName: 'Ahmet', profileImage: 'https://randomuser.me/api/portraits/men/1.jpg', status: "read" },
    { id: 2, text: 'Nasılsınız?', timestamp: '09:22', date: '22.09.2024', sender: 'user2', userName: 'Elif', profileImage: 'https://randomuser.me/api/portraits/women/1.jpg', status: "read" },
    { id: 3, text: 'İyiyiz, teşekkürler! Senden naber?', timestamp: '09:25', date: '22.09.2024', sender: 'user3', userName: 'Mehmet', profileImage: 'https://randomuser.me/api/portraits/men/2.jpg', status: "read" },
    { id: 4, text: 'Yeni bir projeye başladım!', timestamp: '09:30', date: '22.09.2024', sender: 'user4', userName: 'Ayşe', profileImage: 'https://randomuser.me/api/portraits/women/2.jpg', status: "read" },
    { id: 5, text: 'Harika, nedir bu proje?', timestamp: '09:35', date: '22.09.2024', sender: 'user5', userName: 'Can', profileImage: 'https://randomuser.me/api/portraits/men/3.jpg', status: "read" },
    { id: 6, text: 'Bir chat uygulaması geliştiriyorum.', timestamp: '14:10', date: 'Dün', sender: 'user1', userName: 'Ahmet', profileImage: 'https://randomuser.me/api/portraits/men/1.jpg', status: "delivered" },
    { id: 7, text: 'Wow, müthiş bir fikirsdasdasd sadaadasdasd asd asd asdasdsa sdasd asdsssssssssss sdsdadasda  sadasdasdasd as dasdas!', timestamp: '14:15', date: 'Dün', sender: 'user2', userName: 'Elif', profileImage: 'https://randomuser.me/api/portraits/women/1.jpg', status: "delivered" },
    { id: 8, text: 'WebSocket entegrasyonu düşünebilirsin.', timestamp: '14:20', date: 'Dün', sender: 'user3', userName: 'Mehmet', profileImage: 'https://randomuser.me/api/portraits/men/2.jpg', status: "delivered" },
    { id: 9, text: 'WebSocket çok güçlü bir araç, detaylı konuşabiliriz.', timestamp: '10:00', date: 'Bugün', sender: 'user4', userName: 'Ayşe', profileImage: 'https://randomuser.me/api/portraits/women/2.jpg', status: "sent" },
    { id: 10, text: 'Evet, bence de. Kolay gelsin!', timestamp: '10:05', date: 'Bugün', sender: 'user5', userName: 'Can', profileImage: 'https://randomuser.me/api/portraits/men/3.jpg', status: "sent" },
  ];
  
  // Gruplama fonksiyonu
  const groupMessagesByDate = (messages) => {
    return messages.reduce((grouped, message) => {
      const { date } = message;
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(message);
      return grouped;
    }, {});
  };


  const groupedMessages = groupMessagesByDate(Messages);

  return (
    <>
      <div className='group-general-box'>
        {/* <WelcomeScreen text={"Kişisel sohbetleriniz uçtan uca şifrelidir"}/> */}
        <GroupTopBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <GroupMessageBar groupedMessages={groupedMessages} />
        <MessageInputBar />
      </div>
      <GroupDetailsBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </>

  )
}

export default Chats
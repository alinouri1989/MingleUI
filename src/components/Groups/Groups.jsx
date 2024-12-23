import { useState } from "react";
import WelcomeScreen from "../WelcomeScreen/WelcomeScreen";
import MessageInputBar from "../../shared/components/MessageInputBar/MessageInputBar";

import GroupMessageBar from "./Components/GroupMessageBar";
import GroupDetailsBar from "./Components/GroupDetailsBar";
import GroupTopBar from "./Components/GroupTopBar";
import "../layout.scss";
import { useParams } from "react-router-dom";


function Chats() {
  //props olarak chatId alacak
  const { id } = useParams(); // URL'den ID'yi al

  // Sidebar açık/kapalı durumu için state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Mock chatId
  const chatId = "b97917f4-7740-45c6-887a-9bfd3885db2e";

  // Mock mesajlar
  const Messages = [
    { id: 1, content: 'Merhaba, grup!', timestamp: '09:20', date: '22.09.2024', sender: 'user1', userName: 'Ahmet', profileImage: 'https://randomuser.me/api/portraits/men/1.jpg', status: "read", messageType: "text" },
    { id: 2, content: 'Nasılsınız?', timestamp: '09:22', date: '22.09.2024', sender: 'user2', userName: 'Elif', profileImage: 'https://randomuser.me/api/portraits/women/1.jpg', status: "read", messageType: "text" },
    { id: 3, content: 'İyiyiz, teşekkürler! Senden naber?', timestamp: '09:25', date: '22.09.2024', sender: 'user3', userName: 'Mehmet', profileImage: 'https://randomuser.me/api/portraits/men/2.jpg', status: "read", messageType: "text" },
    { id: 4, content: 'https://images.unsplash.com/photo-1698896177751-dd2df569651f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', timestamp: '09:30', date: '22.09.2024', sender: 'user4', userName: 'Ayşe', profileImage: 'https://randomuser.me/api/portraits/women/2.jpg', status: "read", messageType: "image" },
    { id: 5, content: 'Harika, nedir bu proje?', timestamp: '09:35', date: '22.09.2024', sender: 'user5', userName: 'Can', profileImage: 'https://randomuser.me/api/portraits/men/3.jpg', status: "read", messageType: "text" },
    { id: 6, content: 'Bir chat uygulaması geliştiriyorum.', timestamp: '14:10', date: 'Dün', sender: 'user1', userName: 'Ahmet', profileImage: 'https://randomuser.me/api/portraits/men/1.jpg', status: "delivered", messageType: "text" },
    { id: 7, content: 'https://plus.unsplash.com/premium_photo-1673483585959-6057ace2e0b1?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', timestamp: '14:10', date: 'Dün', sender: 'user1', userName: 'Ahmet', profileImage: 'https://randomuser.me/api/portraits/men/1.jpg', status: "delivered", messageType: "image" },
    { id: 8, content: 'Wow, müthiş bir fikir!', timestamp: '14:15', date: 'Dün', sender: 'user2', userName: 'Elif', profileImage: 'https://randomuser.me/api/portraits/women/1.jpg', status: "delivered", messageType: "text" },
    { id: 9, content: 'WebSocket entegrasyonu düşünebilirsin.', timestamp: '14:20', date: 'Dün', sender: 'user3', userName: 'Mehmet', profileImage: 'https://randomuser.me/api/portraits/men/2.jpg', status: "delivered", messageType: "text" },
    { id: 10, content: 'WebSocket çok güçlü bir araç, detaylı konuşabiliriz.', timestamp: '10:00', date: 'Bugün', sender: 'user4', userName: 'Ayşe', profileImage: 'https://randomuser.me/api/portraits/women/2.jpg', status: "sent", messageType: "text" },
    { id: 11, content: 'Evet, bence de. Kolay gelsin!', timestamp: '10:05', date: 'Bugün', sender: 'user5', userName: 'Can', profileImage: 'https://randomuser.me/api/portraits/men/3.jpg', status: "sent", messageType: "text" },
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
        {!id && <WelcomeScreen text={"Grup sohbetleriniz uçtan uca şifrelidir"} />}
        {id && <>
          <GroupTopBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <GroupMessageBar groupedMessages={groupedMessages} />
          <MessageInputBar />
        </>
        }
      </div>
      {id && <GroupDetailsBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} chatId={chatId} />}
    </>

  )
}

export default Chats
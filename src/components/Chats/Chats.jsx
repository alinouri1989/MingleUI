import { useState } from "react";
import WelcomeScreen from "../WelcomeScreen/WelcomeScreen";

import UserTopBar from "./Components/UserTopBar";
import UserMessageBar from "./Components/UserMessageBar";
import MessageInputBar from "../../shared/components/MessageInputBar/MessageInputBar";
import "../ChatsAndGroups.scss";
import UserDetailsBar from "./Components/UserDetailsBar";

// Props ile kullanıcıyı alıcak. ya da url ile id üzerinden kullanıcı bilgisni alıcak hub durumu felan şimdilik statik

function Chats() {

  // Sidebar açık/kapalı durumu için state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const mockMessages = [
    { id: 1, content: 'Merhaba!', timestamp: '09:20', date: '22.09.2024', sender: 'user1', receiver: 'user2', status: "read", messageType: "text" },
    { id: 2, content: 'Nasılsın?', timestamp: '09:22', date: '22.09.2024', sender: 'user2', receiver: 'user1', status: "read", messageType: "text" },
    { id: 3, content: 'İyiyim, teşekkürler!', timestamp: '09:25', date: '22.09.2024', sender: 'user1', receiver: 'user2', status: "read", messageType: "text" },
    { id: 4, content: 'Öyle işte kendimce çalışmalar yapıyorum seni de iyi gördüm', timestamp: '09:25', date: '22.09.2024', sender: 'user1', receiver: 'user2', status: "read", messageType: "text" },
    { id: 5, content: ':)', timestamp: '09:25', date: '22.09.2024', sender: 'user1', receiver: 'user2', status: "read", messageType: "text" },
    { id: 6, content: 'Dün bir şeyler yazmıştın?', timestamp: '14:10', date: 'Dün', sender: 'user2', receiver: 'user1', status: "delivered", messageType: "text" },
    { id: 7, content: 'Evet, yeni bir projeye başladım.', timestamp: '14:15', date: 'Dün', sender: 'user1', receiver: 'user2', status: "delivered", messageType: "text" },
    { id: 8, content: 'Hangi proje?', timestamp: '14:20', date: 'Dün', sender: 'user2', receiver: 'user1', status: "delivered", messageType: "text" },
    { id: 9, content: 'Chat uygulaması geliştiriyorum.', timestamp: '10:00', date: 'Bugün', sender: 'user1', receiver: 'user2', status: "sent", messageType: "text" },
    { id: 10, content: 'Wow! Harika bir fikir! 😉', timestamp: '10:05', date: 'Bugün', sender: 'user2', receiver: 'user1', status: "sent", messageType: "text" },
    { id: 11, content: 'Teşekkürler! WebSocket entegrasyonu yapacağım. Ancak nasıl yapacağım konusunda tam bir fikrim yok isterseniz bunu daha sonra detaylı bir şekilde konuşalım.', timestamp: '10:10', date: 'Bugün', sender: 'user1', receiver: 'user2', status: "sent", messageType: "text" },
    { id: 12, content: 'Kolay gelsin, merakla bekliyorum!', timestamp: '10:15', date: 'Bugün', sender: 'user2', receiver: 'user1', status: "sent", messageType: "text" },
    { id: 13, content: 'https://plus.unsplash.com/premium_photo-1732568404499-8561e0788a13?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', timestamp: '10:15', date: 'Bugün', sender: 'user2', receiver: 'user1', status: "sent", messageType: "image" },
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


  const groupedMessages = groupMessagesByDate(mockMessages);

  return (
    <>
      <div className='chat-general-box'>
        {/* <WelcomeScreen text={"Kişisel sohbetleriniz uçtan uca şifrelidir"}/> */}

        <UserTopBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <UserMessageBar groupedMessages={groupedMessages} />
        <MessageInputBar />
      </div>
      <UserDetailsBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </>

  )
}

export default Chats
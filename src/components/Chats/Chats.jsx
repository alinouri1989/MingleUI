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

  // Mock mesajlar
  const mockMessages = [
    { id: 1, text: 'Merhaba!', timestamp: '09:20', date: '22.09.2024', sender: 'user1', receiver: 'user2', status: "read" },
    { id: 2, text: 'Nasılsın?', timestamp: '09:22', date: '22.09.2024', sender: 'user2', receiver: 'user1', status: "read" },
    { id: 3, text: 'İyiyim, teşekkürler!', timestamp: '09:25', date: '22.09.2024', sender: 'user1', receiver: 'user2', status: "read" },
    { id: 4, text: 'Öyle işte kendimce çalışmalar yapıyorum seni de iyi gördüm', timestamp: '09:25', date: '22.09.2024', sender: 'user1', receiver: 'user2', status: "read" },
    { id: 5, text: ':)', timestamp: '09:25', date: '22.09.2024', sender: 'user1', receiver: 'user2', status: "read" },
    { id: 6, text: 'Dün bir şeyler yazmıştın?', timestamp: '14:10', date: 'Dün', sender: 'user2', receiver: 'user1', status: "delivered" },
    { id: 7, text: 'Evet, yeni bir projeye başladım.', timestamp: '14:15', date: 'Dün', sender: 'user1', receiver: 'user2', status: "delivered" },
    { id: 8, text: 'Hangi proje?', timestamp: '14:20', date: 'Dün', sender: 'user2', receiver: 'user1', status: "delivered" },
    { id: 9, text: 'Chat uygulaması geliştiriyorum.', timestamp: '10:00', date: 'Bugün', sender: 'user1', receiver: 'user2', status: "sent" },
    { id: 10, text: 'Wow! Harika bir fikir!', timestamp: '10:05', date: 'Bugün', sender: 'user2', receiver: 'user1', status: "sent" },
    { id: 11, text: 'Teşekkürler! WebSocket entegrasyonu yapacağım. Ancak nasıl yapacağım konusunda tam bir fikrim yok isterseniz bunu daha sonra detaylı bir şekilde konuşalım.', timestamp: '10:10', date: 'Bugün', sender: 'user1', receiver: 'user2', status: "sent" },
    { id: 12, text: 'Kolay gelsin, merakla bekliyorum!', timestamp: '10:15', date: 'Bugün', sender: 'user2', receiver: 'user1', status: "sent" },
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
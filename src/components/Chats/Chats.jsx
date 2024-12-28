import { useState, useEffect } from "react";
import WelcomeScreen from "../WelcomeScreen/WelcomeScreen";

import UserTopBar from "./Components/UserTopBar";
import UserMessageBar from "./Components/UserMessageBar";
import MessageInputBar from "../../shared/components/MessageInputBar/MessageInputBar";
import "../layout.scss";
import UserDetailsBar from "./Components/UserDetailsBar";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSignalR } from "../../contexts/SignalRContext";
import { useSelector } from "react-redux";

function Chats() {
  const { id } = useParams(); // URL'den ID'yi al
  const { chatConnection } = useSignalR(); // SignalR bağlantısını al
  const navigate = useNavigate(); // Navigate fonksiyonu
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [recipientProfile, setRecipientProfile] = useState(null);
  const { Individual, isChatsInitialized, } = useSelector(state => state.chat);

  useEffect(() => {
    if (isChatsInitialized && id) {
      const chatExists = Individual.some((chat) => chat.id === id);
      if (!chatExists) {
        navigate("/anasayfa", { replace: true }); // Anasayfaya yönlendir
      }
    }
  }, [isChatsInitialized, Individual]);


  const location = useLocation();
  console.log(location.pathname);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div className="chat-general-box">
        {!id && (
          <WelcomeScreen text={"Kişisel sohbetleriniz uçtan uca şifrelidir"} />
        )}

        {id && (
          <>
            <UserTopBar
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
              recipientProfile={recipientProfile} // Profili üst bileşene geçir
            />
            <UserMessageBar groupedMessages={{}} ChatId={id} /> {/* Örnek veriyi gruplama */}
            <MessageInputBar chatId={id} />
          </>
        )}
      </div>
      {id && (
        <UserDetailsBar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          recipientProfile={recipientProfile} // Sidebar için profil bilgisi
        />
      )}
    </>
  );
}

export default Chats;

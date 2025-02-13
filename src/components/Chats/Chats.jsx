import { useState, useEffect } from "react";
import WelcomeScreen from "../WelcomeScreen/WelcomeScreen";

import UserTopBar from "./Components/UserTopBar";
import UserMessageBar from "./Components/UserMessageBar";
import MessageInputBar from "../../shared/components/MessageInputBar/MessageInputBar";
import "../layout.scss";
import UserDetailsBar from "./Components/UserDetailsBar";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserIdFromToken } from "../../helpers/getUserIdFromToken";

function Chats() {
  const { id } = useParams(); // URL'den ID'yi al
  const navigate = useNavigate(); // Navigate fonksiyonu
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [recipientProfile, setRecipientProfile] = useState(null);
  const [recipientId, setRecipientId] = useState(null);

  const { Individual, isChatsInitialized } = useSelector((state) => state.chat); // Chat bilgileri
  const { chatList } = useSelector((state) => state.chatList); // Kullanıcı listesi bilgileri
  const { token } = useSelector((state) => state.auth); // Kullanıcı token'ı
  const UserId = getUserIdFromToken(token); // Token'dan kullanıcı ID'si al
  const location = useLocation();

  useEffect(() => {
    if (isChatsInitialized && id) {
      const chatExists = Individual.some((chat) => chat.id === id);
      if (!chatExists) {
        navigate("/anasayfa", { replace: true }); // Anasayfaya yönlendir
      }
    }
  }, [isChatsInitialized, Individual, id, navigate]);

  // Recipient bilgilerini al
  useEffect(() => {
    if (id && Individual.length > 0 && chatList) {
      // Individual içinde id ile eşleşen chat'i bul
      const chat = Individual.find((chat) => chat.id === id);

      if (chat) {
        // participants dizisinden kullanıcı ID'siyle eşleşmeyen diğer ID'yi al
        const recipientId = chat.participants.find((participant) => participant !== UserId);

        if (recipientId) {
          // chatList içinde recipientId ile eşleşen kullanıcıyı bul
          const recipient = chatList[recipientId];

          setRecipientProfile(recipient || null);
          setRecipientId(recipientId);
        }
      }
    }
  }, [id, Individual, chatList, UserId]);

  useEffect(() => {
    if (isSidebarOpen) {
      setIsSidebarOpen(!isSidebarOpen);
    }
  }, [location])


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!isChatsInitialized && id) {
    return null;
  }

  return (
    <div className="chat-section">
      <div className="chat-general-box">
        {!id && (
          <WelcomeScreen text={"Kişisel sohbetleriniz uçtan uca şifrelidir"} />
        )}

        {id && (
          <>
            <UserTopBar
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
              recipientProfile={recipientProfile}
              recipientId={recipientId}
            />
            <UserMessageBar ChatId={id} /> {/* Örnek veriyi gruplama */}
            <MessageInputBar chatId={id} />
          </>
        )}
      </div>
      {id && (
        <UserDetailsBar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          recipientProfile={recipientProfile}
          recipientId={recipientId}
        />
      )}
    </div>
  );
}

export default Chats;

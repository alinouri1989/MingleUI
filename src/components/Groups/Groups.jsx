import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import WelcomeScreen from "../WelcomeScreen/WelcomeScreen";
import MessageInputBar from "../../shared/components/MessageInputBar/MessageInputBar";
import GroupMessageBar from "./Components/GroupMessageBar";
import GroupDetailsBar from "./Components/GroupDetailsBar";
import GroupTopBar from "./Components/GroupTopBar";
import { useSelector } from "react-redux";
import "../layout.scss";


function GroupChats() {
  const { id } = useParams(); // URL'den ID'yi al
  const navigate = useNavigate(); // Navigate fonksiyonu
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [groupProfile, setGroupProfile] = useState(null);

  // Group bilgileri ve chatList Redux'tan alınır
  const { Group, isChatsInitialized } = useSelector((state) => state.chat);
  const { groupList } = useSelector((state) => state.groupList);
  useEffect(() => {
    if (isChatsInitialized && id) {
      const groupExists = Group.some((group) => group.id === id);
      if (!groupExists) {
        navigate("/anasayfa", { replace: true });
      }
    }
  }, [isChatsInitialized, Group, id, navigate]);




  useEffect(() => {
    if (id && Group?.length > 0 && groupList) {
      // `id` ve `group.id` eşleşmesini kontrol et
      const matchedGroup = Group.find((group) => String(group.id) === String(id));

      if (matchedGroup) {
        // matchedGroup içinde participants'tan ilk ID'yi al
        const participantId = matchedGroup.participants?.[0];

        if (participantId) {
          // groupList'te participantId ile eşleşen nesneyi bul
          const matchedGroupListEntry = groupList[participantId];

          if (matchedGroupListEntry) {
            setGroupProfile({
              ...matchedGroupListEntry,
              groupId: matchedGroup.id, // Group'dan id ekle
              lastMessage: matchedGroup.messages?.[matchedGroup.messages.length - 1]?.content || "", // Son mesaj
            });
          } else {
            console.warn("Eşleşen groupList verisi bulunamadı");
            setGroupProfile(null);
          }
        } else {
          console.warn("Group'un participants içinde ID bulunamadı");
          setGroupProfile(null);
        }
      } else {
        console.warn("Eşleşen Group bulunamadı");
        setGroupProfile(null);
      }
    } else {
      setGroupProfile(null);
    }
  }, [id, Group, groupList]);



  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  if (!isChatsInitialized && id) {
    return null;
  }


  return (
    <>
      <div className='group-general-box'>
        {!id && <WelcomeScreen text={"Grup sohbetleriniz uçtan uca şifrelidir"} />}
        {id && (
          <>
            <GroupTopBar
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
              groupProfile={groupProfile} // Grup profilini üst bileşene geçir
            />
            <GroupMessageBar groupId={id} />
            <MessageInputBar chatId={id} />
          </>
        )}
      </div>
      {id && (
        <GroupDetailsBar
          groupId={id}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          groupProfile={groupProfile}
        />
      )}
    </>
  );
}

export default GroupChats;

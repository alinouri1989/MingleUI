import { useState } from "react";
import SearchInput from "./SearchInput";
import NewGroupModal from "../../../components/Groups/Components/NewAndSettingsGroup/NewGroupModal";
import { useModal } from "../../../contexts/ModalContext";
import { useSelector } from "react-redux";
import "./style.scss";
import GroupChatCard from "./GroupChatCard";
import { lastMessageDateHelper } from "../../../helpers/dateHelper";
import { getUserIdFromToken } from "../../../helpers/getUserIdFromToken";
import NoActiveData from "../../../shared/components/NoActiveData/NoActiveData";

function GroupsList() {
  const { token } = useSelector((state) => state.auth);
  const userId = getUserIdFromToken(token);
  const { showModal, closeModal } = useModal();
  const { groupList } = useSelector((state) => state.groupList); // Fetch groupList from Redux store
  const { Group } = useSelector((state) => state.chat); // Fetch chat data from Redux store
  const location = window.location; // Access the current location.pathname

  // Add useState for search functionality
  const [searchGroup, setSearchGroup] = useState("");

  const handleNewGroup = () => {
    showModal(<NewGroupModal closeModal={closeModal} />); // Show modal to create new group
  };

  // Filter groupList based on searchGroup value
  const filteredGroupList = groupList
    ? Object.entries(groupList).filter(([groupId, group]) =>
      group.name.toLowerCase().includes(searchGroup.toLowerCase())
    )
    : [];

  return (
    <div className="group-list-box">
      <SearchInput
        placeholder={"Gruplarda aratın"}
        value={searchGroup}
        onChange={setSearchGroup}
      />
      <div>
        <button onClick={handleNewGroup} className="create-buttons">Yeni Grup Oluştur</button>
      </div>
      <div className="user-list">
        {filteredGroupList.length > 0 ? (
          filteredGroupList.map(([groupId, group]) => {
            const chatGroup = Group.find((groupChat) =>
              groupChat.participants.includes(groupId)
            );

            let lastMessage = "";
            let lastMessageType = "";
            if (chatGroup && chatGroup?.messages?.length > 0) {
              const lastMessageIndex = chatGroup.messages.length - 1;
              lastMessage = chatGroup.messages[lastMessageIndex].content;
              lastMessageType = chatGroup.messages[lastMessageIndex].type;
            }

            const lastMessageDate =
              chatGroup?.messages?.length > 0
                ? lastMessageDateHelper(
                  Object.values(chatGroup.messages[chatGroup.messages.length - 1].status.sent)[0]
                )
                : "";

            const currentGroupIdInPath = location.pathname.includes(groupId);

            const unReadMessage = !currentGroupIdInPath && chatGroup?.messages.filter((message) => {
              return (
                !Object.keys(message.status.sent).includes(userId) &&
                !message.status.read?.[userId]
              );
            }).length;

            return (
              <GroupChatCard
                key={groupId}
                groupId={chatGroup?.id}
                groupName={group.name}
                groupPhotoUrl={group.photoUrl}
                lastMessage={lastMessage}
                lastMessageType={lastMessageType}
                lastMessageDate={lastMessageDate}
                unReadMessage={unReadMessage}
                groupListId={groupId}
              />
            );
          })
        ) : (
          <NoActiveData text={searchGroup ? "Eşleşen grup bulunamadı" : "Aktif grup bulunmamaktadır."} />
        )}
      </div>
    </div>
  );
}

export default GroupsList;

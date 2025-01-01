import { useState } from "react";
import SearchInput from "./SearchInput";
import NewGroupModal from "../../../components/Groups/Components/NewAndSettingsGroup/NewGroupModal";
import { useModal } from "../../../contexts/ModalContext";
import { useSelector } from "react-redux";
import "./style.scss";
import GroupChatCard from "./GroupChatCard";
import { lastMessageDateHelper } from "../../../helpers/dateHelper";

function GroupsList() {
  const { showModal, closeModal } = useModal();
  const { groupList } = useSelector((state) => state.groupList); // Fetch groupList from Redux store
  const { Group } = useSelector((state) => state.chat); // Fetch chat data from Redux store

  const handleNewGroup = () => {
    showModal(<NewGroupModal closeModal={closeModal} />); // Show modal to create new group
  };

  console.log("Group List:", groupList);

  return (
    <div className="group-list-box">
      <SearchInput placeholder={"Gruplarda aratın"} />
      <div>
        <button onClick={handleNewGroup} className="create-buttons">Yeni Grup Oluştur</button>
      </div>
      <div className="user-list">
        {groupList && Object.entries(groupList).map(([groupId, group]) => {
          // Find the corresponding group in chat's Group data
          const chatGroup = Group.find((groupChat) =>
            groupChat.participants.includes(groupId) // Check if participants include the current groupId
          );

          // Get the last message from the chat group, if available
          let lastMessage = "";
          if (chatGroup && chatGroup?.messages?.length > 0) {
            const lastMessageIndex = chatGroup.messages.length - 1;
            lastMessage = chatGroup.messages[lastMessageIndex].content;
          }


          const lastMessageDate =
            chatGroup?.messages?.length > 0
              ? lastMessageDateHelper(
                Object.values(chatGroup.messages[chatGroup.messages.length - 1].status.sent)[0]
              )
              : "";

          return (
            <GroupChatCard
              key={groupId}
              groupId={chatGroup?.id || groupId} // Use the chat group ID if available
              groupName={group.name}
              groupPhotoUrl={group.photoUrl}
              lastMessage={lastMessage}
              lastMessageDate={lastMessageDate}
            />
          );
        })}
      </div>
    </div>
  );
}

export default GroupsList;

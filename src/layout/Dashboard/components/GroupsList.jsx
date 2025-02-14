import { useState } from "react";
import SearchInput from "./SearchInput";
import NewGroupModal from "../../../components/Groups/Components/NewAndSettingsGroup/NewAndSettingsGroupModal";
import { useModal } from "../../../contexts/ModalContext";
import { useSelector } from "react-redux";
import "./style.scss";
import GroupChatCard from "./GroupChatCard";
import { lastMessageDateHelper } from "../../../helpers/dateHelper";
import { getUserIdFromToken } from "../../../helpers/getUserIdFromToken";
import NoActiveData from "../../../shared/components/NoActiveData/NoActiveData";
import { motion } from 'framer-motion';
import { opacityEffect } from "../../../shared/animations/animations";
import useScreenWidth from "../../../hooks/useScreenWidth";
import { TbMessagePlus } from "react-icons/tb";

function GroupsList() {
  const { token } = useSelector((state) => state.auth);
  const userId = getUserIdFromToken(token);
  const { showModal, closeModal } = useModal();
  const { groupList } = useSelector((state) => state.groupList);
  const { Group } = useSelector((state) => state.chat);
  const location = window.location;
  const isSmallScreen = useScreenWidth(900);

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

      <button onClick={handleNewGroup} className="create-buttons">
        {isSmallScreen ? <TbMessagePlus /> : "Yeni Grup Oluştur"}
      </button>

      <div className="list-flex">
        <motion.div
          className="user-list"
          variants={opacityEffect(0.8)}  // Opacity animasyonunu container için uyguladık
          initial="initial"
          animate="animate"
        >
          {filteredGroupList.length > 0 ? (
            filteredGroupList
              .map(([groupId, group]) => {
                const chatGroup = Group.find((groupChat) =>
                  groupChat.participants.includes(groupId)
                );

                let lastMessage = "";
                let lastMessageType = "";
                let lastMessageDateForSort = 0;
                if (chatGroup && chatGroup?.messages?.length > 0) {
                  const lastMessageIndex = chatGroup.messages.length - 1;
                  lastMessage = chatGroup.messages[lastMessageIndex].content;
                  lastMessageType = chatGroup.messages[lastMessageIndex].type;

                  lastMessageDateForSort =
                    new Date(
                      Object.values(chatGroup.messages[lastMessageIndex].status.sent)[0]
                    ).getTime();
                }

                const currentGroupIdInPath = location.pathname.includes(groupId);

                const unReadMessage =
                  !currentGroupIdInPath &&
                  chatGroup?.messages.filter((message) => {
                    return (
                      !Object.keys(message.status.sent).includes(userId) &&
                      !message.status.read?.[userId]
                    );
                  }).length;

                return {
                  groupId,
                  groupName: group.name,
                  groupPhotoUrl: group.photoUrl,
                  lastMessage,
                  lastMessageType,
                  lastMessageDateForSort,
                  unReadMessage,
                  chatGroup
                };
              })
              .sort((a, b) => b.lastMessageDateForSort - a.lastMessageDateForSort)
              .map(({ groupId, groupName, groupPhotoUrl, lastMessage, lastMessageType, lastMessageDateForSort, unReadMessage, chatGroup }) => (
                <motion.div
                  key={groupId}
                  variants={opacityEffect(0.8)}
                  style={{ marginBottom: "10px" }}
                >
                  <GroupChatCard
                    key={groupId}
                    groupId={chatGroup?.id}
                    groupName={groupName}
                    groupPhotoUrl={groupPhotoUrl}
                    lastMessage={lastMessage}
                    lastMessageType={lastMessageType}
                    lastMessageDate={lastMessageDateHelper(lastMessageDateForSort)}
                    unReadMessage={unReadMessage}
                    groupListId={groupId}
                  />
                </motion.div>
              ))
          ) : (
            <NoActiveData text={searchGroup ? "Eşleşen grup bulunamadı" : "Aktif grup bulunmamaktadır."} />
          )}
        </motion.div>

      </div>
    </div>
  );
}

export default GroupsList;

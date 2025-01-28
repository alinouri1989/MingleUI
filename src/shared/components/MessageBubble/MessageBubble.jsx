import React, { useState } from 'react';
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { MdClose } from 'react-icons/md';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { LuCheck } from "react-icons/lu";
import { LuCheckCheck } from "react-icons/lu";
import { FaEarthAfrica } from "react-icons/fa6";
import './style.scss';
import { SuccessAlert } from '../../../helpers/customAlert';
import { useSelector } from 'react-redux';
import { useSignalR } from '../../../contexts/SignalRContext';
import { AudioMessage } from './components/AudioMessage';

function MessageBubble({ ChatId, userId, messageId, userColor, content, timestamp, isSender, status, messageType, isGroupMessageBubble, senderProfile }) {
    if (content == "") {
        return null;
    }

    const { Group } = useSelector((state) => state.chat);
    const { groupList } = useSelector((state) => state.groupList);
    const [anchorEl, setAnchorEl] = useState(null);
    const { chatConnection } = useSignalR();
    const [isShowImage, setIsShowImage] = useState(false);

    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = (deletionType) => {
        // public async Task DeleteMessage(string chatType, string chatId, string messageId, byte deletionType)
        let chatType;
        if (isGroupMessageBubble) {
            chatType = "Group";
        }
        else {
            chatType = "Individual";
        }
        try {
            chatConnection.invoke("DeleteMessage", chatType, ChatId, messageId, deletionType);
            SuccessAlert("Mesaj Silindi")
        } catch (error) {

        }
        handleClose();
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        SuccessAlert("Mesaj Kopyalandı")
        handleClose();
    };

    let statusIcon;
    let statusColor;

    // Aktif grup ID'sini window.location'dan al
    const groupIdFromLocation = window.location.pathname.includes("gruplar")
        ? window.location.pathname.split('/')[2]
        : null;

    if (!isGroupMessageBubble) {
        // Bireysel mesajlar için
        if (status.read && Object.keys(status.read).length > 0) {
            // Eğer mesaj okunduysa
            statusIcon = <LuCheckCheck />;
            statusColor = "#585CE1"; // Mavi (Okundu)
        } else if (status.delivered && Object.keys(status.delivered).length > 0) {
            // Eğer mesaj teslim edildiyse
            statusIcon = <LuCheckCheck />;
            statusColor = "#828A96"; // Gri (Teslim Edildi)
        } else if (status.sent && status.sent[userId]) {
            // Eğer mesaj gönderildiyse
            statusIcon = <LuCheck />;
            statusColor = "#828A96"; // Gri (Gönderildi)
        } else {
            // Durum yoksa
            statusIcon = <FaEarthAfrica />;
            statusColor = "#828A96"; // Varsayılan gri
        }
    } else {
        // Grup mesajları için
        const chatGroup = Group.find(group => group.id === groupIdFromLocation);
        if (chatGroup) {
            const participantKeys = chatGroup.participants;
            const groupInfo = groupList[participantKeys];
            const groupParticipants = groupInfo?.participants || {};

            const totalParticipants = Object.keys(groupParticipants).length;
            const readCount = Object.keys(status.read || {}).filter(userId =>
                Object.keys(groupParticipants).includes(userId)
            ).length;

            const deliverCount = Object.keys(status.delivered || {}).filter(userId =>
                Object.keys(groupParticipants).includes(userId)
            ).length;

            // Eğer tüm katılımcılar (mesaj gönderen hariç) okuduysa
            if (readCount === totalParticipants - 1) {
                statusIcon = <LuCheckCheck />;
                statusColor = "#585CE1"; // Mavi (Okundu)
            } else if (deliverCount === totalParticipants - 1) {
                statusIcon = <LuCheckCheck />;
                statusColor = "#828A96"; // Gri (Kısmen okundu)
            } else if (status.sent && status.sent[userId]) {
                statusIcon = <LuCheck />;
                statusColor = "#828A96"; // Gri (Gönderildi)
            } else {
                statusIcon = <FaEarthAfrica />;
                statusColor = "#828A96"; // Varsayılan gri
            }
        } else {
            // Grup bulunamazsa
            statusIcon = <FaEarthAfrica />;
            statusColor = "#828A96"; // Varsayılan gri
        }
    }


    // 



    const TextMessage = ({ content }) => <p>{content}</p>;

    const ImageMessage = ({ content, setIsShowImage }) => (
        <div onClick={() => setIsShowImage(true)}>
            <img src={content} alt="" />
        </div>
    );

    const UserInfo = ({ displayName, userColor, messageType }) => (
        <div className='user-info' style={{ color: userColor }}>
            <p className={`sender-profile-name ${messageType === 0 ? 'text' : 'other'}`}>
                {displayName}
            </p>
        </div>
    );

    const renderMessageContent = (messageType, content, setIsShowImage) => {
        switch (messageType) {
            case 0:
                return <TextMessage content={content} />;
            case 1:
                return <ImageMessage content={content} setIsShowImage={setIsShowImage} />;
            case 3:
                return <AudioMessage content={content} />;
            default:
                return <p>Unsupported message type</p>;
        }
    };

    return (
        <div className={"message-bubble-box"}>

            <div className={`message-box ${isSender ? 'sender' : 'receiver'}`} >
                {isGroupMessageBubble &&
                    !isSender &&

                    <div className='image-box'>
                        <img src={senderProfile?.profilePhoto} alt="" />
                    </div>
                }
                <div
                    className={`message-content 
                    ${messageType === 0 ? 'text' :
                            messageType === 3 && isGroupMessageBubble && isSender ? 'audio-group-sender' :
                                messageType === 3 && isGroupMessageBubble ? 'audio-group' :
                                    messageType === 3 ? 'audio' : 'image'}`}
                >
                    {!isSender && (
                        <UserInfo
                            displayName={senderProfile?.displayName}
                            userColor={userColor}
                            messageType={messageType}
                        />
                    )}

                    {renderMessageContent(messageType, content, setIsShowImage)}
                </div>


                <div className='message-hour'>
                    {timestamp}
                </div>

                {isSender && (
                    <div className='option'>
                        <IconButton
                            aria-label="more"
                            id="long-button"
                            aria-controls={open ? "long-menu" : undefined}
                            aria-expanded={open ? "true" : undefined}
                            aria-haspopup="true"
                            onClick={handleClick}
                        >
                            <MoreHorizIcon />
                        </IconButton>
                        <Menu
                            id="long-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                "aria-labelledby": "long-button",
                            }}
                            slotProps={{
                                paper: {
                                    style: {
                                        maxHeight: 48 * 3,
                                        width: "18ch",
                                        borderRadius: "8px",
                                        border: "4px solid #CFD5F2",
                                        fontWeight: "bold",
                                        boxShadow: "none",
                                    },
                                },
                            }}
                        >
                            <MenuItem
                                onClick={() => handleDelete(0)}
                                sx={{ color: "#EB6262" }}
                            >
                                <ListItemIcon sx={{ color: "inherit" }}>
                                    <DeleteOutlineRoundedIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Benden sil"
                                    primaryTypographyProps={{
                                        fontFamily: "Montserrat",
                                        fontWeight: "700",
                                        fontSize: "14px",
                                    }}
                                />
                            </MenuItem>

                            <MenuItem
                                onClick={() => handleDelete(1)}
                                sx={{ color: "#EB6262" }}
                            >
                                <ListItemIcon sx={{ color: "inherit" }}>
                                    <DeleteIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Herkesten sil"
                                    primaryTypographyProps={{
                                        fontFamily: "Montserrat",
                                        fontWeight: "700",
                                        fontSize: "14px",
                                    }}
                                />
                            </MenuItem>

                            {messageType === 0 &&
                                <MenuItem
                                    onClick={handleCopy}
                                    sx={{ color: "#585CE1" }}
                                >
                                    <ListItemIcon fontSize={"small"} sx={{ color: "inherit" }}>
                                        <ContentCopyIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Kopyala"
                                        primaryTypographyProps={{
                                            fontFamily: "Montserrat",
                                            fontWeight: "700",
                                            fontSize: "14px",
                                        }}
                                    />
                                </MenuItem>
                            }
                        </Menu>
                    </div>
                )}
            </div>

            {isSender && (
                <div className='status-box' style={{ color: statusColor }}>
                    {statusIcon}
                </div>
            )}

            {isShowImage &&
                <div className="full-size-image-box">
                    <img src={content} alt="selected-image" />
                    <button onClick={() => setIsShowImage(false)}>
                        <MdClose />
                    </button>
                </div>
            }
        </div>
    );
}

export default MessageBubble;

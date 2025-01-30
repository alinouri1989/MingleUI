import React, { useEffect, useState } from 'react';
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { MdClose } from 'react-icons/md';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteIcon from '@mui/icons-material/Delete';
import { FaFileAlt } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";

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

function MessageBubble({ ChatId, userId, messageId, userColor, content, isDeleted, timestamp, isSender, status, messageType, isGroupMessageBubble, senderProfile }) {
    if (content == "" || isDeleted) {
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

    const TextMessage = ({ content }) => <p>{content}</p>;

    const ImageMessage = ({ content, setIsShowImage }) => (
        <div onClick={() => setIsShowImage(true)}>
            <img src={content} alt="" />
        </div>
    );

    const VideoMessage = ({ content }) => (
        <div>
            <video
                src={content}
                controls // Video kontrol düğmelerini ekler (oynat, durdur, ses ayarı vb.)
                style={{ maxWidth: "100%", borderRadius: "8px" }} // İsteğe bağlı stil
            >
                Tarayıcınız video elementini desteklemiyor.
            </video>
        </div>
    );

    const FileMessage = ({ content }) => {
        const [fileInfo, setFileInfo] = useState({
            fileName: '',
            fileExtension: '',
            fileSize: '',
            contentType: '',
        });

        useEffect(() => {
            const fetchFileInfo = async (url) => {
                try {
                    // HEAD isteği gönderiyoruz
                    const response = await fetch(url, { method: 'HEAD' });

                    if (response.ok) {
                        // MIME türünü alıyoruz
                        const contentType = response.headers.get('Content-Type');
                        const fileSize = response.headers.get('Content-Length'); // Dosyanın boyutu
                        const fileName = url.split('/').pop(); // URL'den dosya adı
                        const fileExtension = fileName.split('.').pop(); // Dosya uzantısı

                        setFileInfo({
                            fileName,
                            fileExtension,
                            fileSize: fileSize ? `${(fileSize / 1024).toFixed(2)} KB` : 'N/A', // KB cinsinden boyut
                            contentType: contentType || 'N/A',
                        });
                    }
                } catch (error) {
                    console.error('Dosya bilgileri alınamadı:', error);
                }
            };

            if (content) {
                fetchFileInfo(content);
            }
        }, [content]);

        return (
            <div className="file-message-container">
                <div className='file-info-box'>
                    <FaFileAlt />
                    <div className='file-info'>
                        <span>Dosya</span>
                        <p>{fileInfo.fileSize}</p>
                    </div>
                </div>
                <button className='download-file-button'><FiDownload /></button>
                {/* <p><strong>Dosya Adı:</strong> {fileInfo.fileName}</p>
                <p><strong>Uzantı:</strong> {fileInfo.fileExtension}</p> */}
            </div>
        );
    };

    const UserInfo = ({ displayName, userColor, messageType }) => (
        <div className='user-info' style={{ color: userColor }}>
            <p className={`sender-profile-name ${messageType === 0 ? 'text' : messageType === 1 ? 'image' : 'other'}`}>
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
            case 2:
                return <VideoMessage content={content} setIsShowImage={setIsShowImage} />;
            case 3:
                return <AudioMessage content={content} />;
            case 4:
                return <FileMessage content={content} />;
            default:
                return <p>Unsupported message type</p>;
        }
    };

    const getMessageContentClass = (messageType, isGroupMessageBubble, isSender) => {
        switch (messageType) {
            case 0:
                return 'text';
            case 2:
                if (isGroupMessageBubble && isSender) return 'group-sender';
                if (isGroupMessageBubble) return 'group';
                return 'video';
            case 3:
                if (isGroupMessageBubble && isSender) return 'group-sender';
                if (isGroupMessageBubble) return 'group';
                return 'audio';
            case 4:
                if (isGroupMessageBubble && isSender) return 'group-sender';
                if (isGroupMessageBubble) return 'group';
                return 'file';
            default:
                return 'image';
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
                    className={`message-content ${getMessageContentClass(
                        messageType,
                        isGroupMessageBubble,
                        isSender
                    )}`}
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

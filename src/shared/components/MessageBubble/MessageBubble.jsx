import React, { useState } from 'react';
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
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

function MessageBubble({ userId, userColor, content, timestamp, isSender, status, messageType, isGroupMessageBubble, senderProfile }) {


    const { Group } = useSelector((state) => state.chat);
    const { groupList } = useSelector((state) => state.groupList);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = () => {
        SuccessAlert("Mesaj Silindi")
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


    return (
        <div className={"message-bubble-box"}>

            <div className={`message-box ${isSender ? 'sender' : 'receiver'}`} >
                {isGroupMessageBubble &&
                    !isSender &&

                    <div className='image-box'>
                        <img src={senderProfile?.profilePhoto} alt="" />
                    </div>
                }


                <div className='message-content'>
                    {!isSender &&
                        <div className='user-info' style={{ color: userColor }}>
                            <p>{senderProfile?.displayName}</p>
                        </div>
                    }

                    {messageType === 0
                        ? <p>{content}</p>
                        : <img className='image' src={content} alt="" />
                    }
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
                                onClick={handleDelete}
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
                                onClick={handleDelete}
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
        </div>
    );
}

export default MessageBubble;

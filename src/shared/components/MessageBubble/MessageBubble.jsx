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

import './style.scss';
import { ErrorAlert, SuccessAlert } from '../../../helpers/customAlert';

function MessageBubble({ userId, content, timestamp, isSender, status, profileImage, userName, messageType, isGroupMessageBubble }) {

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

    if (status.read && status.read[userId]) {
        // Eğer mesaj okunduysa
        statusIcon = <LuCheckCheck />;
        statusColor = "#585CE1"; // Mavi (Okundu)
    } else if (status.delivered && status.delivered[userId]) {
        // Eğer mesaj teslim edildiyse
        statusIcon = <LuCheckCheck />;
        statusColor = "#828A96"; // Gri (Teslim Edildi)
    } else if (status.sent && status.sent[userId]) {
        // Eğer mesaj gönderildiyse
        statusIcon = <LuCheck />;
        statusColor = "#828A96"; // Gri (Gönderildi)
    } else {
        // Durum yoksa (Invalid)
        statusIcon = <LuCheck />;
        statusColor = "#828A96"; // Varsayılan gri
    }

    return (
        <div className={"message-bubble-box"}>

            <div className={`message-box ${isSender ? 'sender' : 'receiver'}`} >
                {isGroupMessageBubble &&
                    !isSender &&

                    <div className='image-box'>
                        <img src={profileImage} alt="" />
                    </div>
                }


                <div className='message-content'>
                    {!isSender &&
                        <div className='user-info'>
                            <p>{userName}</p>
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

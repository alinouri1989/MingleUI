import React, { useState } from 'react';
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteIcon from '@mui/icons-material/Delete';
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { LuCheck } from "react-icons/lu";
import { LuCheckCheck } from "react-icons/lu";

import './style.scss';

function MessageBubble({ text, timestamp, isSender, status }) {

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = () => {
        alert("Silindi");
        handleClose();
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        handleClose();
    };

    let statusIcon;
    let statusColor;

    if (status === "sent") {
        statusIcon = <LuCheck />;
        statusColor = "#828A96";  // "Sent" için gri renk
    } else if (status === "delivered" || status === "read") {
        statusIcon = <LuCheckCheck />;
        statusColor = status === "read" ? "#585CE1" : "#828A96";  // "Read" için mavi, "Delivered" için gri
    }

    return (
        <div className={"message-bubble-box"}>
            <div className={`message-box ${isSender ? 'sender' : 'receiver'}`}>
                <div className='message-text'>
                    <p>{text}</p>
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
                                        maxHeight: 48 * 2,
                                        width: "16ch",
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
                                    <DeleteIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Sil"
                                    primaryTypographyProps={{
                                        fontFamily: "Montserrat",
                                        fontWeight: "700",
                                        fontSize: "14px",
                                    }}
                                />
                            </MenuItem>

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

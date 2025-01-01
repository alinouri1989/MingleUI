import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import { useLeaveGroupMutation } from "../../../store/Slices/Group/GroupApi.js";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import GroupRemoveIcon from "@mui/icons-material/GroupRemove";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { defaultGroupPhoto } from "../../../constants/DefaultProfilePhoto.js";
import "./style.scss";
import { useNavigate } from "react-router-dom";

function GroupChatCard({ groupId, groupName, groupPhotoUrl, lastMessage, createdDate, lastMessageDate }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const [leaveGroup, { isLoading: leaveLoading }] = useLeaveGroupMutation();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLeaveGroup = async () => {
        try {
            await leaveGroup(groupId).unwrap();
            // SuccessAlert("Gruptan Çıktın") // Implement or replace with actual alert logic
            closeModal(); // closeModal logic needs to be passed or managed outside the component
        } catch (error) {
            // ErrorAlert("Bir hata meydana geldi") // Implement or replace with actual error handling
        }
    };

    const handleGoGroupChat = () => {
        navigate(`/gruplar/${groupId}`);
    }

    return (
        <div key={groupId} onClick={handleGoGroupChat} className="group-dashboard-card-box">
            <div className="image-box">
                <img src={defaultGroupPhoto} alt={`${groupName} profile`} />
                {/* Şimdilik Default olan */}
            </div>

            <div className="grup-name-and-sub-title">
                <p>{groupName}</p>
                <span>{lastMessage || "Henüz mesaj yok"}</span>
            </div>

            <div className="status-informations-box">
                <span>{lastMessageDate}</span>
                {/* Optional unread message count */}
                {/* {group.unReadMessage > 0 && <p>{group.unReadMessage}</p>} */}
            </div>

            <div className="option">
                <IconButton
                    aria-label="more"
                    id="long-button"
                    aria-controls={open ? "long-menu" : undefined}
                    aria-expanded={open ? "true" : undefined}
                    aria-haspopup="true"
                    onClick={handleClick}
                >
                    <MoreVertIcon />
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
                                padding: "0px",
                                borderRadius: "8px",
                                border: "4px solid #CFD5F2",
                                fontWeight: "bold",
                                boxShadow: "none",
                            },
                        },
                    }}
                >
                    <MenuItem
                        onClick={handleLeaveGroup}
                        sx={{ color: "#EB6262", boxShadow: "none" }}
                    >
                        <ListItemIcon>
                            <GroupRemoveIcon fontSize="medium" sx={{ color: "#EB6262" }} />
                        </ListItemIcon>
                        <ListItemText
                            primary="Gruptan Çık"
                            primaryTypographyProps={{
                                fontFamily: "Montserrat",
                                fontWeight: "700",
                                fontSize: "14px",
                            }}
                        />
                    </MenuItem>
                </Menu>
            </div>
        </div>
    );
}

export default GroupChatCard;

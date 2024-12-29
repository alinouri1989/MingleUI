import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import ArchiveIcon from "@mui/icons-material/Archive";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { getChatId } from "../../../store/Slices/chats/chatSlice";
import { getUserIdFromToken } from "../../../helpers/getUserIdFromToken";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function UserChatCard({ userId, image, status, name, lastMessageDate, lastMessage, lastDate, unReadMessage, isArchive }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector(state => state.auth);
  const chatState = useSelector(state => state.chat);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleArchive = () => {
    console.log("Arşive eklendi");
    handleClose();
  };

  const handleRemoveFromArchive = () => {
    console.log("Arşivden çıkarıldı");
    handleClose();
  };

  const handleGoChat = () => {
    // Use `chatState` from Redux store and call `getChatId` with `authId` and `userId`
    const chatId = getChatId(chatState, getUserIdFromToken(token), userId);
    navigate(`/sohbetler/${chatId}`);
  };

  return (
    <div className="user-dashboard-card-box" onClick={() => handleGoChat()}>

      <div className="image-box">
        <img src={image} alt={`${name} profile`} />
        <p className={`status ${status ? "online" : "offline"}`}></p>
      </div>

      <div className="user-name-and-sub-title">
        <p>{name}</p>
        <span>{lastMessage}</span>
      </div>

      <div className="status-informations-box">
        <span>{lastMessageDate}</span>
        {unReadMessage > 0 && <p>{unReadMessage}</p>}
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
                borderRadius: "8px",
                border: "4px solid #CFD5F2",
                fontWeight: "bold",
                boxShadow: "none"
              },
            },
          }}
        >
          <MenuItem
            onClick={() => {
              handleClose();
            }}
            sx={{ color: "#EB6262" }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="medium" sx={{ color: "#EB6262" }} />
            </ListItemIcon>
            <ListItemText
              primary="Sil"
              primaryTypographyProps={{
                fontFamily: "Montserrat",
                fontWeight: "700",
                fontSize: "15px"
              }}
            />
          </MenuItem>
          {isArchive ? (
            <MenuItem
              onClick={handleRemoveFromArchive}
              sx={{ color: "#585CE1" }}
            >
              <ListItemIcon >
                <UnarchiveIcon fontSize="medium" sx={{ color: "#585CE1" }} />
              </ListItemIcon>
              <ListItemText
                primary="Çıkar"
                primaryTypographyProps={{
                  fontFamily: "Montserrat",
                  fontWeight: "700",
                  fontSize: "15px"
                }}
              />
            </MenuItem>
          ) : (
            <MenuItem
              onClick={handleArchive}
              sx={{ color: "#585CE1" }}
            >
              <ListItemIcon>
                <ArchiveIcon fontSize="medium" sx={{ color: "#585CE1" }} />
              </ListItemIcon>
              <ListItemText
                primary="Arşivle"
                primaryTypographyProps={{
                  fontFamily: "Montserrat",
                  fontWeight: "700",
                  fontSize: "15px"
                }}
              />
            </MenuItem>
          )}
        </Menu>
      </div>
    </div>
  );
}

export default UserChatCard;

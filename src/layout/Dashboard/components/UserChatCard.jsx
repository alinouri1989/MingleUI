import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import ArchiveIcon from "@mui/icons-material/Archive";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import { LuImage } from "react-icons/lu";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { getChatId } from "../../../store/Slices/chats/chatSlice";
import { getUserIdFromToken } from "../../../helpers/getUserIdFromToken";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useSignalR } from "../../../contexts/SignalRContext";
import { ErrorAlert, SuccessAlert } from "../../../helpers/customAlert";

function UserChatCard({ receiverId, image, status, name, lastMessageDate, lastMessageType, lastMessage, lastDate, unReadMessage, isArchive }) {

  const [anchorEl, setAnchorEl] = useState(null);
  const { chatConnection } = useSignalR();
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { token } = useSelector(state => state.auth);
  const chatState = useSelector(state => state.chat);

  const chatId = getChatId(chatState, getUserIdFromToken(token), receiverId);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddArchive = async () => {
    try {
      await chatConnection.invoke("ArchiveChat", chatId);
      SuccessAlert("Arşive Eklendi");
      if (location.pathname.includes(chatId)) {
        navigate("/sohbetler");
      }
    } catch {
      ErrorAlert("Arşive Eklenemedi");
    }
    handleClose();
  };

  const handleRemoveFromArchive = async () => {
    try {
      await chatConnection.invoke("UnarchiveChat", chatId);
      SuccessAlert("Arşivden Çıkarıldı");
      if (location.pathname.includes(chatId)) {
        navigate("/arsivler");
      }
    } catch {
      ErrorAlert("Arşivden Çıkarılamadı");
    }
    handleClose();
  };

  const handleGoChat = () => {
    isArchive ? navigate(`/arsivler/${chatId}`) : navigate(`/sohbetler/${chatId}`)
  };

  return (
    <div className="user-dashboard-card-box" onClick={() => handleGoChat()}>

      <div className="image-box">
        <img src={image} alt={`${name} profile`} />
        <p className={`status ${status ? "online" : "offline"}`}></p>
      </div>

      <div className="user-name-and-sub-title">
        <p>{name}</p>
        {lastMessageType === 1
          ? <div className="last-message-image">
            <LuImage />
            <span>Fotoğraf</span>
          </div>
          : <span>{lastMessage}</span>
        }
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
              onClick={handleAddArchive}
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

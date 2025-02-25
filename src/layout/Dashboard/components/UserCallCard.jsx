import { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useSignalR } from "../../../contexts/SignalRContext";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import { formatTimeHoursMinutes } from "../../../helpers/dateHelper";
import { SuccessAlert, ErrorAlert } from "../../../helpers/customAlert";
import CallCardCallStatus from "../../../shared/components/CallStatus/CallCardCallStatus";

function UserCallCard({ callId, image, status, name, callType, callStatus, createdDate, isOutgoingCall }) {

  const { callConnection } = useSignalR();
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const { user } = useSelector(state => state.auth);

  const isDarkMode = user?.userSettings?.theme == "Dark";

  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    handleClose();
    try {
      await callConnection.invoke("DeleteCall", callId);
      SuccessAlert("Arama Kaydı Silindi");
    } catch {
      ErrorAlert("Arama Kaydı Silinemedi");
    }
  };

  const userStatus = status == "0001-01-01T00:00:00" ? 'online' : 'offline';

  const handleGoToCall = () => {
    navigate(`/aramalar/${callId}`);
  }

  const isActiveCall = location.pathname.includes(callId);

  return (
    <div className={`user-dashboard-card-box ${isActiveCall ? "active-call" : ""}`} onClick={handleGoToCall}>
      <div className="card-info-box">

        <div className="image-box">
          <img src={image} alt={`${name} profile`} />
          <p className={`status ${userStatus}`}></p>
        </div>

        <div className="user-name-and-sub-title">
          <p>{name}</p>
          <CallCardCallStatus callStatus={callStatus} callType={callType} isOutgoingCall={isOutgoingCall} />
        </div>
      </div>

      <div className="date-and-options-box">
        <div className="status-informations-box">
          <span>{formatTimeHoursMinutes(createdDate)}</span>
        </div>
        <div className="option">
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={open ? "long-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="true"
            onClick={(event) => {
              event.stopPropagation();
              handleClick(event);
            }}
            sx={{
              color: isDarkMode ? "#616161" : "#828A96",
            }}
          >
            <MoreVertIcon />
          </IconButton>

          <Menu
            id="long-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={(event) => {
              event.stopPropagation();
              handleClose(event);
            }}
            MenuListProps={{
              "aria-labelledby": "long-button",
            }}
            slotProps={{
              paper: {
                style: {
                  maxHeight: 48 * 2,
                  width: "16ch",
                  borderRadius: "8px",
                  border: `4px solid ${isDarkMode ? "#222430" : "#CFD5F2"}`,
                  fontWeight: "bold",
                  backgroundColor: isDarkMode ? "#18191A" : "#FFFFFF",
                  color: isDarkMode ? "#E4E6EB" : "#000000",
                  boxShadow: "none"
                },
              },
            }}
          >
            <MenuItem
              onClick={(event) => {
                event.stopPropagation();
                handleDelete();
              }}
              sx={{ color: "#EB6262", boxShadow: "none" }}
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
          </Menu>
        </div>
      </div>
    </div>
  );
}

export default UserCallCard;

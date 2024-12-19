import React, { useState } from "react";
import { VscCallOutgoing } from "react-icons/vsc";
import { VscCallIncoming } from "react-icons/vsc";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

function UserCallCard({ image, status, name, callStatus, lastDate }) {

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    console.log("Arama kaydı silindi");
    handleClose();
  };

  const renderCallStatus = () => {
    let icon = null;
    let color = "#595959";
    let text = "";

    switch (callStatus) {
      case "incomingCall":
        icon = <VscCallIncoming className="icon" />;
        text = "Gelen";
        break;
      case "unAnsweredIncomingCall":
        icon = <VscCallIncoming className="icon" />;
        text = "Cevapsız";
        color = "#EB6262";
        break;
      case "outgoingCall":
        icon = <VscCallOutgoing className="icon" />;
        text = "Giden";
        break;
      case "unAnsweredOutgoingCall":
        icon = <VscCallOutgoing className="icon" />;
        text = "Cevapsız";
        color = "#EB6262";
        break;
      default:
        text = "";
        break;
    }

    return (
      <span className="call-status-span" style={{ color: color, display: "flex", alignItems: "center", gap: "5px" }}>
        {icon}
        {text}
      </span>
    );
  };

  return (
    <div className="user-dashboard-card-box">
      <div className="image-box">
        <img src={image} alt={`${name} profile`} />
        <p className={`status ${status}`}></p>
      </div>

      <div className="user-name-and-sub-title">
        <p>{name}</p>
        {renderCallStatus()}
      </div>

      <div className="status-informations-box">
        <span>{lastDate}</span>
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
            onClick={handleDelete}
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
  );
}

export default UserCallCard;

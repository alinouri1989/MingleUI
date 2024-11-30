import { useState } from "react";
import SearchInput from "./SearchInput";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import GroupRemoveIcon from "@mui/icons-material/GroupRemove";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import NewGroupModal from "../../../components/Groups/Components/NewGroup/NewGroupModal";
import { useModal } from "../../../contexts/ModalContext.jsx";
import "./style.scss";

const groups = [
  {
    id: 1,
    image: "https://randomuser.me/api/portraits/men/47.jpg",
    groupName: "Bilgisayar Ağları",
    lastMessage: "Sınav başarılı geç...",
    lastDate: "16:20",
    unReadMessage: 3,
  },
  {
    id: 2,
    image: "https://randomuser.me/api/portraits/women/11.jpg",
    groupName: "Mingle Grup",
    lastMessage: "Toplantı saat kaçta?",
    lastDate: "15:00",
    unReadMessage: 1,
  },
  {
    id: 3,
    image: "https://randomuser.me/api/portraits/men/24.jpg",
    groupName: "Erasmus Plus",
    lastMessage: "Yarın görüşelim mi?",
    lastDate: "14:45",
    unReadMessage: 2,
  },
  {
    id: 4,
    image: "https://randomuser.me/api/portraits/women/18.jpg",
    groupName: "KYK GRUP",
    lastMessage: "Dosyayı gönderdim.",
    lastDate: "13:30",
    unReadMessage: 0,
  }
];


function GroupsList() {

  const { showModal, closeModal } = useModal();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  const handleLeaveGroup = () => {
    console.log("Gruptan Çıkıldı");
    handleClose();
  };

  const handleNewGroup = () => {
    showModal(<NewGroupModal closeModal={closeModal} />)
  }

  return (
    <div className="group-list-box">
      <SearchInput placeholder={"Gruplarda aratın"} />
      <div>
        <button onClick={handleNewGroup} className="create-buttons">Yeni Grup Oluştur</button>
      </div>
      <div className="user-list">
        {groups.map((group) => (
          <div key={group.id} className="group-dashboard-card-box">
            <div className="image-box">
              <img src={group.image} alt={`${group.name} profile`} />
            </div>

            <div className="grup-name-and-sub-title">
              <p>{group.groupName}</p>
              <span>{group.lastMessage}</span>
            </div>

            <div className="status-informations-box">
              <span>{group.lastDate}</span>
              {group.unReadMessage > 0 && <p>{group.unReadMessage}</p>}
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
                      boxShadow: "none"
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
                      fontSize: "14px"
                    }}
                  />
                </MenuItem>
              </Menu>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GroupsList
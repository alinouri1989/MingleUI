import MessageInputBar from "../../shared/components/MessageInputBar/MessageInputBar";
import WelcomeScreen from "../WelcomeScreen/WelcomeScreen";
import { PiPhoneFill } from "react-icons/pi";
import { HiMiniVideoCamera } from "react-icons/hi2";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { IoIosArrowDroprightCircle } from "react-icons/io";

import "./style.scss";
import { useState } from "react";

// Props ile kullanıcıyı alıcak. ya da url ile id üzerinden kullanıcı bilgisni alıcak hub durumu felan şimdilik statik

function Chats() {

  // Sidebar açık/kapalı durumu için state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const userName = "Okan Doğan"
  const status = "online"

  return (
    <>
      <div className='chat-general-box'>
        {/* <WelcomeScreen text={"Kişisel sohbetleriniz uçtan uca şifrelidir"}/> */}

        <div className={`user-top-bar ${isSidebarOpen ? 'close' : ''}`}>
          <div className="user-info">
            <div className="image-box">
              <img src="https://randomuser.me/api/portraits/men/1.jpg" alt={`${userName} profile`} />
              <p className={`status ${status}`}></p>
            </div>
            <div className="name-and-status-box">
              <p className="user-name">{userName}</p>
              <span>{status == "online" ? "Çevrimiçi" : "Çevrimdışı"}</span>
            </div>
          </div>

          <div className="top-bar-buttons">
            <div className='call-options'>
              <button><PiPhoneFill /></button>
              <button><HiMiniVideoCamera /></button>
            </div>
            <IoIosArrowDropleftCircle
              className="sidebar-toggle-buttons"
              onClick={toggleSidebar}
            />
          </div>
        </div>

        <div className="user-message-bar">

        </div>
        <MessageInputBar />
      </div>


      <div className={`user-details-sidebar ${isSidebarOpen ? "open" : ""}`}>
        {isSidebarOpen &&
          <>

            <IoIosArrowDroprightCircle
              className="sidebar-toggle-buttons"
              onClick={toggleSidebar}
            />

            <h2>Kullanıcı Detayları</h2>
            <p>Bu alanı istediğiniz gibi doldurabilirsiniz.</p>
          </>
        }
      </div>


    </>

  )
}

export default Chats
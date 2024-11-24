import MessageInputBar from "../../shared/components/MessageInputBar/MessageInputBar";
import WelcomeScreen from "../WelcomeScreen/WelcomeScreen";
import { PiPhoneFill } from "react-icons/pi";
import { HiMiniVideoCamera } from "react-icons/hi2";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowDropleftCircle } from "react-icons/io";

import "./style.scss";

// Props ile kullanıcıyı alıcak. ya da url ile id üzerinden kullanıcı bilgisni alıcak hub durumu felan şimdilik statik

function Chats() {

  const userName = "Okan Doğan"
  const status = "online"

  return (
    <div className='chat-general-box'>
      {/* <WelcomeScreen text={"Kişisel sohbetleriniz uçtan uca şifrelidir"}/> */}

      <div className="user-top-bar">
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
          <IoIosArrowDropleftCircle className="show-sidebar-button" />
        </div>
      </div>
      <div className="user-message-bar">

      </div>
      <MessageInputBar />
      {/* <div className="user-details-sidebar">

      </div> */}
    </div>
  )
}

export default Chats
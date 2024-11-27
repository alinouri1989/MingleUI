import React from 'react'
import WelcomeScreen from '../WelcomeScreen/WelcomeScreen'
import { IoChatbubbleEllipses } from "react-icons/io5";
import { PiPhoneFill } from "react-icons/pi";
import { HiMiniVideoCamera } from "react-icons/hi2";
import { useModal } from "../../contexts/ModalContext.jsx";

import "./style.scss";
import CallModal from './Components/CallModal';

function Calls() {

  const { showModal, closeModal } = useModal();

  const callStatus = "unAnsweredIncomingCall";
  let callStatusText = "";
  let callStatusColor = "#828A96";
  let icon = <PiPhoneFill className='icon' />;

  switch (callStatus) {
    case "incomingCall":
      callStatusText = "Gelen sesli arama";
      break;
    case "unAnsweredIncomingCall":
      callStatusText = "Cevapsız sesli arama";
      callStatusColor = "#EB6262";
      break;
    case "outgoingCall":
      callStatusText = "Giden sesli arama";
      break;
    case "unAnsweredOutgoingCall":
      callStatusText = "Cevapsız sesli arama";
      callStatusColor = "#EB6262";
      break;
    default:
      callStatusText = "Bilinmiyor";
      break;
  }

  // Handlers

  const handleVoiceCall = () => {
    showModal(<CallModal closeModal={closeModal} />);
  }

  return (
    <div className='calls-general-box'>
      {/* <WelcomeScreen text="Kişisel aramalarınız uçtan uca şifrelidir" /> */}

      <div className='call-info-bar-box'>
        <h2>Arama Bilgisi</h2>
        <div className='details-box'>
          <div className='user-and-call-box'>
            <div className='user-info'>
              <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="" />
              <p>Okan Doğan</p>
            </div>
            <div className='call-options'>
              <button><IoChatbubbleEllipses /></button>
              <button onClick={handleVoiceCall}><PiPhoneFill /></button>
              <button><HiMiniVideoCamera /></button>
            </div>
          </div>
          <div className='call-details'>
            <span>23.11.2024</span>
            <div className='status-box'>
              <div className='call-status-box' style={{ color: callStatusColor }}>
                {icon}
                <p>{callStatusText} 12:00</p>
              </div>
              <p>10 dakika 25 saniye</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calls;

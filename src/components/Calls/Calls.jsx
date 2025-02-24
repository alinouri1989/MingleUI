import React, { useEffect } from 'react'
import WelcomeScreen from '../WelcomeScreen/WelcomeScreen'
import { IoChatbubbleEllipses } from "react-icons/io5";
import { PiPhoneFill } from "react-icons/pi";
import { HiMiniVideoCamera } from "react-icons/hi2";
import { useModal } from "../../contexts/ModalContext.jsx";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserIdFromToken } from '../../helpers/getUserIdFromToken.js';
import CallModal from './Components/CallModal';
import { formatDateToTR } from '../../helpers/dateHelper.js';
import { useSignalR } from '../../contexts/SignalRContext.jsx';
import { setIsCallStarting } from '../../store/Slices/calls/callSlice.js';
import { getChatId } from '../../store/Slices/chats/chatSlice.js';
import CallStatus from '../../shared/components/CallStatus/CallStatus.jsx';
import useScreenWidth from '../../hooks/useScreenWidth.js';
import BackToMenuButton from '../../shared/components/BackToMenuButton/BackToMenuButton.jsx';
import { opacityEffect } from "../../shared/animations/animations.js"
import "./style.scss";

import { motion } from 'framer-motion';

function Calls() {
  const { id } = useParams();
  const { showModal, closeModal } = useModal();
  const { callConnection } = useSignalR();
  const { token } = useSelector(state => state.auth);
  const state = useSelector(state => state.chat);
  const userId = getUserIdFromToken(token);
  const isSmallScreen = useScreenWidth(540);

  const { calls, callRecipientList, isInitialCallsReady, isRingingIncoming } = useSelector(state => state.call);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentCall = calls.find(call => call.id === id);

  useEffect(() => {
    if (isInitialCallsReady && !currentCall) {
      navigate("/aramalar");
    }
  }, [isInitialCallsReady, currentCall, navigate]);

  if (!currentCall) {
    return <>{!id ? <div className="calls-general-box">
      <WelcomeScreen text="Kişisel aramalarınız uçtan uca şifrelidir" />
    </div> : null}</>;
  }

  const { participants, type, status, callDuration, createdDate } = currentCall;
  const otherParticipantId = participants?.find(participant => participant !== userId);
  const participantInfo = callRecipientList?.find(recipient => recipient.id === otherParticipantId);

  const { displayName, profilePhoto } = participantInfo || {};

  const handleVoiceCall = async () => {
    if (callConnection) {
      try {
        await callConnection.invoke("StartCall", otherParticipantId, 0);
        dispatch(setIsCallStarting(true));
        showModal(<CallModal closeModal={closeModal} isCameraCall={false} />);
      } catch (error) {
        console.error("Error starting voice call:", error);
      }
    }
  };

  const handleVideoCall = async () => {
    if (callConnection) {
      try {
        await callConnection.invoke("StartCall", otherParticipantId, 1);
        dispatch(setIsCallStarting(true));
        showModal(<CallModal closeModal={closeModal} isCameraCall={true} />);
      } catch (error) {
        console.error("Error starting video call:", error);
      }
    }
  }

  const handleGoIndividualChat = () => {
    const chatId = getChatId(state, userId, otherParticipantId);
    const chatData = Object.values(state.Individual).find(chat => chat.id === chatId);
    const isArchived = chatData.archivedFor?.hasOwnProperty(userId);
    const destination = isArchived ? `/arsivler/${chatId}` : `/sohbetler/${chatId}`;
    navigate(destination);
  };

  return (
    <motion.div
      className="calls-general-box"
      variants={opacityEffect()}
      initial="initial"
      animate="animate"
      transition="transition"
    >
      {id &&
        <div className="call-info-bar-box">
          <div className='title-and-back-box'>
            <BackToMenuButton path={"aramalar"} />
            <h2>Arama Bilgisi</h2>
          </div>
          <div className="details-box">
            <div className="user-and-call-box">
              <div className="user-info">
                <img src={profilePhoto} alt="" />
                <p>{displayName}</p>
              </div>
              <div className="call-options">
                <button onClick={handleGoIndividualChat}><IoChatbubbleEllipses />{isSmallScreen && <span>Mesaj</span>}</button>
                <button
                  disabled={isRingingIncoming}
                  style={{ opacity: isRingingIncoming ? "0.6" : "1" }}
                  onClick={handleVoiceCall}><PiPhoneFill />{isSmallScreen && <span>Sesli</span>}
                </button>

                <button
                  disabled={isRingingIncoming}
                  style={{ opacity: isRingingIncoming ? "0.6" : "1" }}
                  onClick={handleVideoCall}><HiMiniVideoCamera />{isSmallScreen && <span>Görüntülü</span>}
                </button>
              </div>
            </div>
            <div className="call-details">
              <span>{formatDateToTR(createdDate)}</span>
              <CallStatus status={status} type={type} userId={userId} participants={participants} callDuration={callDuration} createdDate={createdDate} />
            </div>
          </div>
        </div>
      }
    </motion.div>
  );
}

export default Calls;
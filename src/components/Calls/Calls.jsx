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
import { formatCallDuration, formatDateToTR, formatTimeHoursMinutes } from '../../helpers/dateHelper.js';
import { useSignalR } from '../../contexts/SignalRContext.jsx';
import { setIsCallStarting } from '../../store/Slices/calls/callSlice.js';
import "./style.scss";

function Calls() {
  const { id } = useParams();
  const { showModal, closeModal } = useModal();
  const { callConnection } = useSignalR();
  const { token } = useSelector(state => state.auth); // Token'ı al
  const userId = getUserIdFromToken(token); // Token'dan userId'yi al

  const { calls, callRecipientList, isInitialCallsReady } = useSelector(state => state.call);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // id'ye göre çağrı bilgilerini al
  const currentCall = calls.find(call => call.id === id);

  // Eğer isInitialCallsReady true ise ve currentCall yoksa yönlendirme yap
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

  const { displayName, profilePhoto, lastConnectionDate } = participantInfo || {};

  let callStatusText = "";
  let callStatusColor = "#828A96";
  let icon = type === 0 ? <PiPhoneFill className="icon" /> : <HiMiniVideoCamera className="icon" />;

  // Giden ve Gelen Arama Kontrolü
  const isOutgoingCall = participants?.[0] === userId; // İlk participant, userId ise giden çağrı

  switch (status) {
    case 1:
      if (isOutgoingCall) {
        callStatusText = type === 1 ? "Giden video arama" : "Giden sesli arama";
      } else {
        callStatusText = type === 1 ? "Gelen video arama" : "Gelen sesli arama";
      }
      icon = type === 0 ? <PiPhoneFill className="icon" /> : <HiMiniVideoCamera className="icon" />;
      break;
    case 2:
      callStatusText = "Meşgul";
      callStatusColor = "#EB6262";
      break;
    case 3:
      callStatusText = "İptal Edildi";
      break;
    case 4:
      if (isOutgoingCall) {
        callStatusText = "Giden cevapsız arama";
      } else {
        callStatusText = "Gelen cevapsız arama";
      }
      callStatusColor = "#EB6262";
      icon = type === 0 ? <PiPhoneFill className="icon" /> : <HiMiniVideoCamera className="icon" />;
      break;
    default:
      callStatusText = "Bilinmiyor";
      break;
  }

  // Formatlama
  const formattedDuration = callDuration ? `Arama Süresi: ${formatCallDuration(callDuration)}` : "Cevaplanmadı";

  // Handlers
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

  return (
    <div className="calls-general-box">
      {id &&
        <div className="call-info-bar-box">
          <h2>Arama Bilgisi</h2>
          <div className="details-box">
            <div className="user-and-call-box">
              <div className="user-info">
                <img src={profilePhoto} alt="" />
                <p>{displayName}</p>
              </div>
              <div className="call-options">
                <button><IoChatbubbleEllipses /></button>
                <button onClick={handleVoiceCall}><PiPhoneFill /></button>
                <button onClick={handleVideoCall}><HiMiniVideoCamera /></button>
              </div>
            </div>
            <div className="call-details">
              <span>{formatDateToTR(createdDate)}</span>
              <div className="status-box">
                <div className="call-status-box" style={{ color: callStatusColor }}>
                  {icon}
                  <p>{callStatusText} {formatTimeHoursMinutes(createdDate)}</p>
                </div>
                <p>{formattedDuration}</p>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
}

export default Calls;
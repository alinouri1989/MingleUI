import { VscCallOutgoing, VscCallIncoming } from "react-icons/vsc";
import { HiMiniVideoCamera } from "react-icons/hi2";
import { TbVideoMinus } from "react-icons/tb";
import { RiVideoDownloadFill } from "react-icons/ri";
import { RiVideoUploadFill } from "react-icons/ri";
import { PiPhoneFill } from "react-icons/pi";

const CallCardCallStatus = ({ callStatus, callType, isOutgoingCall }) => {
    let icon = null;
    let color = "#828A96";
    let text = "";

    switch (callStatus) {
        case 1:
            if (callType === 0) {
                if (isOutgoingCall) {
                    icon = <VscCallOutgoing className="icon" />;
                    text = "Giden Arama";
                } else {
                    icon = <VscCallIncoming className="icon" />;
                    text = "Gelen Arama";
                }
            } else if (callType === 1) {
                if (isOutgoingCall) {
                    icon = <RiVideoUploadFill className="icon" />;
                    text = "Giden Arama";
                } else {
                    icon = <RiVideoDownloadFill className="icon" />;
                    text = "Gelen Arama";
                }
            }
            break;

        case 2:
            text = "Meşgul";
            color = "#EB6262";
            if (callType === 0) {
                icon = isOutgoingCall ? <VscCallOutgoing className="icon" /> : <VscCallIncoming className="icon" />;
            } else if (callType === 1) {
                icon = <HiMiniVideoCamera className="icon" />;
            }
            break;

        case 3:
            text = "İptal Edildi";
            color = "#EB6262";
            icon = callType === 1 ? <TbVideoMinus className="icon" /> : <PiPhoneFill />;
            break;

        case 4:
            text = "Cevapsız";
            color = "#EB6262";
            if (callType === 0) {
                icon = isOutgoingCall ? <VscCallOutgoing className="icon" /> : <VscCallIncoming className="icon" />;
            } else if (callType === 1) {
                icon = isOutgoingCall ? <RiVideoUploadFill className="icon" /> : <RiVideoDownloadFill className="icon" />;
            }
            break;

        default:
            text = "Bilinmeyen";
            break;
    }

    return (
        <span
            className="call-status-span"
            style={{ color: color, display: "flex", alignItems: "center", gap: "5px" }}
        >
            {icon}
            {text}
        </span>
    );
};

export default CallCardCallStatus;

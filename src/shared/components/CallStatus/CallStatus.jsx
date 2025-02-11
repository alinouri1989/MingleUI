import React from "react";
import { PiPhoneFill } from "react-icons/pi";
import { HiMiniVideoCamera } from "react-icons/hi2";
import { formatCallDuration, formatTimeHoursMinutes } from "../../../helpers/dateHelper";

const CallStatus = ({ status, type, userId, participants, callDuration, createdDate }) => {
    let callStatusText = "";
    let callStatusColor = "#828A96";
    let icon = type === 0 ? <PiPhoneFill className="icon" /> : <HiMiniVideoCamera className="icon" />;

    const isOutgoingCall = participants?.[0] === userId;

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
            icon = type === 0 ? <PiPhoneFill className="icon" /> : <HiMiniVideoCamera className="icon" />;
            callStatusColor = "#EB6262";
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

    const formattedDuration = callDuration ? `Arama Süresi: ${formatCallDuration(callDuration)}` : "Cevaplanmadı";

    return (
        <div className="status-box">
            <div className="call-status-box" style={{ color: callStatusColor }}>
                {icon}
                <p>{callStatusText} {formatTimeHoursMinutes(createdDate)}</p>
            </div>
            <p>{formattedDuration}</p>
        </div>
    );
};

export default CallStatus;

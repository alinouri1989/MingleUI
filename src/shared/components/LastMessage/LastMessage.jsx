import { LuImage } from 'react-icons/lu'; // Fotoğraf simgesi
import { BiSolidMicrophone } from 'react-icons/bi'; // Mikrofon simgesi
import { LuFileVideo } from "react-icons/lu";
import { FaFileAlt } from "react-icons/fa";

const LastMessage = ({ lastMessageType, content }) => {
    const renderContent = () => {
        switch (lastMessageType) {
            case 0:
                return <span>{content}</span>;
            case 1:
                return (
                    <div className="last-message-image">
                        <LuImage />
                        <span>Fotoğraf</span>
                    </div>
                );
            case 2:
                return (
                    <div className="last-message-video">
                        <LuFileVideo />
                        <span>Video</span>
                    </div>
                );
            case 3:
                return (
                    <div className="last-message-audio">
                        <BiSolidMicrophone />
                        <span>Ses</span>
                    </div>
                );
            case 4:
                return (
                    <div className="last-message-file">
                        <FaFileAlt />
                        <span>Dosya</span>
                    </div>
                );
            default:
                return null;
        }
    };

    return <>{renderContent()}</>;
};

export default LastMessage;

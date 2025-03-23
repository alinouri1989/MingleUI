import { useSelector } from "react-redux";
import { createContext, useContext, useState, useEffect } from "react";
import IncomingCall from "../components/Calls/Components/IncomingCall/IncomingCall";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modalContent, setModalContent] = useState(null);
  const { isRingingIncoming, callType, callerProfile, callId } = useSelector((state) => state.call);

  const showModal = (content) => {
    setModalContent(content);
    window.history.pushState({ modalOpen: true }, ""); // URL değiştirmeden state ekle
  };

  const closeModal = () => {
    setModalContent(null);
    if (window.history.state && window.history.state.modalOpen) {
      window.history.back();
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      if (modalContent) {
        closeModal();
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [modalContent]);

  return (
    <ModalContext.Provider value={{ modalContent, showModal, closeModal }}>
      {children}
      {modalContent && (
        <div className="modal-overlay">
          <div className="modal-card">{modalContent}</div>
        </div>
      )}
      {isRingingIncoming && <IncomingCall callType={callType} callId={callId} callerProfile={callerProfile} />}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);

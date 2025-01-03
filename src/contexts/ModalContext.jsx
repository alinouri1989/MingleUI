import React, { createContext, useContext, useState } from 'react';
import { MdClose } from 'react-icons/md';
import IncomingCall from '../components/Calls/Components/IncomingCall/IncomingCall';
import { useSelector } from 'react-redux';
const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modalContent, setModalContent] = useState(null);

  const { isRingingIncoming, callType, callerProfile } = useSelector((state) => state.call);

  const showModal = (content) => {
    setModalContent(content);
  };

  const closeModal = () => {
    setModalContent(null);
  };

  return (
    <ModalContext.Provider value={{ modalContent, showModal, closeModal }}>
      {children}
      {modalContent && (
        <div className="modal-overlay">
          <div className="modal-card">
            {modalContent}
          </div>
        </div>
      )}
      {isRingingIncoming && <IncomingCall callType={callType} callerProfile={callerProfile} />}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
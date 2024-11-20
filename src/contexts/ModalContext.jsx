import React, { createContext, useContext, useState } from 'react';
import { MdClose } from 'react-icons/md';  // React icon çarpı simgesi

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modalContent, setModalContent] = useState(null);

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
            <button className="modal-close" onClick={closeModal}>
              <MdClose />
            </button>
            {modalContent}
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);

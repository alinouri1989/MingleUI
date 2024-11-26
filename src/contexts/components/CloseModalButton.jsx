import React from 'react'
import { MdClose } from 'react-icons/md';

function CloseModalButton({ closeModal }) {
    return (
        <button className="modal-close" onClick={closeModal}>
            <MdClose />
        </button>
    )
}

export default CloseModalButton
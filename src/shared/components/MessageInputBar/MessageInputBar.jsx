import React from 'react'
import { HiPlus } from "react-icons/hi";
import { MdOutlineEmojiEmotions } from "react-icons/md";

import "./style.scss";
function MessageInputBar() {
    return (
        <div className='message-input-bar'>
            <div className='input-box'>
                <div className='add-file-box'>
                    <button className='add-file-button'>
                        <HiPlus />
                    </button>
                </div>
                <input type="text" placeholder='Bir mesaj yazın' />
                <div className='emoji-and-send-buttons'>
                    <button className='add-emoji-button'>
                        <MdOutlineEmojiEmotions />
                    </button>
                    <button className='send-message-button'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 27 27" fill="none">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M3.82724 7.50691C3.53474 4.88116 6.23812 2.95291 8.62649 4.08466L22.0635 10.4499C24.6375 11.6683 24.6375 15.3313 22.0635 16.5497L8.62649 22.916C6.23812 24.0478 3.53587 22.1195 3.82724 19.4938L4.36724 14.6248H13.5C13.7984 14.6248 14.0845 14.5063 14.2955 14.2953C14.5065 14.0843 14.625 13.7982 14.625 13.4998C14.625 13.2014 14.5065 12.9153 14.2955 12.7043C14.0845 12.4933 13.7984 12.3748 13.5 12.3748H4.36837L3.82724 7.50691Z" fill="white" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MessageInputBar
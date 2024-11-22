import React from "react";

function UserMessageCard({ image, status, name, lastMessage, lastDate, unReadMessage }) {
  return (
    <div className="user-message-card-box">
      <div className="image-box">
        <img src={image} alt={`${name} profile`} />
        <p className={`status ${status}`}></p>
      </div>

      <div className="user-name-and-message">
        <p>{name}</p>
        <span>{lastMessage}</span>
      </div>
      <div className="message-informations-box">
        <span>{lastDate}</span>
        {unReadMessage > 0 && <p>{unReadMessage}</p>}
      </div>
    </div>
  );
}

export default UserMessageCard;

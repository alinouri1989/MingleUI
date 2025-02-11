import { useState } from "react";
import WelcomeScreen from "../WelcomeScreen/WelcomeScreen";

import UserTopBar from "../Chats/Components/UserTopBar";
import UserMessageBar from "../Chats/Components/UserMessageBar";
import MessageInputBar from "../../shared/components/MessageInputBar/MessageInputBar";
import "../layout.scss";
import UserDetailsBar from "../Chats/Components/UserDetailsBar";
import { useParams } from "react-router-dom";


function Archives() {
  const { id } = useParams();
  return (
    <>
      <div className='archive-general-box'>
        {!id && <WelcomeScreen text={"Kişisel arşivleriniz uçtan uca şifrelidir"} />}
      </div>
    </>

  )
}

export default Archives;
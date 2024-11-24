import WelcomeScreen from "../WelcomeScreen/WelcomeScreen";
import "./style.scss";

function Chats() {
  return (
    <div className='chat-general-box'>
      <WelcomeScreen text={"Kişisel sohbetleriniz uçtan uca şifrelidir"}/>
    </div>
  )
}

export default Chats
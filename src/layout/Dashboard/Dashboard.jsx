import "./style.scss";
import UserImage from "../../assets/users/hamza.png";
import ChatsList from "./components/ChatsList";

function Dashboard() {
    return (
        <div className='dashboard-container'>
            <div className="user-info-box">
                <img src={UserImage} alt="Kullanıcı Resmi" />
                <p>Hamza Doğan</p>
            </div>
            <div className="dynamic-list-box">
               <ChatsList/>
            </div>
        </div>
    )
}

export default Dashboard
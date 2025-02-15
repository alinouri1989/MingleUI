import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import "./style.scss";

const BackToMenuButton = ({ path }) => {
    const navigate = useNavigate();
    return (
        <button className='back-to-menu-btn' onClick={() => navigate(`/${path}`)}>
            <IoMdArrowRoundBack />
        </button>
    )
}

export default BackToMenuButton


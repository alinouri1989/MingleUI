import Logo from "../../assets/logos/MingleLogoWithText.svg";
import { IoMdSettings } from "react-icons/io";
import { useModal } from "../../contexts/ModalContext";
import SettingsModal from "../../components/Settings/SettingsModal";
import "./style.scss";

function Header() {

  const { showModal, closeModal } = useModal();

  const handleSettings = () => {
    showModal(<SettingsModal closeModal={closeModal} />);
  };

  return (
    <header>
      <img src={Logo} alt="" />
      <button onClick={handleSettings}><IoMdSettings /></button>
    </header>
  )
}

export default Header
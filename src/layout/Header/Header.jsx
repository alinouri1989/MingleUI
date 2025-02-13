import Logo from "../../assets/logos/MingleLogoWithText.svg";
import { IoMdSettings } from "react-icons/io";
import "./style.scss";
import { useModal } from "../../contexts/ModalContext";
import SettingsModal from "../../components/Settings/SettingsModal";
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
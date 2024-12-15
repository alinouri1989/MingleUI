import "./style.scss"
import MingleLogo from "../../../assets/logos/MingleLogoWithText.svg"
function MinglePreLoader() {
    return (
        <div className="loading-container">
            <img src={MingleLogo} alt="" />
            <div className="progress-bar">
                <div className="progress"></div>
            </div>
        </div>
    )
}

export default MinglePreLoader
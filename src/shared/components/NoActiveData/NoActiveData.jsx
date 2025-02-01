import "./style.scss"
import NoData from "../../../assets/images/Home/noData.webp";

function NoActiveData({ text }) {
    return (
        <div className="no-active-datas">
            <img src={NoData} alt="" />
            <p>{text}</p>
        </div>
    )
}

export default NoActiveData
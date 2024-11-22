import { BiSearchAlt } from "react-icons/bi";
import "./style.scss";

const SearchInput = ({ placeholder, value, onChange }) => {
    return (
        <div className="search-input-box">
            <div className="icon-box">
                <BiSearchAlt className="icon" />
            </div>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="search-input"
            />
        </div>
    );
};

export default SearchInput;
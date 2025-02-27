import MingleLogo from "../../../assets/logos/MingleLogoWithText.webp";
import { motion } from "framer-motion";
import "./style.scss";

function MinglePreLoader() {
    return (
        <motion.div
            className="loading-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
        >
            <img src={MingleLogo} alt="" />
            <div className="progress-bar">
                <div className="progress"></div>
            </div>
        </motion.div>
    );
}

export default MinglePreLoader;

export const opacityEffect = (duration = 0.8) => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration }
});

import { useLocation } from 'react-router-dom';
import SignVector from "../../assets/images/Sign/SignVector.webp";

import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import ResetPassword from './components/ResetPassword';

import { motion } from "framer-motion";

import "./style.scss";
import { opacityEffect } from '../../shared/animations/animations.js';

function Sign() {
    const location = useLocation();

    const renderComponent = () => {
        if (location.pathname === "/sifre-yenile") {
            return <ResetPassword />;
        } else if (location.pathname === "/uye-ol") {
            return <SignUp />;
        } else {
            return <SignIn />;
        }
    };

    return (
        <div className='sign-general-box'>
            <div className='sign-bar'>
                {renderComponent()}
            </div>
            <div className='banner-bar'>
                <motion.div
                    {...opacityEffect()}
                    className='banner-bar-container'>
                    <h1>کاملاً از گپ زدن لذت ببرید</h1>
                    <img src={SignVector} alt="ChatNest vector illustration" />
                    <p>ChatNest</p>
                </motion.div>
            </div>
        </div>
    );
}

export default Sign;
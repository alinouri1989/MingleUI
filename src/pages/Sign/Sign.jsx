import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SignVector from "../../assets/images/Sign/SignVector.svg";

import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import ResetPassword from './components/ResetPassword';

import "./style.scss";

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
                <div className='banner-bar-container'>
                    <h1>Doyasıya Sohbetin Keyfini Çıkar</h1>
                    <img src={SignVector} alt="" />
                    <p>Mingle</p>
                </div>
            </div>
        </div>
    );
}

export default Sign;

import React from 'react';
import SignVector from "../../assets/images/Sign/SignVector.svg";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import "./style.scss";
import ResetPassword from './components/ResetPassword';


// Sign-bar koşullu rota olarak gibi outlet olacak sign ve sign bilgisine göre renderleyecek
function Sign() {
    return (
        <div className='sign-general-box'>
            <div className='sign-bar'>
                <SignUp />

            </div>
            <div className='banner-bar'>
                <div className='banner-bar-container'>
                    <h1>
                        Doyasıya Sohbetin Keyfini Çıkar
                    </h1>
                    <img src={SignVector} alt="" />
                    <p>Mingle</p>
                </div>
            </div>
        </div>
    );
}

export default Sign;

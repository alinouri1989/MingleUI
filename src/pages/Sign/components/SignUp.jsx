
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../../assets/logos/ChatNestLogoWithText.webp";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from '../../../schemas/SignSchemas.js';

import { useModal } from "../../../contexts/ModalContext";
import { useRegisterUserMutation } from "../../../store/Slices/auth/authApi.js";

import { Controller } from "react-hook-form";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from 'react-datepicker';
import tr from 'date-fns/locale/tr';

import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";

import { ErrorAlert, SuccessAlert } from "../../../helpers/customAlert.js"
import MembershipModal from "./MembershipModal";
import PreLoader from "../../../shared/components/PreLoader/PreLoader.jsx";

import { opacityEffect } from '../../../shared/animations/animations.js';
import { motion } from "framer-motion";

registerLocale('tr', tr);

function SignUp() {

  const navigate = useNavigate();
  const { showModal } = useModal();

  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [showAgainPassword, setShowAgainPassword] = useState(false);
  const [isMembershipAgreementAccepted, setIsMembershipAgreementAccepted] = useState(false);

  const { register, handleSubmit, formState: { errors, isValid }, control } = useForm({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
  });

  const isFormValid = isValid && isMembershipAgreementAccepted;
  const today = new Date();

  const handleKeyPressForBirthDate = (e) => {
    const allowedKeys = [
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-',
      'Backspace', 'Delete',
      'ArrowLeft', 'ArrowRight'
    ];
    if (!allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  const onSubmit = async (data) => {
    if (isFormValid) {
      try {
        await registerUser(data).unwrap();
        SuccessAlert("Hesap Oluşturuldu");
        navigate('/giris-yap');

      } catch (error) {
        ErrorAlert(error.data.message);
      }
    }
    else {
      ErrorAlert("Tüm alanlar dolmalıdır");
    }
  };

  const handleMembershipAgreementModal = () => {
    showModal(<MembershipModal />);
  };

  return (
    <motion.div
      {...opacityEffect()}
      className='sign-up-general-container'>
      <img src={Logo} alt="" />

      <div className='title-container'>
        <h1>Hesap Oluştur</h1>
        <p>Kolayca hesap oluştur, sohbete hemen başla</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='inputs-container'>
          <div className='input-box'>
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="26" viewBox="0 0 25 26" fill="none">
              <path d="M2.08333 25.9639C2.08333 25.9639 0 25.9639 0 23.8805C0 21.7972 2.08333 15.5472 12.5 15.5472C22.9167 15.5472 25 21.7972 25 23.8805C25 25.9639 22.9167 25.9639 22.9167 25.9639H2.08333ZM12.5 13.4639C14.1576 13.4639 15.7473 12.8054 16.9194 11.6333C18.0915 10.4612 18.75 8.87147 18.75 7.21387C18.75 5.55626 18.0915 3.96655 16.9194 2.79445C15.7473 1.62235 14.1576 0.963867 12.5 0.963867C10.8424 0.963867 9.25268 1.62235 8.08058 2.79445C6.90848 3.96655 6.25 5.55626 6.25 7.21387C6.25 8.87147 6.90848 10.4612 8.08058 11.6333C9.25268 12.8054 10.8424 13.4639 12.5 13.4639Z" fill="#828A96" />
            </svg>
            <input
              {...register("DisplayName")}
              type="text"
              placeholder='Ad Soyad' />
          </div>
          {errors.DisplayName && <span className="error-message">{errors.DisplayName.message}</span>}

          <div className='input-box'>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 30 30" fill="none">
              <path d="M4.125 6.82565V21.3257C4.125 21.8064 4.31596 22.2674 4.65587 22.6073C4.99578 22.9472 5.45679 23.1382 5.9375 23.1382H24.0625C24.5432 23.1382 25.0042 22.9472 25.3441 22.6073C25.684 22.2674 25.875 21.8064 25.875 21.3257V6.82565H4.125ZM4.125 5.01315H25.875C26.3557 5.01315 26.8167 5.20411 27.1566 5.54402C27.4965 5.88393 27.6875 6.34495 27.6875 6.82565V21.3257C27.6875 22.2871 27.3056 23.2091 26.6258 23.8889C25.9459 24.5687 25.0239 24.9507 24.0625 24.9507H5.9375C4.97609 24.9507 4.05406 24.5687 3.37424 23.8889C2.69442 23.2091 2.3125 22.2871 2.3125 21.3257V6.82565C2.3125 6.34495 2.50346 5.88393 2.84337 5.54402C3.18328 5.20411 3.6443 5.01315 4.125 5.01315Z" fill="#828A96" />
              <path d="M26.1016 6.82565L19.0926 14.8369C18.5823 15.4203 17.9531 15.8879 17.2472 16.2083C16.5413 16.5286 15.7752 16.6943 15 16.6943C14.2248 16.6943 13.4587 16.5286 12.7528 16.2083C12.0469 15.8879 11.4177 15.4203 10.9074 14.8369L3.89844 6.82565H26.1016ZM6.30725 6.82565L12.2704 13.6425C12.6106 14.0315 13.0301 14.3433 13.5008 14.557C13.9714 14.7706 14.4822 14.8811 14.9991 14.8811C15.5159 14.8811 16.0268 14.7706 16.4974 14.557C16.9681 14.3433 17.3876 14.0315 17.7278 13.6425L23.6927 6.82565H6.30725Z" fill="#828A96" />
            </svg>
            <input
              {...register("Email")}
              type="email"
              placeholder='E-mail' />
          </div>
          {errors.Email && <span className="error-message">{errors.Email.message}</span>}


          <div className='input-box password'>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 30 30" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M8.95832 8.94023C8.95832 5.60281 11.6626 2.89856 15 2.89856C18.3374 2.89856 21.0417 5.60281 21.0417 8.94023V12.5652H21.525C22.5883 12.5652 23.4583 13.4352 23.4583 14.4986V22.9569C23.4583 24.5519 22.1533 25.8569 20.5583 25.8569H9.44166C7.84666 25.8569 6.54166 24.5519 6.54166 22.9569V14.4986C6.54166 13.4352 7.41166 12.5652 8.47499 12.5652H8.95832V8.94023ZM18.625 8.94023V12.5652H11.375V8.94023C11.375 6.93681 12.9966 5.31523 15 5.31523C17.0034 5.31523 18.625 6.93681 18.625 8.94023ZM15 15.284C14.5195 15.2835 14.0531 15.4466 13.6778 15.7466C13.3024 16.0466 13.0403 16.4654 12.9348 16.9342C12.8293 17.403 12.8866 17.8937 13.0972 18.3256C13.3079 18.7575 13.6594 19.1047 14.0937 19.3101V22.2319C14.0937 22.4722 14.1892 22.7028 14.3592 22.8727C14.5291 23.0427 14.7596 23.1381 15 23.1381C15.2403 23.1381 15.4708 23.0427 15.6408 22.8727C15.8108 22.7028 15.9062 22.4722 15.9062 22.2319V19.3101C16.3406 19.1047 16.6921 18.7575 16.9027 18.3256C17.1134 17.8937 17.1707 17.403 17.0652 16.9342C16.9596 16.4654 16.6976 16.0466 16.3222 15.7466C15.9468 15.4466 15.4805 15.2835 15 15.284Z" fill="#828A96" />
              </svg>
              <input
                {...register("Password")}
                type={showPassword ? "text" : "password"}
                placeholder='Şifre' />
            </div>
            {showPassword
              ? <IoEyeOff className='icon' onClick={() => setShowPassword(!showPassword)} />
              : <IoEye className='icon' onClick={() => setShowPassword(!showPassword)} />
            }
          </div>
          {errors.Password && <span className="error-message">{errors.Password.message}</span>}

          <div className='input-box password'>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="29" height="30" viewBox="0 0 29 30" fill="none">
                <path d="M14.5 3.38052C21.1736 3.38052 26.5833 8.79023 26.5833 15.4639C26.5833 18.0449 25.7737 20.4374 24.395 22.4009L20.5416 15.4639H24.1666C24.1664 13.2359 23.3967 11.0765 21.9876 9.35077C20.5785 7.62506 18.6166 6.43905 16.4337 5.99337C14.2508 5.5477 11.981 5.86971 10.0082 6.90495C8.03541 7.94019 6.48076 9.62508 5.60726 11.6746C4.73375 13.7242 4.59502 16.0125 5.21451 18.1526C5.83401 20.2926 7.1737 22.153 9.00697 23.419C10.8402 24.685 13.0545 25.2789 15.2753 25.1002C17.496 24.9215 19.5869 23.9812 21.1941 22.4384L22.4 24.6073C20.2072 26.5076 17.4016 27.5516 14.5 27.5472C7.82633 27.5472 2.41663 22.1375 2.41663 15.4639C2.41663 8.79023 7.82633 3.38052 14.5 3.38052ZM14.5 9.42219C15.4614 9.42219 16.3834 9.80411 17.0632 10.4839C17.743 11.1637 18.125 12.0858 18.125 13.0472V14.2555H19.3333V20.2972H9.66663V14.2555H10.875V13.0472C10.875 12.0858 11.2569 11.1637 11.9367 10.4839C12.6165 9.80411 13.5386 9.42219 14.5 9.42219ZM14.5 11.8389C14.204 11.8389 13.9183 11.9476 13.6972 12.1442C13.476 12.3409 13.3347 12.6119 13.3001 12.9058L13.2916 13.0472V14.2555H15.7083V13.0472C15.7083 12.7512 15.5996 12.4656 15.4029 12.2444C15.2063 12.0232 14.9353 11.8819 14.6413 11.8473L14.5 11.8389Z" fill="#828A96" />
              </svg>
              <input
                {...register("PasswordAgain")}
                type={showAgainPassword ? "text" : "password"}
                placeholder='Şifre Tekrar' />
            </div>

            {showAgainPassword
              ? <IoEyeOff className='icon' onClick={() => setShowAgainPassword(!showAgainPassword)} />
              : <IoEye className='icon' onClick={() => setShowAgainPassword(!showAgainPassword)} />
            }
          </div>
          {errors.PasswordAgain && <span className="error-message">{errors.PasswordAgain.message}</span>}

          <div className='input-box'>
            <svg xmlns="http://www.w3.org/2000/svg" width="29" height="30" viewBox="0 0 29 30" fill="none">
              <g clipPath="url(#clip0_389_407)">
                <path d="M25.9792 5.79721H23.3612V7.40832H25.7778V25.1305H3.22228V7.40832H5.63895V5.79721H3.02089C2.83258 5.80036 2.64674 5.84057 2.47397 5.91555C2.30121 5.99054 2.14491 6.09882 2.014 6.23422C1.88309 6.36962 1.78013 6.52948 1.71101 6.70467C1.6419 6.87986 1.60797 7.06696 1.61117 7.25527V25.2836C1.60797 25.4719 1.6419 25.659 1.71101 25.8342C1.78013 26.0094 1.88309 26.1693 2.014 26.3046C2.14491 26.44 2.30121 26.5483 2.47397 26.6233C2.64674 26.6983 2.83258 26.7385 3.02089 26.7417H25.9792C26.1675 26.7385 26.3534 26.6983 26.5261 26.6233C26.6989 26.5483 26.8552 26.44 26.9861 26.3046C27.117 26.1693 27.22 26.0094 27.2891 25.8342C27.3582 25.659 27.3921 25.4719 27.3889 25.2836V7.25527C27.3921 7.06696 27.3582 6.87986 27.2891 6.70467C27.22 6.52948 27.117 6.36962 26.9861 6.23422C26.8552 6.09882 26.6989 5.99054 26.5261 5.91555C26.3534 5.84057 26.1675 5.80036 25.9792 5.79721Z" fill="#828A96" />
                <path d="M6.44446 12.2416H8.05557V13.8527H6.44446V12.2416Z" fill="#828A96" />
                <path d="M11.2778 12.2416H12.8889V13.8527H11.2778V12.2416Z" fill="#828A96" />
                <path d="M16.1111 12.2416H17.7222V13.8527H16.1111V12.2416Z" fill="#828A96" />
                <path d="M20.9445 12.2416H22.5556V13.8527H20.9445V12.2416Z" fill="#828A96" />
                <path d="M6.44446 16.2694H8.05557V17.8805H6.44446V16.2694Z" fill="#828A96" />
                <path d="M11.2778 16.2694H12.8889V17.8805H11.2778V16.2694Z" fill="#828A96" />
                <path d="M16.1111 16.2694H17.7222V17.8805H16.1111V16.2694Z" fill="#828A96" />
                <path d="M20.9445 16.2694H22.5556V17.8805H20.9445V16.2694Z" fill="#828A96" />
                <path d="M6.44446 20.2972H8.05557V21.9083H6.44446V20.2972Z" fill="#828A96" />
                <path d="M11.2778 20.2972H12.8889V21.9083H11.2778V20.2972Z" fill="#828A96" />
                <path d="M16.1111 20.2972H17.7222V21.9083H16.1111V20.2972Z" fill="#828A96" />
                <path d="M20.9445 20.2972H22.5556V21.9083H20.9445V20.2972Z" fill="#828A96" />
                <path d="M8.05556 9.01943C8.2692 9.01943 8.4741 8.93456 8.62517 8.78348C8.77624 8.63241 8.86111 8.42752 8.86111 8.21387V3.38054C8.86111 3.16689 8.77624 2.96199 8.62517 2.81092C8.4741 2.65985 8.2692 2.57498 8.05556 2.57498C7.84191 2.57498 7.63701 2.65985 7.48594 2.81092C7.33487 2.96199 7.25 3.16689 7.25 3.38054V8.21387C7.25 8.42752 7.33487 8.63241 7.48594 8.78348C7.63701 8.93456 7.84191 9.01943 8.05556 9.01943Z" fill="#828A96" />
                <path d="M20.9445 9.01943C21.1581 9.01943 21.363 8.93456 21.5141 8.78348C21.6652 8.63241 21.75 8.42752 21.75 8.21387V3.38054C21.75 3.16689 21.6652 2.96199 21.5141 2.81092C21.363 2.65985 21.1581 2.57498 20.9445 2.57498C20.7308 2.57498 20.5259 2.65985 20.3749 2.81092C20.2238 2.96199 20.1389 3.16689 20.1389 3.38054V8.21387C20.1389 8.42752 20.2238 8.63241 20.3749 8.78348C20.5259 8.93456 20.7308 9.01943 20.9445 9.01943Z" fill="#828A96" />
                <path d="M10.4722 5.79721H18.5277V7.40832H10.4722V5.79721Z" fill="#828A96" />
              </g>
              <defs>
                <clipPath id="clip0_389_407">
                  <rect width="29" height="29" fill="white" transform="translate(0 0.963867)" />
                </clipPath>
              </defs>
            </svg>
            <Controller
              name="BirthDate"
              control={control}
              rules={{ required: "Doğum tarihi zorunludur" }}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  selected={field.value ? new Date(field.value) : null}
                  onChange={(date) => field.onChange(date)}
                  dateFormat="dd-MM-yyyy"
                  placeholderText="Doğum Tarihi"
                  required
                  locale={tr}
                  className="datepicker-input"
                  onKeyDown={handleKeyPressForBirthDate}
                  maxDate={today}
                />
              )}
            />
          </div>
          {errors.BirthDate && <span className="error-message">{errors.BirthDate.message}</span>}
        </div>

        <div className="membership-agreement-input">
          <div className="checkbox-wrapper-46">
            <input onClick={() => setIsMembershipAgreementAccepted(!isMembershipAgreementAccepted)} className="inp-cbx" id="cbx-46" type="checkbox" />
            <label className="cbx" htmlFor="cbx-46"><span>
              <svg width="12px" height="10px" viewBox="0 0 12 10">
                <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
              </svg></span><span></span>
            </label>
          </div>
          <p><strong onClick={handleMembershipAgreementModal}>Üyelik sözleşmesi</strong> şartlarını okudum ve kabul ediyorum.
          </p>
        </div>

        <button
          type="submit"
          className="sign-buttons"
          disabled={!isFormValid}
          style={{ opacity: isFormValid ? 1 : 0.7 }}>
          Oluştur
        </button>

        <p className='change-sign-method-text'>
          Zaten bir hesabın var mı?
          <Link to="/giris-yap">Giris yap</Link>
        </p>

      </form >
      {isLoading && <PreLoader />}
    </motion.div>
  )
}

export default SignUp
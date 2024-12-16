import { useState } from 'react';
import { useChangePasswordMutation } from '../../../store/Slices/userSettings/userSettingsApi';
import { ErrorAlert, SuccessAlert } from '../../../helpers/customAlert';
import PreLoader from '../../../shared/components/PreLoader/PreLoader';

function ChangePassword() {

    const [changePassword, { isLoading }] = useChangePasswordMutation();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        newPasswordAgain: '',
    });

    const isDisabled =
        !formData.newPasswordAgain || !formData.newPassword || !formData.currentPassword;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        if (formData.newPassword !== formData.newPasswordAgain) {
            ErrorAlert('Yeni şifreler eşleşmiyor!');
            return;
        }
        console.log(formData);
        try {
            await changePassword(formData); // Backend ile uyumlu `formData`
            setFormData({
                currentPassword: '',
                newPassword: '',
                newPasswordAgain: '',
            });
            SuccessAlert('Şifre başarıyla değiştirildi!');
        } catch (error) {
            console.error(error);
            const errorMessage = error?.data?.message || 'Şifre değiştirilemedi.';
            ErrorAlert(errorMessage);
        }
    };

    return (
        <div className="change-password-box">
            <h3>Şifreni Değiştir</h3>
            <div className="inputs-box">
                <div className="input-box">
                    <p>Mevcut Şifreniz</p>
                    <input
                        type="text"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="input-box">
                    <p>Yeni Şifre</p>
                    <input
                        type="text"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="input-box">
                    <p>Yeni Şifre Tekrar</p>
                    <input
                        type="text"
                        name="newPasswordAgain"
                        value={formData.newPasswordAgain}
                        onChange={handleInputChange}
                    />
                </div>
            </div>
            <div className="option-buttons">
                <button
                    onClick={handleSave}
                    disabled={isDisabled}
                    className={`savePassword ${isDisabled ? 'disabled' : ''}`}
                >
                    Kaydet
                </button>
            </div>
            {isLoading && <PreLoader />}
        </div>
    );
}

export default ChangePassword;

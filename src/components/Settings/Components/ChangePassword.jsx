import { useState } from 'react';

function ChangePassword() {

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const isDisabled = !currentPassword || !newPassword || !confirmPassword;

    const handleSave = () => {
        if (newPassword !== confirmPassword) {
            alert("Yeni şifreler eşleşmiyor!");
            return;
        }

        alert("Şifre başarıyla değiştirildi!");
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    return (
        <div className='change-password-box'>
            <h3>Şifreni Değiştir</h3>
            <div className='inputs-box'>
                <div className='input-box'>
                    <p>Mevcut Şifreniz</p>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                </div>
                <div className='input-box'>
                    <p>Yeni Şifre</p>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <div className='input-box'>
                    <p>Yeni Şifre Tekrar</p>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
            </div>
            <div className='option-buttons'>
                <button
                    onClick={handleSave}
                    disabled={isDisabled}
                    className={`savePassword ${isDisabled ? 'disabled' : ''}`}
                >
                    Kaydet
                </button>

            </div>
        </div>
    );
}

export default ChangePassword;

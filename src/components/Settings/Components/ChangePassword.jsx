import React, { useState } from 'react';

function ChangePassword({ handleChangePassword }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Implementation is necesary 
    const handleSave = () => {
        if (newPassword !== confirmPassword) {
            alert("Yeni şifreler eşleşmiyor!");
            return;
        }
        console.log("Mevcut Şifre:", currentPassword);
        console.log("Yeni Şifre:", newPassword);
        alert("Şifre başarıyla değiştirildi!");
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
                <button onClick={handleChangePassword}>Vazgeç</button>
                <button onClick={handleSave}>Kaydet</button>
            </div>
        </div>
    );
}

export default ChangePassword;

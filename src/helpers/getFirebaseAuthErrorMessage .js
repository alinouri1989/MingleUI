export const getFirebaseAuthErrorMessage = (error) => {
    const errorMessages = {
        "auth/account-exists-with-different-credential":
            "Bu e-posta ile başka bir giriş yöntemi kullanılmış.",
        "auth/popup-closed-by-user": "Giriş penceresi kapatıldı. Tekrar deneyin.",
        "auth/cancelled-popup-request":
            "Önceki giriş isteği iptal edildi. Tekrar deneyin.",
        "auth/popup-blocked":
            "Tarayıcı pop-up'ı engelledi. İzin vererek tekrar deneyin.",
        "auth/invalid-credential":
            "Geçersiz kimlik bilgileri. Hesap bilgilerinizi kontrol edin.",
        "auth/operation-not-allowed": "Bu giriş yöntemi devre dışı bırakılmış.",
        "auth/weak-password": "Şifreniz çok zayıf. Daha güçlü bir şifre deneyin.",
        "auth/user-disabled": "Bu hesap devre dışı bırakılmış.",
        "auth/user-not-found":
            "Bu e-posta ile kayıtlı bir kullanıcı bulunamadı.",
        "auth/wrong-password": "Yanlış şifre girdiniz.",
        "auth/too-many-requests":
            "Çok fazla başarısız giriş denemesi yapıldı. Lütfen daha sonra tekrar deneyin.",
    };

    return errorMessages[error.code] || "Bilinmeyen bir hata oluştu.";
};

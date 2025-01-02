import { setUser } from "../Slices/auth/authSlice";

export const updateUserField = (dispatch, currentUser, field, value) => {
    console.log("girdi mi", currentUser);
    if (!currentUser) return;

    console.log("girmedi"),
        dispatch(

            setUser({
                ...currentUser, // Tüm currentUser objesini koru
                user: {
                    ...currentUser.user, // Kullanıcı bilgilerini koru
                    [field]: value, // Sadece güncellenmesi gereken alanı değiştir
                },
            })
        );
};

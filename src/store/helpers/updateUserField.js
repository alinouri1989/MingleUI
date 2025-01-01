import { setUser } from "../Slices/auth/authSlice";

export const updateUserField = (dispatch, currentUser, field, value) => {
    if (!currentUser || currentUser.user[field] === value) return;
    console.log(currentUser),
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

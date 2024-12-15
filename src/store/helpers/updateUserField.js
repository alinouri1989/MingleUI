import { setUser } from "../Slices/auth/authSlice";

export const updateUserField = (dispatch, currentUser, field, value) => {
    if (!currentUser || currentUser[field] === value) return;

    dispatch(
        setUser({
            user: {
                ...currentUser,
                [field]: value, 
            },
            token: currentUser.token,
        })
    );
};

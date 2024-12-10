import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { ChatBackgroundColors } from '../../constants/ChatBackgroundColors';

// Chat background colors dizisi


// Initial state
const initialState = {
    colorId: 'color1',
    backgroundImage: ChatBackgroundColors.find((color) => color.id === 'color1').backgroundImage,
    status: 'idle',
    error: null,
};


// // Thunk action: colorId'yi API'ye gönder
export const updateChatBackgroundColor = createAsyncThunk(
    'chatBackgroundColor/updateColor',
    async (colorId, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:5000/api/chat-background', { colorId });
            return response.data; // Başarılı yanıt
        } catch (error) {
            return rejectWithValue(error.response?.data || 'An error occurred');
        }
    }
);

// Slice oluştur
const chatBackgroundColorSlice = createSlice({
    name: 'chatBackgroundColor',
    initialState,
    reducers: {
        setChatBackgroundColor: (state, action) => {
            const { colorId } = action.payload; // Gelen colorId
            state.colorId = colorId; // Yeni colorId'yi güncelle

            // Yeni backgroundImage değerini bul ve ayarla
            const matchedColor = ChatBackgroundColors.find((color) => color.id === colorId);
            if (matchedColor) {
                state.backgroundImage = matchedColor.backgroundImage; // Yeni backgroundImage
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateChatBackgroundColor.fulfilled, (state, action) => {
                state.colorId = action.payload.colorId; // Yeni colorId
                const matchedColor = ChatBackgroundColors.find((color) => color.id === action.payload.colorId);
                if (matchedColor) {
                    state.backgroundImage = matchedColor.backgroundImage; // Yeni background
                }
            });
    },
});
export const { setChatBackgroundColor } = chatBackgroundColorSlice.actions;

export default chatBackgroundColorSlice.reducer;

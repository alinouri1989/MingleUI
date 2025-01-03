import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    callId: null,
    callType: null, // Yeni eklenen alan
    callerProfile: null,
    isRingingIncoming: false,
    isRingingOutgoing: false,
    calls: null,
    isCallStarted: false,
};

const callSlice = createSlice({
    name: 'call',
    initialState,
    reducers: {
        setCallId: (state, action) => {
            state.callId = action.payload;
        },
        setCallType: (state, action) => { // Yeni reducer
            state.callType = action.payload;
        },
        setCallerProfile: (state, action) => {
            state.callerProfile = action.payload;
        },
        setIsRingingIncoming: (state, action) => {
            state.isRingingIncoming = action.payload;
        },
        setIsRingingOutgoing: (state, action) => {
            state.isRingingOutgoing = action.payload;
        },
        setIsCallStarted: (state, action) => {
            state.isCallStarted = action.payload;
        },
        resetCallState: (state) => {
            state.callId = null;
            state.callType = null; // Reset callType
            state.callerProfile = null;
            state.isRingingIncoming = false;
            state.isRingingOutgoing = false;
            state.isCallStarted = false;
        },
    },
});

export const {
    setIsCallStarted,
    setCallId,
    setCallType, // Yeni action
    setCallerProfile,
    setIsRingingIncoming,
    setIsRingingOutgoing,
    resetCallState,
} = callSlice.actions;

export default callSlice.reducer;

// handleIncomingCall fonksiyonu
export const handleIncomingCall = (data, dispatch) => {
    const { callId, callType, ...callerData } = data;
    const callerProfileKey = Object.keys(callerData)[0];
    const callerProfile = callerData[callerProfileKey];

    dispatch(setCallId(callId));
    dispatch(setCallType(callType));
    dispatch(setCallerProfile(callerProfile));
    dispatch(setIsRingingIncoming(true));
    console.log("Arama işlemleri yapıldı mı?");
};

export const handleOutgoingCall = (data, dispatch) => {
    console.log("Girdi mi?", data);
    const { callId, callType, ...callerData } = data;
    const callerProfileKey = Object.keys(callerData)[0];
    const callerProfile = callerData[callerProfileKey];

    dispatch(setCallId(callId));
    dispatch(setCallType(callType));
    dispatch(setCallerProfile(callerProfile));
    dispatch(setIsRingingOutgoing(true));
    dispatch(setIsCallStarted(true));
};
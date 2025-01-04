import { createSlice } from '@reduxjs/toolkit';
import { useModal } from '../../../contexts/ModalContext';


const initialState = {
    callId: null,
    callType: null,
    callerProfile: null,
    isRingingIncoming: false,
    isRingingOutgoing: false,
    calls: [],
    isCallStarted: false,
};

const callSlice = createSlice({
    name: 'call',
    initialState,
    reducers: {
        setCallId: (state, action) => {
            state.callId = action.payload;
        },
        setCallType: (state, action) => {
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
            state.callType = null;
            state.callerProfile = null;
            state.isRingingIncoming = false;
            state.isRingingOutgoing = false;
            state.isCallStarted = false;
        },
        setCallResult: (state, action) => {
            console.log('3');
            const callResult = action.payload;
            const callId = Object.keys(callResult)[0];
            const callData = callResult[callId];

            if (state.callId === callId) {
                console.log('4');
                state.isRingingOutgoing = false;
                state.isCallStarted = false;
            }

            state.calls.push({ id: callId, ...callData });
        },
    },
});

export const {
    setIsCallStarted,
    setCallId,
    setCallType,
    setCallerProfile,
    setIsRingingIncoming,
    setIsRingingOutgoing,
    resetCallState,
    setCallResult,
} = callSlice.actions;

export default callSlice.reducer;

export const handleIncomingCall = (data, dispatch) => {
    const { callId, callType, ...callerData } = data;
    const callerProfileKey = Object.keys(callerData)[0];
    const callerProfile = callerData[callerProfileKey];

    dispatch(setCallId(callId));
    dispatch(setCallType(callType));
    dispatch(setCallerProfile(callerProfile));
    dispatch(setIsRingingIncoming(true));
};

export const handleOutgoingCall = (data, dispatch) => {
    const { callId, callType, ...callerData } = data;
    const callerProfileKey = Object.keys(callerData)[0];
    const callerProfile = callerData[callerProfileKey];

    dispatch(setCallId(callId));
    dispatch(setCallType(callType));
    dispatch(setCallerProfile(callerProfile));
    dispatch(setIsRingingOutgoing(true));
    dispatch(setIsCallStarted(true));
};

export const handleEndCall = (data, dispatch) => {
    const callId = Object.keys(data)[0];
    const callResult = { [callId]: data[callId] };

    if (callId) {
        dispatch(setCallResult(callResult));
        dispatch(resetCallState());
    }
};

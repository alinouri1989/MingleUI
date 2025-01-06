import { createSlice } from '@reduxjs/toolkit';
import { useModal } from '../../../contexts/ModalContext';
import { act } from 'react';


const initialState = {
    callId: null,
    callType: null,
    callerProfile: null,
    isRingingIncoming: false,
    isRingingOutgoing: false,
    calls: [],
    isCallStarting: false,
    isCallStarted: false,
    callStartedDate: null,
    callRecipientList: [],
    isInitialCallsReady: false
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
        setIsCallStarting: (state, action) => {
            state.isCallStarting = action.payload;
        },
        setCallStartedDate: (state, action) => {
            state.callStartedDate = action.payload;
        },
        resetCallState: (state) => {
            state.callId = null;
            state.callType = null;
            state.callerProfile = null;
            state.isRingingIncoming = false;
            state.isRingingOutgoing = false;
            state.isCallStarted = false;
            state.isCallStarting = false;
            state.callStartedDate = null;
        },
        setInitialCalls: (state, action) => {
            const initialCalls = action.payload;

            Object.entries(initialCalls).forEach(([callId, callData]) => {
                const isCallIdExists = state.calls.some(call => call.id === callId);

                if (!isCallIdExists) {
                    state.calls.push({ id: callId, ...callData });
                }
            });
            state.isInitialCallsReady = true;
        },
        setCallResult: (state, action) => {
            const callResult = action.payload;
            const callId = Object.keys(callResult)[0];
            const callData = callResult[callId];

            if (state.callId === callId) {
                state.isRingingOutgoing = false;
                state.isCallStarted = false;
            }

            const isCallIdExists = state.calls.some(call => call.id === callId);

            if (!isCallIdExists) {
                state.calls.push({ id: callId, ...callData });
            }
        },
        setCallRecipientList: (state, action) => {
            const recipientProfiles = action.payload;

            Object.entries(recipientProfiles).forEach(([recipientId, recipientData]) => {
                const existingRecipientIndex = state.callRecipientList.findIndex(
                    recipient => recipient.id === recipientId
                );
                if (existingRecipientIndex !== -1) {
                    state.callRecipientList[existingRecipientIndex] = { id: recipientId, ...recipientData };
                } else {
                    state.callRecipientList.push({ id: recipientId, ...recipientData });
                }
            });
        },
        updateCallRecipientList: (state, action) => {
            const updateData = action.payload;

            // Gelen objeyi işleyerek, ID'ye göre güncelleme veya ekleme yapıyoruz
            const recipientId = Object.keys(updateData)[0]; // ID'yi alıyoruz (örneğin: "Du70dE1dx4c8m9yHqRhNyu6gcMw2")
            const updateValues = updateData[recipientId];

            const existingRecipientIndex = state.callRecipientList.findIndex(
                recipient => recipient.id === recipientId
            );

            if (existingRecipientIndex !== -1) {
                state.callRecipientList[existingRecipientIndex] = {
                    ...state.callRecipientList[existingRecipientIndex],
                    ...updateValues,
                };
            } else {
                state.callRecipientList.push({
                    id: recipientId,
                    ...updateValues,
                });
            }
        }
    },
});

export const {
    isInitialCallsReady,
    setIsCallStarted,
    setIsCallStarting,
    isCallStarting,
    isCallStarted,
    setCallStartedDate,
    setCallId,
    setCallType,
    setCallerProfile,
    setIsRingingIncoming,
    setIsRingingOutgoing,
    resetCallState,
    setCallResult,
    setInitialCalls,
    setCallRecipientList,
    callStartedDate,
    updateCallRecipientList
} = callSlice.actions;

export default callSlice.reducer;

export const handleIncomingCall = async (data, dispatch) => {
    const { callId, callType, ...callerData } = data;
    const callerProfileKey = Object.keys(callerData)[0];
    const callerProfile = callerData[callerProfileKey];

    console.log("Buraya girdi mi=  handleIncomingCall");
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
    dispatch(setIsCallStarting(true));
};

export const handleEndCall = (data, dispatch) => {
    const callId = Object.keys(data)[0];
    const callResult = { [callId]: data[callId] };

    if (callId) {
        dispatch(setCallResult(callResult));
        dispatch(resetCallState());
    }
};

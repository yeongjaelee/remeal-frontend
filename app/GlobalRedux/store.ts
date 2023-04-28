'use client';
import {configureStore} from "@reduxjs/toolkit";
import counterReducer from './Features/counterSlice';
import tagReducer from './Features/tagSlice';
export const store = configureStore({
    reducer:{
        counter:counterReducer,
        tag:tagReducer
    }
})

export type RootSate = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch
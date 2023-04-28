'use client';

import {createSlice} from "@reduxjs/toolkit";

export interface TagState{
    limit : number,
    offset : number,
    tagName : string
}

const initialState : TagState = {
    limit : 4,
    offset : 0,
    tagName : ''
}

export const tagSlice = createSlice({
    name : 'tag',
    initialState,
    reducers : {
        initialLimit: (state) => {state.limit = 4},
        initialOffset: (state) => {state.offset = 0},
        incrementLimit : (state) => {state.limit +=4},
        incrementOffset: (state) => {state.offset +=4}
    }

})

export const {initialLimit, initialOffset, incrementLimit, incrementOffset} = tagSlice.actions;
export default tagSlice.reducer;
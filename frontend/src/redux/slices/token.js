import { createSlice } from "@reduxjs/toolkit";

export const tokenslice = createSlice({
    name: "token",
    initialState:"",
    reducers: {
        jwtToken: (state,action) => {
            return action.payload;
        },
        
       
    },
});
export const { jwtToken } =  tokenslice.actions;
export const TokenReducer=  tokenslice.reducer;

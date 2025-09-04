import {configureStore} from "@reduxjs/toolkit";
import { TokenReducer } from "./slices/token";

export const store = configureStore({
    reducer: {
        token: TokenReducer,
      
    },
})
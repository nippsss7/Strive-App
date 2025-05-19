import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState: {
        mongoUser: null,
    },
    reducers: {
        //actions
        setAuthUser:(state,action) => {
            state.mongoUser = action.payload;
        }
    }
})

export const {setAuthUser} = authSlice.actions;
export default authSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState= {
    currentUser: null,
    error: null,
    loading: false
}

const userSlice= createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state)=>{
            console.log("dispatch: start is called");
            state.loading= true
        },
        signInSuccess: (state, action)=>{
            console.log("dispatch: success is called");

                state.currentUser= action.payload,
                state.loading= false,
                state.error= null
        },
        signInFailure: (state, action)=>{
            console.log("dispatch: failure is called");

            state.error= action.payload,
            state.loading= false
        },

        uploadStart: (state)=>{
            console.log("dispatch: upload start is called");
            state.loading= true;
        },

        uploadSuccess: (state, action)=>{
            console.log("dispatch: upload success is called");

            state.currentUser= action.payload,
            state.loading= false;
            state.error= null;
        },

        uploadFailure: (state, action)=>{
            console.log("dispatch: upload failure is called");
            state.error= action.payload,
            state.loading=false;
        },

        deleteStart: (state)=>{
            console.log("dispatch: delete start is called");
            state.loading= true
        },
        
        deleteSucces: (state, action)=>{
            console.log("dispatch: delete success is called");
            state.loading= false,
            state.currentUser= null,
            state.error= null
        },

        deleteFailure: (state, action)=>{
            console.log("dispatch: delete failure is called");
            state.error= action.payload;
            state.loading= false;
        },

        signOutStart: (state)=>{
            console.log("dispatch: sign Out start is called");
            state.loading= true
        },
        
        signOutSucces: (state, action)=>{
            console.log("dispatch: sign Out success is called");
            state.loading= false,
            state.currentUser= null,
            state.error= null
        },

        signOutFailure: (state, action)=>{
            console.log("dispatch: sign Out failure is called");
            state.error= action.payload;
            state.loading= false
        }
}});

export const {signInStart, signInSuccess, signInFailure,
     uploadStart, uploadFailure, uploadSuccess,
    deleteStart, deleteFailure, deleteSucces,
    signOutStart, signOutFailure, signOutSucces} = userSlice.actions;
export default userSlice.reducer;
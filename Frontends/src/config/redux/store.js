import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducer/authReducer';
import postReducer from './reducer/postReducer';


/*
*
* STEPS for state management
* Submit Action
* Handle Action in its reducer
* register here -> reducer
 */



export const store = configureStore({
   reducer: {
    auth: authReducer,
    post: postReducer
   }
})
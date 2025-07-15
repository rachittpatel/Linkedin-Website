import { createSlice, configureStore } from "@reduxjs/toolkit";
import { getAllUsers, loginUser, registerUser, getConnectionRequest, sendConnectionRequest, getMyConnectionRequests, AcceptConnection } from "../../action/authAction/index.js";
import { getAboutUser } from "../../action/authAction/index.js";


 const initialState = {
  user: undefined,
  isError: false,
  isSuccess: false,
  isLoading: false,
  loggedIn: false,
  message: "",
  isTokenThere: false,
  profileFetched: false,
  connections: [],
  connectionRequest: [],
  all_users: [],
  all_profiles_fetched: false
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
   reset: () => initialState,
   handleLoginUser: (state) => {
    state.message = "Hello"
   },
   emptyMessage: (state) => {
    state.message = " ";
   },
   setTokenIsThere: (state) => {
      state.isTokenThere = true
   },
   setTokenIsNotThere: (state) => {
      state.isTokenThere = false
      
   }
  },

 extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Knocking  the dooor..."

        state.isError = false;
        state.isSuccess = false;

      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.loggedIn = true;
        state.message = "Login successful";

        state.token = action.payload.token;
        state.isTokenThere = true;

      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;

        state.isSuccess = false;
        state.loggedIn = false;

        state.message = action.payload  || "login failed";
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Registering you..."
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;

        state.loggedIn = false;
        //state.message = { message: "Registration is successful,  login Please!"};
       
        state.message = "Registration is successful,  login Please!"
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload
      })
      .addCase(getAboutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.profileFetched = true;
        state.user = action.payload;
    
      })
     

      .addCase(getAllUsers.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.all_profiles_fetched = false; 
      state.message = "Fetching all users...";
    })
    .addCase(getAllUsers.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.all_profiles_fetched = true;
     
      state.all_users = action.payload.profiles; 
      state.message = "All users fetched successfully."; 
    })
    .addCase(getAllUsers.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.all_profiles_fetched = false; 
      state.message = action.payload?.message || "Failed to fetch all users.";
      state.all_users = [];
    })
    .addCase(getConnectionRequest.fulfilled, (state, action) => {
      state.connections = action.payload
    })
    .addCase(getConnectionRequest.rejected, (state, action) => {
      state.message = action.payload
    })
   
    .addCase(getMyConnectionRequests.fulfilled, (state, action) => {
  state.connectionRequest = action.payload.connections  
})

    .addCase(getMyConnectionRequests.rejected, (state, action) => {
      state.message = action.payload
    })
     .addCase(sendConnectionRequest.fulfilled, (state, action) => {
  state.message = "Connection request sent successfully.";
  state.isError = false;
})
.addCase(sendConnectionRequest.rejected, (state, action) => {
  state.message = action.payload || "Failed to send connection request.";
  state.isError = true;
})
.addCase(AcceptConnection.fulfilled, (state, action) => {
  state.message = "Connection accepted.";
})
.addCase(AcceptConnection.rejected, (state, action) => {
  state.message = action.payload || "Failed to accept connection.";
  state.isError = true;
})



  }
})



export const { reset, emptyMessage, setTokenIsThere, setTokenIsNotThere} = authSlice.actions;

export default authSlice.reducer




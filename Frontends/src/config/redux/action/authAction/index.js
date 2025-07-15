import { createAsyncThunk } from '@reduxjs/toolkit';

import { clientServer } from '@/config';
import { connection } from 'next/server';

export const loginUser = createAsyncThunk(
  "user/login",
  async (user, thunkAPI) => {
    try {

      const response = await clientServer.post("/login", {
       email: user.email,
        password: user.password
        });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);

      } else {
        return thunkAPI.rejectWithValue({message: "token not provided"})
      }
      
      return thunkAPI.fulfillWithValue(response.data.token);

    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
)


export const registerUser = createAsyncThunk("user/register",
async (user, thunkAPI) => { 

  try {

    const request = await clientServer.post("/register", {
      username: user.username,
      password: user.password,
      email: user.email,
      name: user.name
    });

  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
}
)




export const getAboutUser = createAsyncThunk(
  "user/getAboutUser",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.get("/get_user_and_profile", {
        // params: {
        //   profile: user.profile
        // }
       params: {
          token: user.token
        }
    })
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      console.log("error in getAboutUser action");
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);






export const getAllUsers = createAsyncThunk("user/getAllUsers",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("/user/get_all_users")

      return thunkAPI.fulfillWithValue(response.data)

    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)



export const getConnectionRequest = createAsyncThunk(
  "auth/getConnectionRequest",
  async ({ token }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/user/get_connections`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);



export const sendConnectionRequest = createAsyncThunk(
  "auth/sendConnectionRequest",
  async ({ token, connectionId }, thunkAPI) => {
    try {
      const response = await clientServer.post(
        "/user/send_connection_request",
        { connectionId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);



export const getMyConnectionRequests = createAsyncThunk(
  "user/getMyConnectionRequests",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.get(
        "/user/get_sent_requests",   // ✅ Corrected route here
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);



export const AcceptConnection = createAsyncThunk(
  "user/acceptConnection",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post(
        "/user/accept_connection_request",
        {
          requestId: user.connectionId,
          action_type: user.action
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
       thunkAPI.dispatch(getConnectionRequest({ token: user.token}))
       thunkAPI.dispatch(getMyConnectionRequests({token: user.token}))
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);


export async function getServerSideProps(context) {

  console.log("from view")
  console.log(context.query.username)

  const request = await clientServer.get("/user/get_profile_based_on_username", {
    params: {
      username: context.query.username
    }
  })

  const response = await request.data;

  return { props: { userProfile: request.data.profile }}
}
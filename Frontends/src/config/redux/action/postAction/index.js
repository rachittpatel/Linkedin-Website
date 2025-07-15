import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "@/config";
import { incrementPostLikeLocally } from "../../reducer/postReducer";




export const getAllPosts = createAsyncThunk(
  "posts/getAllPosts",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("/posts");
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
)

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (userData, thunkAPI) => {
    const {file, body} = userData;

    try {
      const formData = new FormData();
      formData.append('token', localStorage.getItem("token"));
      formData.append("body", body);
      formData.append("media", file);

      const response = await clientServer.post("/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
   
        },
      });

      if (response.status === 200) {
        return thunkAPI.fulfillWithValue("Post Uploaded");
      } else {
        return thunkAPI.rejectWithValue("Post Upload Failed");
      }
    
  } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
}
})



export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (postData, thunkAPI) => {
    try {
      const response = await clientServer.delete("/delete_post", {
        data: {
          token: localStorage.getItem("token"),
          post_id: postData.post_id, 
        }
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);



export const incrementPostLike = createAsyncThunk(
  "post/incrementLike",
  async (postData, thunkAPI) => {
    try {
      const response = await clientServer.post("/increment_post_like", {
        post_id: postData.post_id,
        user_id: postData.user_id,
      });

    
      thunkAPI.dispatch(
        incrementPostLikeLocally({
          post_id: postData.post_id,
          user_id: postData.user_id,
        })
      );

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);



export const getAllComments = createAsyncThunk(
  "post/getAllComments",
  async (postData, thunkAPI) => {
    try {
      const response = await clientServer.post("/get_comments", {
        post_id: postData.post_id,
      });
      return thunkAPI.fulfillWithValue({
        comments: response.data.comments,
        post_Id: postData.post_id,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);




export const postComment = createAsyncThunk(
  "post/postComment",
  async (commentData, thunkAPI) => {
    try {
      console.log({
        post_id: commentData.post_id,
        body: commentData.body
      });
      const response = await clientServer.post("/comments", {
        token: localStorage.getItem("token"),
        post_id: commentData.post_id,
        body: commentData.body
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

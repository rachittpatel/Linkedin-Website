import { createSlice } from "@reduxjs/toolkit";
import { getAllPosts, getAllComments } from "../../action/postAction/index.js";

const initialState = {
  posts: [],
  isError: false,
  postFetched: false,
  isLoading: false,
  loggedIn: false,
  message: "",
  comments: [],
  postId: "",
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    reset: () => initialState,
    resetPostId: (state) => {
      state.postId = "";
    },
    setPostId: (state, action) => {
      state.postId = action.payload;
    },
    incrementPostLikeLocally: (state, action) => {
      const { post_id, user_id } = action.payload;
      const post = state.posts.find((p) => p._id === post_id);
      if (post && !post.likedBy.includes(user_id)) {
        post.likes += 1;
        post.likedBy.push(user_id);
      }
    },
  
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPosts.pending, (state) => {
        state.isLoading = true;
        state.message = "Fetching all posts...";
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.postFetched = true;
        state.posts = action.payload.posts.reverse();
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAllComments.fulfilled, (state, action) => {
        state.isError = false;
        state.comments = action.payload.comments;
        state.postId = action.payload.post_Id;
      });
  },
});

export const { reset, resetPostId, incrementPostLikeLocally, setPostId } = postSlice.actions;
export default postSlice.reducer;

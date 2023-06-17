import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";

export const getUserProfile = createAsyncThunk(
  "user/getUserProfile",
  async (body) => {
    try {
      const response = await axiosClient.post("/user/getUserProfile", body);
      return response.result;
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

export const likeAndunlikePost = createAsyncThunk(
  "post/likeAndunlikePost",
  async (body) => {
    try {
      const response = await axiosClient.post("/post/like", body);
      console.log(response);
      return response.result.post;
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

const postsSlice = createSlice({
  name: "postsSlice",
  initialState: {
    isLoading: false,
    userProfile: {},
  },
  extraReducers: function (builder) {
    builder
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.userProfile = action.payload;
      })
      .addCase(likeAndunlikePost.fulfilled, (state, action) => {
        const post = action.payload;
        const index = state.userProfile?.posts?.findIndex(
          (item) => item._id === post._id
        );
        if (index !== undefined && index !== -1) {
          state.userProfile.posts[index] = post;
        }
      });
  },
});

export default postsSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  themeMode : 'light',
  currentUser : null,
  authToken : null,
  postList : [],
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setMode: (state) => {
      state.themeMode = state.themeMode === 'light' ? 'dark' : 'light';
    },
    setLogin: (state, action) => {
      state.currentUser = action.payload.user;
      state.authToken = action.payload.token;
    },
    setLogout: (state) => {
      state.currentUser = null;
      state.authToken = null;
    },
    setFriends: (state, action) => {
      if (state.currentUser) {
        state.currentUser.friends = action.payload.friends;
      } else {
        console.error('user friends non-existent :('); //Replace or keep?
      }
    },
    setPosts: (state, action) => {
      state.postList = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.postList.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
  },
});

export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost } =
  authSlice.actions;
export default authSlice.reducer;

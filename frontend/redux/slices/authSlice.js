// frontend/redux/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  phoneNumber: '',
  isLoggedIn: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setPhoneNumber: (state, action) => {
      state.phoneNumber = action.payload;
    },
    setLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

// Export actions
export const { setPhoneNumber, setLoggedIn, setLoading, setError } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
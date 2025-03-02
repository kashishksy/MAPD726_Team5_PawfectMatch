// frontend/redux/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  phoneNumber: '',
  countryCode: '1', // Default country code
  isLoggedIn: false,
  isLoading: false,
  error: null,
  isNewUser: false, // Add this to track if user is new
  otpSent: false, // Add this to track if OTP was sent
  otpVerified: false, // Add this to track if OTP was verified
  userData: null, // Add this
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setPhoneNumber: (state, action) => {
      state.phoneNumber = action.payload;
    },
    setCountryCode: (state, action) => {
      state.countryCode = action.payload;
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
    setIsNewUser: (state, action) => {
      state.isNewUser = action.payload;
    },
    setOtpSent: (state, action) => {
      state.otpSent = action.payload;
    },
    setOtpVerified: (state, action) => {
      state.otpVerified = action.payload;
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
  },
});

// Export actions
export const {
  setPhoneNumber,
  setCountryCode,
  setLoggedIn,
  setLoading,
  setError,
  setIsNewUser,
  setOtpSent,
  setOtpVerified,
  setUserData,
} = authSlice.actions;

// Export reducer
export default authSlice.reducer;
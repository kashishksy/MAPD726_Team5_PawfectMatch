// frontend/redux/store.js

//creating a redux store
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'; // We'll create this next
import registrationReducer from './slices/registrationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer, // Add more slices here as needed
    registration: registrationReducer,
  },
});
// frontend/redux/store.js

//creating a redux store
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'; // We'll create this next
import registrationReducer from './slices/registrationSlice';
import walkthroughReducer from './slices/walkthroughSlice';
import petTypesReducer from './slices/petTypesSlice';
import animalsReducer from './slices/animalsSlice';
import favoritesReducer from './slices/favoritesSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    walkthrough: walkthroughReducer, // Add more slices here as needed
    registration: registrationReducer,
    petTypes: petTypesReducer,
    animals: animalsReducer,
    favorites: favoritesReducer
  },
});

export default store;
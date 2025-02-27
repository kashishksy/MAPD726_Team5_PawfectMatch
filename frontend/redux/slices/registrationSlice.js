import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userType: null, // 'Pet Owner' or 'Pet Adopter'
  petType: null,  // selected pet type
  selectedBreeds: [], // array of selected breeds
  personalInfo: {
    fullName: '',
    gender: '',
    profileImage: null,
  }
};

const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    setUserType: (state, action) => {
      state.userType = action.payload === 'owner' ? 'Pet Owner' : 'Pet Adopter';
    },
    setPetType: (state, action) => {
      state.petType = action.payload;
    },
    setSelectedBreeds: (state, action) => {
      state.selectedBreeds = action.payload;
    },
    setPersonalInfo: (state, action) => {
      state.personalInfo = { ...state.personalInfo, ...action.payload };
    },
    resetRegistration: (state) => {
      return initialState;
    }
  },
});

export const {
  setUserType,
  setPetType,
  setSelectedBreeds,
  setPersonalInfo,
  resetRegistration
} = registrationSlice.actions;

export default registrationSlice.reducer; 
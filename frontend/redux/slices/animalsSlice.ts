import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Animal {
  _id: string;
  name: string;
  petType: {
    _id: string;
    name: string;
  };
  breedType: {
    _id: string;
    name: string;
  };
  age: string;
  gender: string;
  size: string;
  location: {
    lat: number;
    lng: number;
  };
  kms?: number;
  isFavorite?: boolean;
  // Add other animal properties as needed
}

interface AnimalsState {
  animals: Animal[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  error: string | null;
}

const initialState: AnimalsState = {
  animals: [],
  total: 0,
  page: 1,
  limit: 10,
  loading: false,
  error: null,
};

const animalsSlice = createSlice({
  name: 'animals',
  initialState,
  reducers: {
    fetchAnimalsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchAnimalsSuccess(state, action: PayloadAction<{
      data: Animal[];
      total: number;
      page: number;
      limit: number;
    }>) {
      state.animals = action.payload.data;
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.loading = false;
      state.error = null;
    },
    fetchAnimalsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchAnimalsStart, fetchAnimalsSuccess, fetchAnimalsFailure } = animalsSlice.actions;
export default animalsSlice.reducer; 
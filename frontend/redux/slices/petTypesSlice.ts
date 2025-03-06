import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PetType {
  _id: string;
  name: string;
  emoji: string;
}

interface PetTypesState {
  petTypes: PetType[];
  loading: boolean;
  error: string | null;
}

const initialState: PetTypesState = {
  petTypes: [],
  loading: false,
  error: null,
};

const petTypesSlice = createSlice({
  name: 'petTypes',
  initialState,
  reducers: {
    fetchPetTypesStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchPetTypesSuccess(state, action: PayloadAction<PetType[]>) {
      state.petTypes = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchPetTypesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchPetTypesStart, fetchPetTypesSuccess, fetchPetTypesFailure } = petTypesSlice.actions;
export default petTypesSlice.reducer; 
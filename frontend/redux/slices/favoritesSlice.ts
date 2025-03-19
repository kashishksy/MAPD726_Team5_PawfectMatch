import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FavoriteItem {
  id: string;
  title: string;
  description: string;
  images?: string[];
  name?: string;
  breedType?: {
    _id: string;
    name: string;
  };
  kms?: number;
  // Add any other fields you need
}

interface FavoritesState {
  items: FavoriteItem[];
}

const initialState: FavoritesState = {
  items: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<FavoriteItem>) => {
      const existingIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      
      if (existingIndex >= 0) {
        // Remove from favorites if already exists
        state.items.splice(existingIndex, 1);
      } else {
        // Add to favorites if doesn't exist
        state.items.push(action.payload);
      }
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
}

interface FavoritesState {
  items: FavoriteItem[];
}

const initialState: FavoritesState = {
  items: [],
};

// Helper function to save favorites to AsyncStorage
export const saveFavoritesToStorage = async (favorites: FavoriteItem[]) => {
  try {
    await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites:', error);
  }
};

// Helper function to load favorites from AsyncStorage
export const loadFavoritesFromStorage = async () => {
  try {
    const favoritesString = await AsyncStorage.getItem('favorites');
    return favoritesString ? JSON.parse(favoritesString) : [];
  } catch (error) {
    console.error('Error loading favorites:', error);
    return [];
  }
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
        state.items.splice(existingIndex, 1);
      } else {
        state.items.push(action.payload);
      }
      // Save to AsyncStorage whenever favorites change
      saveFavoritesToStorage(state.items);
    },
    setFavorites: (state, action: PayloadAction<FavoriteItem[]>) => {
      state.items = action.payload;
    },
  },
});

export const { toggleFavorite, setFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
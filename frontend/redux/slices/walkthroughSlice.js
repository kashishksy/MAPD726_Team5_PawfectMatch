import { createSlice } from '@reduxjs/toolkit';

const walkthroughSlice = createSlice({
  name: 'walkthrough',
  initialState: {
    hasSeenWalkthrough: false,
  },
  reducers: {
    setWalkthroughSeen: (state) => {
      state.hasSeenWalkthrough = true;
    },
  },
});

export const { setWalkthroughSeen } = walkthroughSlice.actions;

export default walkthroughSlice.reducer;
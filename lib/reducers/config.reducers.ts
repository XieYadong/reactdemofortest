import { createSlice } from '@reduxjs/toolkit';

export interface ConfigState {
  config: any;
  synced: boolean;
}

export const configState: ConfigState = {
  config: {},
  synced: false
};

const configSlice = createSlice({
  name: 'envConfig',
  reducers: {
    envconfig: (state, action) => {
      state.config = action.payload.config;
      state.synced = true;
    }
  },
  initialState: configState
});

export const { envconfig } = configSlice.actions;
export const configReducer = configSlice.reducer;

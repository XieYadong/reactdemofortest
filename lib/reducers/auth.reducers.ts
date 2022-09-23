import { createSlice } from '@reduxjs/toolkit';
import { ConfigState } from 'lib/reducers/config.reducers';
export interface UserInfo {
  // 用户名
  nickName: string;
  // 性别
  sex?: number;
  openId?: string;
  // 头像
  id?: string;
  headimgurl?: string;
}
export interface AuthenticationState {
  token?: string;
  refreshToken?: string;
  expiresIn?: number;
  synced?: boolean;
  tokenHead?: string;
}
export interface ReducerState {
  authentication?: AuthenticationState;
  econfig: ConfigState;
}

export interface userContext {
  _userContext: ReducerState;
}

export const initialState: AuthenticationState = {
  token: 'ssdds',
  refreshToken: '',
  expiresIn: 0,
  tokenHead: 'Bearer '
};

const authenticationSlice = createSlice({
  name: 'authentication',
  reducers: {
    setAuthenticate: (state, action) => {
      // console.log('authenticate', action, state);
      state.token = action.payload.token;
      state.synced = true;
      // console.log(state, 'state');
    },

    setSynced: (state, action) => {
      console.log('setSynced', action);

      // state.synced = action.payload.synced;
    }
  },
  initialState
});

export const { setAuthenticate, setSynced } = authenticationSlice.actions;
export const authenticationReducer = authenticationSlice.reducer;

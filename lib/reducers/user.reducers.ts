import { createSlice } from '@reduxjs/toolkit';
// import { MenuOptions } from 'next-env';
import { ConfigState } from 'lib/reducers/config.reducers';
export interface UserInfo {
  // 用户名
  nickName: string;
  sex?: number;
  // 头像
  id?: string;
  menu?: any;
  headimgurl?: string;
}
export interface UserInfoState {
  username?: string;
  menu?: Array<any>;
  roles?: Array<any>;
}
export interface ReducerState {
  authentication?: UserInfoState;
  econfig: ConfigState;
}

export interface userContext {
  _userContext: ReducerState;
}

export const initialState: UserInfoState = {
  roles: [],
  // 未与服务器端 cookie 同步
  username: '',
  menu: []
};

const userInfoSlice = createSlice({
  name: 'userInfo',
  reducers: {
    setUserinfo: (state, action) => {
      state.menu = action.payload.menus || [];
      state.roles = action.payload.roles || [];
      state.username = action.payload.username || '';
    },

    setSynced: (state, action) => {
      console.log('setSynced', action);
    }
  },
  initialState
});

export const { setUserinfo, setSynced } = userInfoSlice.actions;
export const userInfoReducer = userInfoSlice.reducer;

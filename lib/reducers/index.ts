import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { authenticationReducer } from './auth.reducers';
import { configReducer } from './config.reducers';
import { userInfoReducer } from './user.reducers';
import { counterReducer } from './counterSlice.reucers';
const rootReducer = combineReducers({
  auth: authenticationReducer,
  envs: configReducer,
  userInfo: userInfoReducer,
  count: counterReducer
});
const store = configureStore({
  reducer: rootReducer
});
export default store;

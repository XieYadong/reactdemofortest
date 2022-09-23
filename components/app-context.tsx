import { AppState } from 'lib/hooks/init';
import { initialState as authentication } from 'lib/reducers/auth.reducers';
import { configState as econfig } from 'lib/reducers/config.reducers';
import React, { useContext } from 'react';
import { ReducerState, AuthenticationState } from 'lib/reducers/auth.reducers';
export const AppStateContext = React.createContext<any>({
  authentication,
  econfig
});

export const useAppState = () => {
  return useContext(AppStateContext);
};

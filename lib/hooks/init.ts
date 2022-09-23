import {
  // authenticate,
  authenticationReducer,
  AuthenticationState,
  initialState
} from 'lib/reducers/auth.reducers';

import {
  envconfig,
  ConfigState,
  configReducer,
  configState
} from 'lib/reducers/config.reducers';
import { useEffect, useReducer, useState } from 'react';
import { usePullToken } from './token';
import { useRouter } from 'next/dist/client/router';
import { strict } from 'assert';
import { user, util } from 'utils/helpers';

export interface AppState {
  inited: boolean;
  // authentication: AuthenticationState;
  econfig: ConfigState;
}

export function useInit(): AppState {
  const [authentication, dispatch] = useReducer(
    authenticationReducer,
    initialState
  );

  const [econfig, setconfig] = useReducer(configReducer, configState);
  const [inited, setInited] = useState(false);
  const { replace } = useRouter();
  const { loading, config } = usePullToken(econfig);
  useEffect(() => {
    if (config && config instanceof Object && Object.keys(config).length > 0) {
      setconfig(envconfig({ config }));
      console.log('check', config);

      // console.log('authenticate', authentication);
      console.log(config, 'userinfoinit');
      setInited(true);
    }
  }, [config, loading]);
  const islogin = async () => {
    const authtoken = window.localStorage.getItem('authtoken');
    const userdata = window.localStorage.getItem('userinfo');

    const code = util.getUrlParam('code');
    const client_id = util.getUrlParam('client_id');
    try {
      if (userdata && userdata !== 'undefined') {
        try {
          const userinfo = JSON.parse(userdata);
          // dispatch(authenticate({ token: userinfo?.openId, userinfo }));
        } catch (err) {
          console.log(err);
        }
      } else if (code && typeof code === 'string') {
        // const { data } = await user.auth(code);
        // window.localStorage.setItem('authtoken', data?.userInfo?.openId);
        // const userinfo = JSON.stringify(data.userInfo);
        // window.localStorage.setItem('userinfo', userinfo);
        // // dispatch(
        //   authenticate({
        //     token: data?.userInfo?.openId,
        //     userinfo: data.userInfo
        //   })
        // );
        if (client_id) {
          replace(`/account-auth?client_id=${client_id}`);
        }
      } else {
        // localStorage.removeItem('userinfo');
        // const url =
        //   process.env.NODE_ENV === 'production'
        //     ? 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx511a4a2ff3bf9d37&redirect_uri=https%3a%2f%2fprivate.zfxfzb.com%2faccount-transaction&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect'
        //     : 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx5d66ba77e52a4abc&redirect_uri=http%3a%2f%2fstatic.zfxfzb.com%3a3000%2f&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect';
        // location.href = url;
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    islogin();
    setInited(true);
  }, []);

  useEffect(() => {
    console.log('check inited', inited);
    if (inited) {
      console.log('app inited');
    }
  }, [inited]);

  return {
    inited,
    // authentication,
    econfig
  };
}

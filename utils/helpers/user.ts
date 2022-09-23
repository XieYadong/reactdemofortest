// import { basicApi } from 'utils/helpers';
import { getBaseUrl } from 'lib/options/api.options';

export default {
  async auth(code: string) {
    // return await basicApi.get(`${getBaseUrl()}/wechat/client/code/${code}`);
  },

  set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  get(key: string) {
    return localStorage.getItem(key) != 'undefined'
      ? JSON.parse(localStorage.getItem(key))
      : undefined;
  },
  verifyToken() {
    if (localStorage.getItem('token')) {
      const tokenobj = JSON.parse(localStorage.getItem('token'));
      if (tokenobj.expiresIn && new Date().getTime() < tokenobj.expiresIn) {
        return tokenobj.token;
      }
    }
    return false;
  }
};

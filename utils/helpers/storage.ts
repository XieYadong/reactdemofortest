// import { basicApi } from 'utils/helpers';
import { getBaseUrl } from 'lib/options/api.options';

export default {
  set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  get(key: string) {
    return localStorage.getItem(key) != 'undefined'
      ? JSON.parse(localStorage.getItem(key))
      : undefined;
  }
};

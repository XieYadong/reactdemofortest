import getConfig from 'next/config';
import { SessionOptions } from 'next-iron-session';

let ironSessionOptions: SessionOptions = null;

export const getIronSessionOptions = () => {
  if (!ironSessionOptions) {
    const { serverRuntimeConfig } = getConfig();
    ironSessionOptions = serverRuntimeConfig.ironSession;

    console.log('iron session config in use:', ironSessionOptions);
  }
  return ironSessionOptions;
};

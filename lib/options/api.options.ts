import pino from 'pino';
import { stringify } from 'querystring';

const logger = pino({
  name: 'API options',
  prettyPrint: process.env.NODE_ENV !== 'production'
});

interface MyWindow extends Window {
  myFunction(): void;
  _env: any;
}

declare var window: MyWindow;

export interface PortfolioServerOptions {
  baseUri: string;
}

export interface NotificationServerOptions {
  baseUri: string;
  path: string;
}

import { getConfigEnvVariables, GlobalEnv } from './env.options';

export var currentEnv: GlobalEnv = null;

export function loadConfig(): GlobalEnv {
  if (typeof window !== 'undefined') {
    // Browser
    let ret = window._env || {};
    return ret;
  } else {
    // Server
    return getConfigEnvVariables();
  }
}

export async function updateConfig(env: GlobalEnv) {
  // sessionStorage.setItem('_env', JSON.stringify(env));
  window._env = env;
  currentEnv = env;
}

export const getAPIEndpoint = (
  path: string,
  query: Record<string, unknown> = {}
) => {
  // Load config
  const baseUri = loadConfig().PORTFOLIO_SERV_API_BASE_URI;

  return Object.keys(query).length > 0
    ? `${baseUri}${path}?${stringify(query as any)}`
    : `${baseUri}${path}`;
};

export const getAuldAPIEndpoint = (
  path: string,
  query: Record<string, unknown> = {}
) => {
  // Load config
  const baseUri = loadConfig().AULD_SERV_API_BASE_URI;

  return Object.keys(query).length > 0
    ? `${baseUri}${path}?${stringify(query as any)}`
    : `${baseUri}${path}`;
};

export const getMessageEndpoint = (
  path: string,
  query: Record<string, unknown> = {}
) => {
  // Load config
  const baseUri = loadConfig().MESSAGE_SERV_API_BASE_URI;
  return Object.keys(query).length > 0
    ? `${baseUri}${path}?${stringify(query as any)}`
    : `${baseUri}${path}`;
};

export const getDataRepoAPIEndpoint = (
  path: string,
  query: Record<string, unknown> = {}
) => {
  // Load config
  const baseUri = loadConfig().DATAREPO_SERV_API_BASE_URI;
  return Object.keys(query).length > 0
    ? `${baseUri}${path}?${stringify(query as any)}`
    : `${baseUri}${path}`;
};

export const getProbabitionAppid = () => {
  // Load config
  const baseUri = loadConfig().PROBATION_APPID;
  return baseUri;
};

export const getBaseUrl = () => {
  // Load config
  const baseUri = loadConfig()?.PORTFOLIO_SERV_API_BASE_URI;
  return baseUri;
};
export const getPrivatUrl = () => {
  // Load config
  const baseUri = loadConfig().PRIVATE_URL;
  return baseUri;
};

export const getNotificationServerEndpoint = (path = '') => {
  const baseUri = loadConfig().NOTIFICATION_SERV_SOCKET_IO_URI;
  return `${baseUri}${path}`;
};
// NOTIFICATION_SERV_SOCKET_IO_URI=wss://api.zfxfzb.com
// NOTIFICATION_SERV_SOCKET_IO_PATH=/portfolio/socket
export const getSocketIOOptions = (): SocketIOClient.ConnectOpts => {
  return {
    transports: ['websocket'],
    path: loadConfig().NOTIFICATION_SERV_SOCKET_IO_PATH ?? '/socket',
    reconnection: true
  };
};

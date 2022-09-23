import pino from 'pino';

const logger = pino({
  name: 'Env Registry',
  prettyPrint: process.env.NODE_ENV !== 'production'
});

export interface GlobalEnv {
  CMS_SERV_API_BASE_URI: string;
  PRIVATE_APPID: string;
  PRIVATE_URL: string;
  MESSAGE_SERV_API_BASE_URI: string;
  PORTFOLIO_SERV_API_BASE_URI: string;
  AULD_SERV_API_BASE_URI: string;
  NOTIFICATION_SERV_SOCKET_IO_URI: string;
  NOTIFICATION_SERV_SOCKET_IO_PATH: string;
  DATAREPO_SERV_API_BASE_URI: string;
  PROBATION_APPID: string;
}

// 在页面中通过全局变量注册当前部署环境所对应的环境变量信息
export function getConfigEnvVariables(): GlobalEnv {
  return {
    CMS_SERV_API_BASE_URI: process.env.CMS_SERV_API_BASE_URI,
    MESSAGE_SERV_API_BASE_URI: process.env.MESSAGE_SERV_API_BASE_URI,
    PRIVATE_APPID: process.env.PRIVATE_APPID,
    PRIVATE_URL: process.env.PRIVATE_URL,
    PROBATION_APPID: process.env.PROBATION_APPID,
    PORTFOLIO_SERV_API_BASE_URI: process.env.PORTFOLIO_SERV_API_BASE_URI,
    DATAREPO_SERV_API_BASE_URI: process.env.DATAREPO_SERV_API_BASE_URI,
    NOTIFICATION_SERV_SOCKET_IO_PATH:
      process.env.NOTIFICATION_SERV_SOCKET_IO_PATH,
    NOTIFICATION_SERV_SOCKET_IO_URI:
      process.env.NOTIFICATION_SERV_SOCKET_IO_URI,
    AULD_SERV_API_BASE_URI: process.env.AULD_SERV_API_BASE_URI
  };
}

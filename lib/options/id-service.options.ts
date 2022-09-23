import { readFileSync } from 'fs';
import isEmpty from 'lodash/isEmpty';
import getConfig from 'next/config';
import { join } from 'path';
import pino from 'pino';

const logger = pino({
  name: 'idServiceOptions',
  prettyPrint: process.env.NODE_ENV !== 'production'
});

interface IdentityServiceOptions {
  origin: string;
  authorizeEndpoint: string;
  tokenEndpoint: string;
  profileEndpoint: string;
  introspectEndpoint: string;
  signOutEndpoint: string;
  clientId: string;
  clientSecret: string;
  publicKey: string | Buffer;
}

let identityServiceOptions: IdentityServiceOptions = null;

export const getIdentityServiceOptions = () => {
  if (!identityServiceOptions) {
    const { serverRuntimeConfig } = getConfig();
    identityServiceOptions = serverRuntimeConfig.idService;
    identityServiceOptions.publicKey = isEmpty(
      serverRuntimeConfig.idService.publicKey
    )
      ? ''
      : readFileSync(join(process.cwd(), process.env.ID_SERV_CERT_PUBLIC));

    logger.info('身份服务配置信息: %o', {
      config: {
        ...identityServiceOptions,
        publicKey: '<hidden>'
      }
    });
  }
  return identityServiceOptions;
};

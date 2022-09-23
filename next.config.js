const packageJSON = require('./package.json');

// https://github.com/vercel/next.js/blob/canary/packages/next/next-server/lib/constants.ts#L1-L4
const PHASES = {
  PHASE_EXPORT: 'phase-export',
  PHASE_PRODUCTION_BUILD: 'phase-production-build',
  PHASE_PRODUCTION_SERVER: 'phase-production-server',
  PHASE_DEVELOPMENT_SERVER: 'phase-development-server'
};

module.exports = (phase, { defaultConfig }) => {
  // console.log('config', defaultConfig);
  const config = {
    distDir: 'build',
    compress: false,
    poweredByHeader: false,
    serverRuntimeConfig: {
      app: {
        name: packageJSON.name
      }
      // routes: require('./routes.json')
    },
    publicRuntimeConfig: {}
  };

  if (phase === PHASES.PHASE_DEVELOPMENT_SERVER) {
    // Dev only
  }

  return config;
};

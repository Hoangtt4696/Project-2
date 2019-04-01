import getEnv from 'getenv';

const config = {
  client: getEnv.bool('CLIENT', true),
};

export default config;

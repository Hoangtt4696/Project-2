import dev from './dev-config';

const NODE_ENV = process.env.NODE_ENV || 'development';

const customEnv = () => {
  switch (NODE_ENV) {
    case 'development':
      return dev;

    default:
      return {
        client: true,
      };
  }
};

export default {
  NODE_ENV,
  ...customEnv(),
};

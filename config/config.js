/**
 * Module dependencies.
 */
import _ from 'lodash';
import chalk from 'chalk';
import glob from 'glob';

import defaultConfig from './env/default';
import devConfig from './env/development';
import prodConfig from './env/production';

/**
 * Validate NODE_ENV existence
 */
const validateEnvironmentVariable = () => {
  const environmentFiles = glob.sync(`./config/env/${process.env.NODE_ENV}.js`);

  if (!environmentFiles.length) {
    if (process.env.NODE_ENV) {
      console.error(chalk.red(`+ Error: No configuration file found for ${process.env.NODE_ENV} environment using development instead`));
    } else {
      console.error(chalk.red('+ Error: NODE_ENV is not defined! Using default development environment'));
    }

    process.env.NODE_ENV = 'development';
  }

  // Reset console color
  console.log(chalk.white(''));
};

/**
 * Initialize global configuration
 */
const initGlobalConfig = () => {
  // Validate NODE_ENV existence
  validateEnvironmentVariable();

  // Get the current config
  const environmentConfig = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

  return _.merge(defaultConfig, environmentConfig);
};

/**
 * Set configuration object
 */
module.exports = initGlobalConfig();

/* eslint no-console: 0 */

// Import Utils
import { callApi } from '../apiCaller';

export const get = async () => {
  try {
    return await callApi('shop');
  } catch (e) {
    console.error(e);

    return Promise.resolve();
  }
};

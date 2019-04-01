/* eslint no-console: 0 */

// Import Utils
import { callApi } from '../apiCaller';

export const load = async (settings = []) => {
  try {
    return await callApi('settings', {
      params: {
        settings: settings.join(','),
      },
    });
  } catch (e) {
    console.error(e);

    return Promise.resolve();
  }
};

export const save = async settings => {
  try {
    return await callApi('settings', {
      method: 'POST',
      body: {
        settings,
      },
    });
  } catch (e) {
    console.error(e);

    return Promise.resolve();
  }
};

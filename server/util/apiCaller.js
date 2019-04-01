import * as queryString from 'querystring';
import fetch from 'node-fetch';
import _merge from 'lodash/merge';

import log from './loggerUtil';

export const callApi = async (endpoint, options = { method: 'GET' }) => {
  options = _merge({
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }, options || {});

  if (options.body) {
    options.body = JSON.stringify(options.body);
  }

  const query = queryString.stringify({
    ...options.params,
  });

  try {
    const resp = await fetch(`${endpoint}?${query}`, options);
    const contentType = resp.headers.get('Content-Type') || '';

    if (contentType.includes('application/json')) {
      return await resp.json();
    }

    if (resp.status === 200) {
      return resp;
    }

    return Promise.resolve();
  } catch (e) {
    log.error(e);

    return Promise.resolve();
  }
};

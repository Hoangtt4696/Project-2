import _merge from 'lodash/merge';
import fetch from 'isomorphic-fetch';
import * as queryString from 'querystring';

import Config from '../../config/config';

export const API_URL = (typeof window === 'undefined' || process.env.NODE_ENV === 'test') ?
  process.env.BASE_URL || (`http://localhost:${Config.port}/api`) :
  '/api';

export default function callApiPromise(endpoint, method = 'get', body) {
  return fetch(`${API_URL}/${endpoint}`, {
    headers: { 'content-type': 'application/json' },
    method,
    body: JSON.stringify(body),
    credentials: 'include',
  })
  .then(response => response.json().then(json => ({ json, response })))
  .then(({ json, response }) => {
    if (!response.ok) {
      return Promise.reject(json);
    }

    return json;
  })
  .then(
    response => response,
    error => error
  );
}

export const callApi = async (endpoint, options = { method: 'GET' }) => {
  options = _merge({
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }, options || {});

  if (options.body) {
    options.body = JSON.stringify(options.body);
  }

  const query = queryString.stringify({
    shop: window.shopname,
    timestamp: window.timestamp,
    signature: window.signature,
    code: window.code,
    ...options.params,
  });

  try {
    const resp = await fetch(`${API_URL}/${endpoint}?${query}`, options);

    return await resp.json();
  } catch (e) {
    console.error(e);
  }
};

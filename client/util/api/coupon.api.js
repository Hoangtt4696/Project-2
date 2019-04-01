import { callApi } from '../apiCaller';

export const get = async ({ type, filterData } = {}) => {
  try {
    return await callApi('coupons', {
      method: 'POST',
      body: {
        type,
        filterData,
      },
    });
  } catch (e) {
    console.error(e);

    return Promise.resolve();
  }
};

export const count = async ({ type, filterData } = {}) => {
  try {
    return await callApi('coupons/count', {
      method: 'POST',
      body: {
        type,
        filterData,
      },
    });
  } catch (e) {
    console.error(e);

    return Promise.resolve();
  }
};

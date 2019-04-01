// Import Third-party Libs
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';

// Import Actions
import { showToast } from '../../App/AppActions';

// Import Utils
import { get as getShopApi } from '../../../util/api/shop.api';

// Import Consts
import { TOAST_MESSAGE } from '../../../consts/common.const';

export const GET_SHOP = 'GET_SHOP';

export const getShop = shop => {
  return {
    type: GET_SHOP,
    payload: {
      shop,
    },
  };
};

export const fetchShop = () => {
  return async (dispatch, getState) => {
    const state = getState();

    if (!_isEmpty(_get(state, 'shop.data'))) {
      return Promise.resolve();
    }

    const result = await getShopApi();

    if (_get(result, 'error.code') !== 0) {
      return dispatch(showToast({
        type: TOAST_MESSAGE.TYPE.ERROR,
        message: result.error.message,
      }));
    }

    dispatch(getShop(result.data));
  };
};

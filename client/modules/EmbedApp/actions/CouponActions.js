/* eslint consistent-return: 1 */

// Import Third-party Libs
import _get from 'lodash/get';

// Import Actions
import { showToast } from '../../App/AppActions';

// Import Utils
import {
  get as getCouponApi,
  count as countCouponApi,
} from '../../../util/api/coupon.api';

// Import Consts
import { TOAST_MESSAGE } from '../../../consts/common.const';

export const GET_COUPON = 'GET_COUPON';
export const COUNT_COUPON = 'COUNT_COUPON';
export const EXPORT_COUPON = 'EXPORT_COUPON';

export const getCoupon = data => {
  return {
    type: GET_COUPON,
    payload: {
      ...data,
    },
  };
};

export const getCount = data => {
  return {
    type: COUNT_COUPON,
    payload: {
      data,
    },
  };
};

export const getExport = () => {
  return {
    type: EXPORT_COUPON,
  };
};

export const fetchCoupon = ({ type, filterData }) => {
  return async (dispatch) => {
    const result = await getCouponApi({
      type,
      filterData,
    });

    if (!result || _get(result, 'error.code') !== 0) {
      return dispatch(showToast({
        type: TOAST_MESSAGE.TYPE.ERROR,
        message: _get(result, 'error.message', 'Có lỗi xảy ra'),
      }));
    }

    dispatch(getCoupon(_get(result, 'data')));
  };
};

export const countCoupon = ({ type, filterData } = {}) => {
  return async (dispatch) => {
    const result = await countCouponApi({
      type,
      filterData,
    });

    if (!result || _get(result, 'error.code') !== 0) {
      return dispatch(showToast({
        type: TOAST_MESSAGE.TYPE.ERROR,
        message: _get(result, 'error.message', 'Có lỗi xảy ra'),
      }));
    }

    dispatch(getCount(_get(result, 'data')));
  };
};

export const exportCoupon = ({ type, filterData }) => {
  return async (dispatch) => {
    const result = await getCouponApi({
      type,
      filterData: {
        ...filterData,
        isExport: true,
      },
    });

    if (!result || _get(result, 'error.code') !== 0) {
      return dispatch(showToast({
        type: TOAST_MESSAGE.TYPE.ERROR,
        message: _get(result, 'error.message', 'Có lỗi xảy ra'),
      }));
    }

    dispatch(showToast({
      type: TOAST_MESSAGE.TYPE.INFO,
      message: _get(
        result,
        'error.message',
        'Dữ liệu đang được xử lý và sẽ được gửi qua email khi thành công'
      ),
    }));

    dispatch(getExport());
  };
};

// Import Third-party Libs
import _get from 'lodash/get';
import Immutable from 'seamless-immutable';

// Import Actions Const
import {
  GET_COUPON,
  COUNT_COUPON,
  EXPORT_COUPON,
} from '../actions/CouponActions';

// Initial State
const initialState = Immutable({
  data: {
    records: [],
    totalRecord: 0,
  },
});

const CouponReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_COUPON:
      return state.set('data', action.payload);

    case COUNT_COUPON:
      return state.set('data', {
        totalRecord: action.payload.data,
      });

    case EXPORT_COUPON:
      return state;

    default:
      return initialState.merge(state);
  }
};

/* Selectors */

// Get coupon
export const getCoupon = state => _get(state, 'coupon.data', {});
export const getCount = state => _get(state, 'coupon.data.totalRecord', 0);

// Export Reducer
export default CouponReducer;

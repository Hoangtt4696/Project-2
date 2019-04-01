// Import Third-party Libs
import _get from 'lodash/get';
import Immutable from 'seamless-immutable';

// Import Actions Const
import { GET_SHOP } from '../actions/ShopActions';

// Initial State
const initialState = Immutable({
  data: {},
});

const ShopReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SHOP:
      return state.set('data', _get(action, 'payload.shop'));

    default:
      return initialState.merge(state);
  }
};

/* Selectors */

// Get shop
export const getShop = state => _get(state, 'shop.data', {});

// Export Reducer
export default ShopReducer;

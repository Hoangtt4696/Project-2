/**
 * Root Reducer
 */
import { combineReducers } from 'redux';

// Import Reducers
import app from './modules/App/AppReducer';
import intl from './modules/Intl/IntlReducer';
import shop from './modules/EmbedApp/reducers/ShopReducer';
import setting from './modules/EmbedApp/reducers/SettingReducer';
import coupon from './modules/EmbedApp/reducers/CouponReducer';

// Combine all reducers into one root reducer
export default combineReducers({
  app,
  intl,
  shop,
  setting,
  coupon,
});

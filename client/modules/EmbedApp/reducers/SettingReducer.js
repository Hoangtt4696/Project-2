// Import Third-party Libs
import _get from 'lodash/get';
import Immutable from 'seamless-immutable';

// Import Actions Const
import { LOAD_SETTING, SAVE_SETTING } from '../actions/SettingActions';

// Initial State
const initialState = Immutable({
  data: {},
});

const SettingReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SETTING:
      return state.set('data', _get(action, 'payload.settings'));

    case SAVE_SETTING:
      return state.set('data', _get(action, 'payload.settings'));

    default:
      return initialState.merge(state);
  }
};

/* Selectors */

// Get setting
export const getSetting = state => JSON.parse(JSON.stringify(_get(state, 'setting.data', {})));

// Export Reducer
export default SettingReducer;

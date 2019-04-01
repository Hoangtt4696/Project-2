// Import Third-party Libs
import _get from 'lodash/get';

// Import Actions
import { showToast } from '../../App/AppActions';

// Import Utils
import {
  load as loadSettingApi,
  save as saveSettingApi,
} from '../../../util/api/setting.api';

// Import Consts
import { TOAST_MESSAGE } from '../../../consts/common.const';

export const LOAD_SETTING = 'LOAD_SETTING';
export const SAVE_SETTING = 'SAVE_SETTING';

export const getSetting = settings => {
  return {
    type: LOAD_SETTING,
    payload: {
      settings,
    },
  };
};

export const saveSetting = settings => {
  return {
    type: SAVE_SETTING,
    payload: {
      settings,
    },
  };
};

export const fetchSettings = (settings = []) => {
  return async (dispatch) => {
    const result = await loadSettingApi(settings);

    if (_get(result, 'error.code') !== 0) {
      return dispatch(showToast({
        type: TOAST_MESSAGE.TYPE.ERROR,
        message: result.error.message,
      }));
    }

    dispatch(getSetting(_get(result, 'data.settings')));
  };
};

export const saveSettings = settings => {
  return async dispatch => {
    const result = await saveSettingApi(settings);

    if (_get(result, 'error.code') !== 0) {
      dispatch(showToast({
        type: TOAST_MESSAGE.TYPE.ERROR,
        message: result.error.message,
      }));
    } else {
      dispatch(showToast({
        type: TOAST_MESSAGE.TYPE.SUCCESS,
        message: result.error.message,
      }));
    }

    dispatch(saveSetting(_get(result, 'data.settings')));
  };
};

import { TOAST_MESSAGE } from '../../consts/common.const';

// Export Constants
export const TOGGLE_ADD_POST = 'TOGGLE_ADD_POST';
export const SHOW_TOAST = 'SHOW_TOAST';

// Export Actions
export function toggleAddPost() {
  return {
    type: TOGGLE_ADD_POST,
  };
}

export function showToast({ type = TOAST_MESSAGE.TYPE.INFO, message }) {
  return {
    type: SHOW_TOAST,
    toast: {
      type,
      message,
    },
  };
}

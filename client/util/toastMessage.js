import { TOAST_MESSAGE } from '../consts/common.const';

export const toast = ({ type = TOAST_MESSAGE.TYPE.INFO, message }) => {
  if (window.parent) {
    window.parent.postMessage({
      functionname: 'toastr',
      type,
      message,
    }, '*');
  }
};

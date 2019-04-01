/* eslint consistent-return: 1 */

import _get from 'lodash/get';
import _xor from 'lodash/xor';
import { load as loadSetting } from '../models/helpers/setting.model.helper';

export const couponSettings = async (req, res, next) => {
  const shop = req.headers['haravan-shop-domain'] || '';

  if (_get(req.session, 'couponSettings.shop', '') === shop) {
    return next();
  }

  const settingFields = [
    'couponOrder',
    'couponCustomer',
    'emailOrder',
    'emailCustomer',
  ];

  const settings = await loadSetting(shop, settingFields.concat(['email']));
  const hasRequireSettings = _xor(
    Object.keys(_get(settings, 'settings', {})),
    settingFields
  );

  if (hasRequireSettings) {
    req.session.couponSettings = settings;
  }

  next();
};

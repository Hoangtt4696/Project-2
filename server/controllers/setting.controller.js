import sanitizeHtml from 'sanitize-html';

import { save as saveSetting, load as loadSetting } from '../models/helpers/setting.model.helper';
import { formatError, formatSuccess } from '../util/helpers/data-response.helper';

export const read = async (req, res) => {
  const shop = sanitizeHtml(req.session.shop);
  const settings = sanitizeHtml(req.query.settings || '');

  if (!shop) {
    return res.json(formatError({
      message: 'Thông tin shop không hợp lệ',
    }));
  }

  const result = await loadSetting(shop, settings ? settings.split(',') : []);

  res.json(formatSuccess({}, result));
};

export const update = async (req, res) => {
  const shop = sanitizeHtml(req.session.shop);
  const settings = req.body.settings;

  if (!shop) {
    return res.json(formatError({
      message: 'Thông tin shop không hợp lệ',
    }));
  }

  if (!settings) {
    return res.json(formatError({
      message: 'Thông tin cấu hình không hợp lệ',
    }));
  }

  const savedSettings = await saveSetting(shop, settings);

  res.json(formatSuccess({
    message: 'Lưu thông tin cấu hình thành công',
  }, savedSettings || null));
};

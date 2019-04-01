import _merge from 'lodash/merge';
import _get from 'lodash/get';

import SettingModel from '../setting';
import log from '../../util/loggerUtil';
import envConfig from '../../../config/config';
import { getShop } from './shop.model.helper';

export const load = (shop, fields = [], lean = true) => {
  const condition = {
    shop,
  };

  const projection = {
    shop: 1,
  };

  for (const field of fields) {
    if (field) {
      projection[`settings.${field}`] = 1;
    }
  }

  if (!fields.length) {
    projection.settings = 1;
  }

  try {
    return SettingModel
      .findOne(condition, projection)
      .lean(lean)
      .exec();
  } catch (e) {
    log.error(e);

    return Promise.resolve();
  }
};

export const save = (shop, settings = {}) => {
  const condition = {
    shop,
  };

  const updateQuery = {};

  for (const key of Object.keys(settings)) {
    updateQuery[`settings.${key}`] = settings[key];
  }

  const options = {
    new: true,
    upsert: true,
    returnNewDocument: true,
  };

  try {
    return SettingModel
      .findOneAndUpdate(condition, { $set: updateQuery }, options)
      .lean(true)
      .exec();
  } catch (e) {
    log.error(e);

    return Promise.resolve();
  }
};

export const init = async (shop, settings) => {
  try {
    const existSettings = await load(shop);

    if (existSettings) {
      return existSettings;
    }

    const newSettings = new SettingModel({ shop });

    if (settings && newSettings._doc) {
      newSettings._doc.settings = _merge(newSettings._doc.settings, settings);
    }

    return newSettings.save();
  } catch (e) {
    log.error(e);

    return Promise.resolve();
  }
};

export const initWithDefault = async (shop) => {
  const shopInfo = await getShop({ shop, fields: ['haravanSettings'] });

  const shopName = _get(shopInfo, 'haravanSettings.name', 'Thank You Coupon');
  const emailShop = _get(shopInfo, 'haravanSettings.email', envConfig.mailer.fromEmail);

  const emailSettings = {
    fromName: shopName,
    fromEmail: emailShop,
    content: '<div style="border: 1px solid #f5f5f5;">\n' +
      '   <div>\n' +
      '      <div style="padding: 1.3em; font-weight: bold; font-size: 1.2em; text-transform: uppercase; text-align: center; color: #fff; background-color: #007AB7;">GỬI TẶNG BẠN MÃ ƯU ĐÃI</div>\n' +
      '      <div style="padding: 2em;">\n' +
      '         <p style="white-space: pre-line; line-height: 1.4rem;">Cảm ơn bạn đã mua hàng tại {{shop_name}},</p>\n' +
      '         <p style="white-space: pre-line; line-height: 1.4rem;">Mong rằng bạn có trải nghiệm tốt khi mua hàng tại {{shop_name}}. {{shop_name}} xin gửi tặng bạn mã giảm giá cho lần mua hàng kế tiếp.</p>\n' +
      '         <div style="padding: 2em; text-align: center; background-color: #cafffa40;">\n' +
      '            <p style="font-weight: bold; font-size: 1.3em; text-align: center;">Khuyến mãi {{discount_amount}} cho đơn hàng kế tiếp</p>\n' +
      '            <p>Nhập mã khuyến mãi này cho đơn hàng kế tiếp để được giảm giá {{discount_amount}} giá trị đơn hàng.</p>\n' +
      '            <div style="background-color: #F70026; padding: 0.3em;">\n' +
      '               <div style="font-size: 1.5em; border: 2px dashed navajowhite; color: white; font-weight: bold; padding: 0.7em; text-align: center;">{{coupon_code}}</div>\n' +
      '            </div>\n' +
      '         </div>\n' +
      '      </div>\n' +
      '   </div>\n' +
      '   <p style="white-space: pre-wrap; line-height: 1.4rem; padding-left: 2rem;">Mã giảm giá</p>\n' +
      '   <p style="white-space: pre-wrap; line-height: 1.4rem; padding-left: 2rem;">- Chỉ được áp dụng một lần duy nhất.</p>\n' +
      '   <p style="white-space: pre-wrap; line-height: 1.4rem; padding-left: 2rem;">- Áp dụng cho {{apply_to}} {{apply_order_amount}}.</p>\n' +
      '   <p style="white-space: pre-wrap; line-height: 1.4rem; padding-left: 2rem;">- Có hiệu lực {{exp_date}}.</p>\n' +
      '   <p style="white-space: pre-wrap; line-height: 1.4rem; padding-left: 2rem;">Mọi thắc mắc và góp ý, xin quý khách vui lòng liên hệ với {{shop_name}} thông qua:</p>\n' +
      '   <p style="white-space: pre-wrap; line-height: 1.4rem; padding-left: 2rem;">Email: {{email_shop}}&nbsp;</p>\n' +
      '   <p style="white-space: pre-wrap; line-height: 1.4rem; padding-left: 2rem;">{{shop_name}} trân trọng cảm ơn và rất hân hạnh được phục vụ quý khách!</p>\n' +
      '</div>',
  };
  const emailOrder = _merge({}, emailSettings);
  const emailCustomer = _merge({}, emailSettings);

  emailOrder.subject = 'Quà tặng dành riêng cho các đơn hàng hoàn tất !';
  emailCustomer.subject = 'Quà tặng dành riêng cho các thành viên mới !';

  const settings = {
    emailCustomer,
    emailOrder,
  };

  try {
    return init(shop, settings);
  } catch (e) {
    log.error(e);

    return Promise.resolve();
  }
};


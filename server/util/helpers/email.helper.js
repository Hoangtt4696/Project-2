import _get from 'lodash/get';
import { formatMoney } from './haravan.helper';
import { sendEmailWithTemplate, sendEmailWithoutTemplate } from '../haravanEmailUtil';
import envConfig from '../../../config/config';
import moment from 'moment/moment';
import _replace from 'lodash/replace';

// Function helpers
const replaceVarMail = ({ couponSettings = {}, shopData = {}, content = '' }) => {
  const applyToReplacement = couponSettings.applies_to_resource === 'customer' ?
    'khách hàng nhận mã khuyến mãi' :
    'giá trị đơn hàng từ';
  const applyOrderAmountReplacement = couponSettings.applies_to_resource === 'customer' ?
    '' : `${formatMoney({ number: couponSettings.minimum_order_amount })}đ`;

  const discountAmountReplacement = couponSettings.discount_type === 'percentage' ?
    `${couponSettings.value}%` :
    `${formatMoney({ number: couponSettings.value })}đ`;

  let expDateReplacement = 'vô thời hạn';

  if (couponSettings.ends_at) {
    expDateReplacement = `đến ngày ${moment(couponSettings.ends_at).format('DD/MM/YYYY  HH:mm')}`;
  }

  const arrKey = [
    '{{shop_name}}',
    '{{email_shop}}',
    '{{discount_amount}}',
    '{{apply_to}}',
    '{{apply_order_amount}}',
    '{{exp_date}}',
    '{{coupon_code}}',
  ];

  const arrReplacement = [
    shopData.name || '',
    shopData.email || '',
    discountAmountReplacement,
    applyToReplacement,
    applyOrderAmountReplacement,
    expDateReplacement,
    couponSettings.code,
  ];

  const arrContent = arrKey.map((val, key) => {
    content = _replace(content, new RegExp(val, 'g'), arrReplacement[key]);
    return content;
  });

  return arrContent.slice(-1)[0];
};

export const sendExampleMail = async ({ toName, toEmail }) => {
  return await sendEmailWithTemplate({
    templateFile: 'example-email.template.html',
    toName,
    toEmail,
    subject: 'Example email',
    testData: 'something',
  });
};

export const sendCouponEmail = async ({ toName, toEmail, couponData }) => {
  const shopInfo = _get(couponData, 'shopData.haravanSettings', {});
  const discountType = _get(couponData, 'coupon.discount_type', '');
  const value = _get(couponData, 'coupon.value', 0);

  let discountAmount = `${value}%`;
  let content = _get(couponData, 'emailSettings.content', '');

  if (discountType === 'fixed_amount') {
    discountAmount = `${formatMoney({ number: value })}đ`;
  }

  if (couponData.coupon) {
    couponData.coupon.discountAmount = discountAmount;
    couponData.coupon.urlImage = `${envConfig.protocol}://${envConfig.hostname}:${envConfig.port}/images/imgCoupon.png`;
  }

  if (couponData.shopData) {
    couponData.shopData.email = _get(shopInfo, 'email', '');
    couponData.shopData.name = _get(shopInfo, 'name', '');
  }

  if (couponData.emailSettings) {
    content = replaceVarMail({
      couponSettings: couponData.coupon,
      shopData: couponData.shopData,
      content: couponData.emailSettings.content,
    });
  }

  return await sendEmailWithoutTemplate({
    fromEmail: _get(couponData, 'emailSettings.fromEmail', undefined),
    fromName: _get(couponData, 'emailSettings.fromName', undefined),
    toName,
    toEmail,
    subject: `${_get(couponData, 'emailSettings.subject', 'Gửi tặng bạn mã ưu đãi')} - ${_get(couponData, 'shopInfo.name', couponData.shop)}`,
    content,
  });
};

export const sendExportEmail = async ({ toName, toEmail, data }) => {
  return await sendEmailWithTemplate({
    templateFile: 'export-email.template.html',
    toName,
    toEmail,
    subject: `Xuất file danh sách ${_get(data, 'subjectType', '')}`,
    data,
  });
};

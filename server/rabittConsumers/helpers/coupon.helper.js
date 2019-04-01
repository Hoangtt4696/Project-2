import _get from 'lodash/get';
import moment from 'moment';
import randomID from 'random-id';

import log from '../../util/loggerUtil';
import { create as createCouponApi } from '../../util/api/coupon.api';
import { sendCouponEmail } from '../../util/helpers/email.helper';
import { saveCoupon } from '../../models/helpers/coupon.model.helper';
import { getShop } from '../../models/helpers/shop.model.helper';
import HaravanAPIUtil from '../../util/haravanApiUtil';

export const renewAccessToken = async (shopData) => {
  const HaravanAPI = new HaravanAPIUtil({
    shop: shopData._id,
    access_token: _get(shopData, 'authorize.accessToken'),
    refresh_token: _get(shopData, 'authorize.refreshToken'),
  });

  if (shopData.authorize.expiresIn > Date.now()) {
    return Promise.resolve(HaravanAPI);
  }

  const shopInfo = await getShop({
    shop: HaravanAPI.config.shop,
  });

  if (!shopInfo) {
    return Promise.resolve();
  }

  if (_get(shopInfo, '_id') && _get(shopInfo, 'authorize.accessToken')) {
    HaravanAPI.config.access_token = shopInfo.authorize.accessToken;
    HaravanAPI.config.refresh_token = shopInfo.authorize.refreshToken;

    return Promise.resolve(HaravanAPI);
  }

  return Promise.resolve();
};

export const createNewCoupon = async (HaravanAPI, {
  id = null,
  useWithPromotion,
  expDate,
  discountType,
  discountAmount,
  applyOrderAmount,
  applyTo,
  prefix,
  neverExpire,
  endAt,
}) => {
  const startsAt = moment().add(7, 'hours');
  let endsAt = moment();

  if (expDate !== null) {
    endsAt = moment()
      .add(expDate, 'days')
      .add(7, 'hours');
  } else {
    endsAt = neverExpire ?
      null :
      moment(endAt).add(7, 'hours');
  }

  return await createCouponApi(HaravanAPI, {
    isPromotion: useWithPromotion,
    startsAt,
    endsAt,
    appliesToResource: applyTo === 'customer' ? 'customer' : null,
    appliesToId: applyTo === 'customer' ? id : null,
    discountType,
    value: discountAmount,
    minimumOrderAmount: applyTo === 'order' ? applyOrderAmount : 0,
    code: `${prefix}${randomID(12 - prefix.length)}`,
    usageLimit: 1,
    setTimeActive: true,
  });
};

export const sendCoupon = async ({ email, shop, shopData, customer, newCoupon, emailSettings }) => {
  return await sendCouponEmail({
    toName: customer.name,
    toEmail: email,
    couponData: {
      shop,
      shopData,
      coupon: newCoupon,
      emailSettings,
    },
  });
};

export const createAndSendCoupon = async ({ couponSettings, type, data, shopData }) => {
  try {
    log.info({ shopData }, 'Prepaid to get access token');

    const HaravanAPI = await renewAccessToken(shopData);

    if (!HaravanAPI) {
      log.info({ data }, 'Get token failed');

      return Promise.resolve();
    }

    log.info({ data, couponSettings }, 'Token valid. SettingCoupon creating...');

    const newCoupon = await createNewCoupon(
      HaravanAPI,
      {
        id: data.customer.id,
        ...couponSettings,
      }
    );

    log.info({ data, couponSettings }, 'SettingCoupon created');

    if (!newCoupon) {
      log.info({ data, couponSettings }, 'Create coupon fail');

      return Promise.resolve();
    }

    log.info({ data, couponSettings }, 'Prepaid to send coupon');

    const sent = await sendCoupon({
      ...data,
      newCoupon,
    });

    if (sent) {
      log.info({ data, newCoupon }, 'Send coupon success. Save coupon to db');

      const savedCoupon = await saveCoupon({
        shop: data.shop,
        customer: data.customer,
        order: data.order,
        coupon: newCoupon,
        type,
      });

      if (savedCoupon) {
        log.info({ data, newCoupon }, 'SettingCoupon saved');
      } else {
        log.info({ data, newCoupon }, 'SettingCoupon not saved');
      }

      return savedCoupon;
    }

    log.info({ data, newCoupon, couponSettings, shopData }, 'Fail to send coupon');

    return Promise.resolve();
  } catch (e) {
    log.error(e);

    return Promise.resolve();
  }
};

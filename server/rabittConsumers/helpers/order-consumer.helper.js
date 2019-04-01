import _get from 'lodash/get';
import moment from 'moment';

import { validateOrderEmail } from '../../util/helpers/haravan.helper';
import { load as loadOrder, save as saveOrder } from '../../models/helpers/order.model.helper';
import { acquireLock, releaseLock } from '../../models/helpers/pessimistic-locking.model.helper';
import { createAndSendCoupon } from './coupon.helper';
import { updateCoupon } from '../../models/helpers/coupon.model.helper';
import log from '../../util/loggerUtil';

export const checkCouponAndUpdateStatus = async (order) => {
  const couponCode = order.discount_codes[0];
  const customerId = _get(order, 'customer.id', null);
  const criteria = {
    couponCode: couponCode.code,
    customerId,
  };

  return await updateCoupon({
    condition: criteria,
    newData: {
      status: 'used',
      refOrder: {
        customerEmail: order.email || null,
        customerId,
        orderNumber: order.order_number,
        createdAt: order.created_at,
        orderID: order.id,
      },
    },
    options: {
      new: true,
    },
  });
};

export const checkOrderBeforeSendCoupon = async ({ shop, shopData, order, couponSettings, emailSettings }) => {
  couponSettings = couponSettings || {};
  const { endAt, neverExpire, startAt, active } = couponSettings;

  if (order.discount_codes.length) {
    // noinspection JSIgnoredPromiseFromCall
    checkCouponAndUpdateStatus(order);
  }

  if (!active) {
    return Promise.resolve({
      done: true,
    });
  }

  if (active && ((!neverExpire && (moment(endAt) < moment())) || (moment(startAt) > moment()))) {
    return Promise.resolve({
      done: true,
    });
  }

  try {
    if (!(order.fulfillment_status === 'fulfilled' && order.financial_status === 'paid')) {
      return Promise.resolve({
        done: true,
      });
    }

    if (!validateOrderEmail(_get(order, 'customer.email'))) {
      return Promise.resolve({
        done: true,
      });
    }

    let orderReachDiscountPrice = false;

    if (couponSettings.applyTo === 'order') {
      orderReachDiscountPrice = order.total_price >= Number(couponSettings.applyOrderAmount);
    } else if (couponSettings.applyTo === 'customer') {
      orderReachDiscountPrice = true;
    }

    if (!orderReachDiscountPrice) {
      return Promise.resolve({
        done: true,
      });
    }

    const createdLock = await acquireLock({
      shop,
      prefix: 'order',
      id: order.id,
    });

    if (!createdLock) {
      return Promise.resolve({
        done: true,
      });
    }

    const savedOrder = await loadOrder({
      shop,
      orderId: order.id,
      fields: [
        'couponSent',
      ],
    });

    if (_get(savedOrder, 'couponSent', false)) {
      releaseLock({
        prefix: 'order',
        id: order.id,
        shop,
      });

      return Promise.resolve({
        done: true,
      });
    }

    log.info({ shop, order, couponSettings, emailSettings, shopData }, 'Start to send coupon');

    const mailSent = await createAndSendCoupon({
      couponSettings,
      data: {
        email: order.email || null,
        shop,
        shopData,
        customer: order.customer,
        emailSettings,
        order,
      },
      type: 'order',
      shopData,
    });

    if (!mailSent) {
      log.info({ shop, order, couponSettings, emailSettings, shopData }, 'Send coupon failed');

      releaseLock({
        prefix: 'order',
        id: order.id,
        shop,
      });

      return Promise.resolve({
        done: false,
      });
    }

    log.info({ shop, order, couponSettings, emailSettings, shopData }, 'Save order after send coupon');

    const result = await saveOrder({
      shop,
      order,
      couponSent: true,
      returnError: true,
    });

    releaseLock({
      prefix: 'order',
      id: order.id,
      shop,
    });

    if (result instanceof TypeError || !result) {
      log.info({ result, shop, order, couponSettings, emailSettings, shopData }, 'Save order after send coupon fail');
    } else {
      log.info({ result, shop, order, couponSettings, emailSettings, shopData }, 'Order saved after send coupon');
    }

    return Promise.resolve({
      done: true,
    });
  } catch (e) {
    log.error(e);

    return Promise.resolve({
      error: e,
    });
  }
};

import { createAndSendCoupon, renewAccessToken } from './coupon.helper';
import {
  save as saveCustomer,
  load as loadCustomer,
  update as updateCustomer,
} from '../../models/helpers/customer.model.helper';
import {
  remove as removeCoupon,
  list as getListIdDiscounts,
} from '../../models/helpers/coupon.model.helper';
import { remove as removeDiscount } from '../../util/api/coupon.api';
import { acquireLock, releaseLock } from '../../models/helpers/pessimistic-locking.model.helper';
import log from '../../util/loggerUtil';

// Import Third-party
import moment from 'moment';
import _get from 'lodash/get';

const processCustomerCreate = async ({ shop, customer, couponSettings, emailSettings, shopData }) => {
  if (customer.state.toLowerCase() === 'disabled') {
    log.info({ shop, customer, couponSettings, emailSettings, shopData }, 'Save new customer to db');

    saveCustomer({
      shop,
      customer,
    });

    return Promise.resolve();
  }

  const createdLock = await acquireLock({
    shop,
    prefix: 'customer',
    id: customer.id,
  });

  if (!createdLock) {
    return Promise.resolve();
  }

  log.info({ shop, customer, couponSettings, emailSettings, shopData }, 'Start to send coupon');

  const mailSent = await createAndSendCoupon({
    couponSettings,
    data: {
      email: customer.email || null,
      shop,
      shopData,
      customer,
      emailSettings,
    },
    type: 'customer',
    shopData,
  });

  if (!mailSent) {
    log.info({ shop, customer, couponSettings, emailSettings, shopData }, 'Send coupon failed');

    releaseLock({
      prefix: 'customer',
      id: customer.id,
      shop,
    });

    return Promise.reject('Sent mail failed');
  }

  log.info({ shop, customer, couponSettings, emailSettings, shopData }, 'Save customer after send coupon');

  const savedCustomer = saveCustomer({
    shop,
    customer,
    couponSent: true,
  });

  releaseLock({
    prefix: 'customer',
    id: customer.id,
    shop,
  });

  if (savedCustomer) {
    log.info({ savedCustomer, shop, customer, couponSettings, emailSettings, shopData }, 'Customer saved after send coupon');
  } else {
    log.info({ savedCustomer, shop, customer, couponSettings, emailSettings, shopData }, 'Save customer after send coupon fail');
  }

  return savedCustomer ? Promise.resolve() : Promise.reject('Customer not saved');
};

const processCustomerUpdate = async ({ shop, customer, couponSettings, emailSettings, shopData }) => {
  if (customer.state.toLowerCase() === 'disabled') {
    return Promise.resolve();
  }

  const createdLock = await acquireLock({
    shop,
    prefix: 'customer',
    id: customer.id,
  });

  if (!createdLock) {
    return Promise.resolve();
  }

  const savedCustomer = await loadCustomer({
    shop,
    customerId: customer.id,
    fields: [
      'id',
      'shop',
      'couponSent',
      'state',
    ],
  });

  if (!savedCustomer) {
    return Promise.resolve();
  }

  if (customer.state.toLowerCase() === 'enabled' && savedCustomer.state.toLowerCase() === 'enabled') {
    releaseLock({
      prefix: 'customer',
      id: customer.id,
      shop,
    });

    return Promise.resolve();
  } else if (
    customer.state.toLowerCase() === 'enabled' &&
    savedCustomer.state.toLowerCase() === 'disabled' &&
    !savedCustomer.couponSent
  ) {
    log.info({ shop, customer, couponSettings, emailSettings, shopData }, 'Start to send coupon');

    const mailSent = await createAndSendCoupon({
      couponSettings,
      data: {
        email: customer.email || null,
        shop,
        customer,
        emailSettings,
      },
      type: 'customer',
      shopData,
    });

    if (!mailSent) {
      log.info({ shop, customer, couponSettings, emailSettings, shopData }, 'Send coupon failed');

      releaseLock({
        prefix: 'customer',
        id: customer.id,
        shop,
      });

      return Promise.reject('Sent mail failed');
    }

    log.info({ shop, customer, couponSettings, emailSettings, shopData }, 'Update customer after send coupon');

    const updatedCustomer = updateCustomer({
      shop,
      customer: {
        id: savedCustomer.id,
        couponSent: true,
      },
    });

    releaseLock({
      prefix: 'customer',
      id: customer.id,
      shop,
    });

    if (updatedCustomer) {
      log.info({ updatedCustomer, shop, customer, couponSettings, emailSettings, shopData }, 'Customer updated after send coupon');
    } else {
      log.info({ updatedCustomer, shop, customer, couponSettings, emailSettings, shopData }, 'Update customer after send coupon fail');
    }

    return updatedCustomer ? Promise.resolve() : Promise.reject('Customer not updated');
  }

  return Promise.resolve();
};

export const checkCustomerBeforeSendCoupon = async ({
  shop,
  shopData,
  customer,
  couponSettings,
  emailSettings,
  type,
}) => {
  couponSettings = couponSettings || {};
  const { endAt, neverExpire, startAt, active } = couponSettings;

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
    switch (type) {
      case 'create':
        await processCustomerCreate({
          shop,
          customer,
          couponSettings,
          shopData,
          emailSettings,
        });

        return Promise.resolve({
          done: true,
        });

      case 'update':
        await processCustomerUpdate({
          shop,
          customer,
          couponSettings,
          shopData,
          emailSettings,
        });

        return Promise.resolve({
          done: true,
        });

      default:
        return Promise.resolve({
          done: true,
        });
    }
  } catch (e) {
    log.error(e);

    return Promise.resolve({
      done: false,
      error: e,
    });
  }
};

export const removeCouponAndDiscounts = async ({ shop, customer, shopData }) => {
  try {
    log.info({ customer, shopData }, 'Prepaid to get access token');

    const HaravanAPI = await renewAccessToken(shopData);

    if (!HaravanAPI) {
      log.info({ customer, shopData }, 'Get token failed');

      return Promise.resolve();
    }

    log.info({ customer, shopData }, 'Token valid');

    const idDiscounts = await getListIdDiscounts({
      criteria: {
        'discount.applies_to_id': customer.id,
        shop,
      },
      fields: ['discount.id'],
    });

    const couponDeleted = await removeCoupon({ shop, customer });

    if (!couponDeleted) {
      log.info({ customer, shopData }, 'Remove coupon fail');

      return Promise.resolve();
    }

    log.info({ customer, shopData }, 'Coupon deleted');

    idDiscounts.records.forEach(async discount => {
      const discountDeleted = await removeDiscount(HaravanAPI, { id: _get(discount, 'discount.id') });

      if (!discountDeleted) {
        log.info({ customer, shopData }, 'Remove discount fail');
      }
    });

    log.info({ customer, shopData }, 'Discounts deleted');

    return Promise.resolve();
  } catch (e) {
    log.error(e);

    return Promise.resolve();
  }
};

/* eslint no-console: 0 */

require('babel-register')({
  plugins: [
    [
      'babel-plugin-webpack-loaders',
      {
        config: './webpack.config.babel.js',
        verbose: false,
      },
    ],
  ],
});
require('babel-polyfill');

// Import Third-party Libs
const _get = require('lodash/get');
const _isEmpty = require('lodash/isEmpty');
const mongoose = require('mongoose');

// Import Models
const CouponModel = require('../server/models/coupon');

// Import Model Helpers
const CouponModelHelper = require('../server/models/helpers/coupon.model.helper');
const OrderModelHelper = require('../server/models/helpers/order.model.helper');

// Import Configs
const envConfig = require('../config/config');

const Promise = global.Promise;

// Set native promises as mongoose promise
mongoose.Promise = global.Promise;

async function bulkUpdateCustomerCoupons(items) {
  try {
    if (_isEmpty(items)) {
      return Promise.resolve();
    }

    const bulk = CouponModel.collection.initializeUnorderedBulkOp();

    items.forEach(item => {
      bulk
        .find({
          shop: item.shop,
          'discount.id': item.discount.id,
        })
        .updateOne({
          $set: {
            customerId: item.discount.applies_to_id,
          },
        });
    });

    return bulk.execute();
  } catch (e) {
    console.error(e);

    return Promise.resolve();
  }
}

async function bulkUpdateOrderCoupons(items) {
  try {
    if (_isEmpty(items)) {
      return Promise.resolve();
    }

    const bulk = CouponModel.collection.initializeUnorderedBulkOp();

    items.forEach(item => {
      if (!item) {
        return;
      }

      bulk
        .find({
          shop: item.shop,
          'discount.id': item.discountId,
        })
        .updateOne({
          $set: {
            customerId: item.customerId,
          },
        });
    });

    return bulk.execute();
  } catch (e) {
    console.error(e);

    return Promise.resolve();
  }
}

async function getCustomerIdFromOrders(orderIds) {
  try {
    const orders = await OrderModelHelper.list({
      criteria: {
        _id: {
          $in: orderIds,
        },
      },
      fields: [
        'email',
        'customer.id',
      ],
    });

    if (_isEmpty(orders)) {
      return null;
    }

    return orders.map(order => {
      return {
        orderId: order._id,
        customerEmail: order.email || null,
        customerId: order.customer.id,
      };
    });
  } catch (e) {
    console.error(e);

    return null;
  }
}

async function processOrderCoupons(items) {
  try {
    if (_isEmpty(items)) {
      return Promise.resolve();
    }

    const orderIds = items.map(item => item.orderID);
    const customerOrders = await getCustomerIdFromOrders(orderIds);
    const remapOrderCoupons = items.map(item => {
      const matchOrder = customerOrders.find(order => {
        return order.orderId == item.orderID && // eslint-disable-line eqeqeq
          order.customerEmail === item.customerEmail;
      });

      if (!matchOrder) {
        return undefined;
      }

      return {
        shop: item.shop,
        customerId: matchOrder.customerId,
        discountId: item.discount.id,
      };
    });

    if (_isEmpty(remapOrderCoupons)) {
      return Promise.resolve();
    }

    const result = await bulkUpdateOrderCoupons(remapOrderCoupons);

    return Promise.resolve(result);
  } catch (e) {
    console.error(e);

    return Promise.resolve();
  }
}

async function scriptExecute() {
  try {
    let page = 1;
    let coupons = null;

    do {
      coupons = await CouponModelHelper.listCoupon({
        criteria: {
          customerId: {
            $in: ['', null],
          },
        },
        fields: [
          'shop',
          'couponCode',
          'orderID',
          'customerEmail',
          'discount.id',
          'discount.applies_to_id',
          'discount.applies_to_resource',
        ],
        page,
        limit: 20,
      });

      if (_isEmpty(coupons)) {
        process.exit(0);
      }

      const customerCoupons = coupons.filter(item => {
        return item.discount && item.discount.applies_to_resource === 'customer' && item.discount.applies_to_id;
      });
      const orderCoupons = coupons.filter(item => {
        return item.discount && item.discount.applies_to_resource !== 'customer';
      });

      const updateCustomerCoupons = await bulkUpdateCustomerCoupons(customerCoupons);

      if (updateCustomerCoupons) {
        console.log(`Update customer coupons success: ${_get(updateCustomerCoupons, 'nModified', 0)}/${customerCoupons.length}`);
      }

      const updateOrderCoupons = await processOrderCoupons(orderCoupons);

      if (updateOrderCoupons) {
        console.log(`Update order coupons success ${_get(updateOrderCoupons, 'nModified', 0)}/${orderCoupons.length}`);
      }

      page++;
    } while (!_isEmpty(coupons));

    process.exit(0);
  } catch (e) {
    console.error(e);

    process.exit(0);
  }
}

module.exports.start = () => {
  mongoose.connect(
    envConfig.mongoURL,
    {
      server: {
        poolSize: envConfig.mongoPoolSize,
        socketOptions: { keepAlive: 1 },
        reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
        reconnectInterval: 1000,
      },
    }, (error) => {
      if (error) {
        console.error('Please make sure Mongodb is installed and running!');
        throw error;
      }

      // noinspection JSIgnoredPromiseFromCall
      scriptExecute();
    });
};

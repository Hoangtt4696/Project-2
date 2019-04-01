// Import Third-party Libs
import _isEmpty from 'lodash/isEmpty';
import moment from 'moment';

// Import Utils
import log from '../../util/loggerUtil';
import { executeQuery } from '../../util/helpers/mongoose-query.helper';

// Import Models
import CouponModel from '../coupon';

export const filter = async ({ criteria, page, limit, sort }) => {
  page = Number(page) || 1;
  limit = Number(limit) || 10;
  criteria = criteria || {};
  sort = sort || { createdAt: 1 };

  limit = limit > 10 ? 10 : limit;

  const excludeFields = {
    updatedAt: 0,
  };

  const count = await CouponModel.count(criteria);

  if (!count) {
    return Promise.resolve({
      records: [],
      totalRecord: 0,
    });
  }

  const cursor = await CouponModel
    .find(criteria, excludeFields)
    .skip((page * limit) - limit)
    .limit(limit)
    .sort(sort)
    .lean(true)
    .cursor();

  const records = [];

  await cursor.eachAsync(async (doc) => {
    records.push(doc);

    await Promise.resolve();
  });

  return Promise.resolve({
    records: records || [],
    totalRecord: count,
  });
};

export const query = ({
  shop,
  type,
  sumField,
  filterDataObj,
  queryType,
  dataType,
}) => {
  filterDataObj = _isEmpty(filterDataObj) ? {} : filterDataObj;
  filterDataObj.filters = filterDataObj.filters || [];

  filterDataObj.filters.push({
    operatorSymbol: 'eq',
    filterDataType: 'String',
    fieldName: 'shop',
    filterName: 'shop',
    lstFilterData: [
      {
        filterData: shop,
      },
    ],
  });

  if (type === 'customer') {
    filterDataObj.filters.push({
      operatorSymbol: 'eq',
      filterDataType: 'String',
      fieldName: 'orderID',
      filterName: 'orderID',
      lstFilterData: [
        {
          filterData: null,
        },
      ],
    });
  } else if (type === 'order') {
    filterDataObj.filters.push({
      operatorSymbol: '$ne',
      filterDataType: 'String',
      fieldName: 'orderID',
      filterName: 'orderID',
      lstFilterData: [
        {
          filterData: null,
        },
      ],
    });
  }

  return executeQuery({
    model: CouponModel,
    modelName: 'Coupon',
    sumField,
    filterDataObj,
    queryType,
    dataType,
  });
};

export const saveCoupon = ({ shop, coupon, customer, order, type }) => {
  try {
    return CouponModel.create({
      shop,
      couponCode: coupon.code,
      orderID: type === 'order' ? order.id : null,
      status: 'new',
      orderNumber: type === 'order' ? order.order_number : null,
      orderCreatedAt: type === 'order' ? order.created_at : null,
      customerEmail: customer.email || null,
      customerId: customer.id,
      registerDate: type === 'customer' ? customer.created_at : null,
      startDate: coupon.starts_at,
      endDate: coupon.ends_at,
      discount: coupon,
    });
  } catch (e) {
    log.error(e);

    return Promise.resolve();
  }
};

export const updateCoupon = ({ condition, newData, options = {} }) => {
  try {
    return CouponModel
      .findOneAndUpdate(condition, { $set: newData }, options);
  } catch (e) {
    log.error(e);

    return Promise.resolve();
  }
};

export const remove = ({ shop, customer }) => {
  const condition = {
    'discount.applies_to_id': customer.id,
    shop,
  };

  try {
    return CouponModel
      .remove(condition)
      .exec();
  } catch (e) {
    log.error(e);

    return Promise.resolve();
  }
};

export const list = async ({ criteria = {}, fields = [] } = {}) => {
  try {
    const filterField = {};

    fields.forEach((field) => {
      filterField[field] = 1;
    });

    const count = await CouponModel.count(criteria);

    if (!count) {
      return Promise.resolve({
        records: [],
      });
    }

    const cursor = await CouponModel
      .find(criteria)
      .select(filterField)
      .lean(true)
      .cursor();

    const records = [];

    await cursor.eachAsync(async (doc) => {
      records.push(doc);

      await Promise.resolve();
    });

    return Promise.resolve({
      records: records || [],
    });
  } catch (e) {
    log.error(e);

    return Promise.resolve({
      records: [],
    });
  }
};

export const listCoupon = async ({ criteria = {}, page = 1, limit = 20, fields = [], lean = true }) => {
  page = Number(page) || 1;
  limit = Number(limit) || 10;

  const projection = {};

  if (fields && fields.length) {
    for (const field of fields) {
      if (field) {
        projection[field] = 1;
      }
    }
  }

  try {
    const cursor = CouponModel
      .find(criteria, projection)
      .skip((page * limit) - limit)
      .limit(limit)
      .lean(lean)
      .cursor();

    const records = [];

    await cursor.eachAsync(async (doc) => {
      records.push(doc);

      await Promise.resolve();
    });

    return Promise.resolve(records);
  } catch (e) {
    log.error(e);

    return Promise.resolve();
  }
};

export const bulkUpdate = (shop, items) => {
  try {
    const bulk = CouponModel.collection.initializeUnorderedBulkOp();

    if (_isEmpty(items)) {
      return Promise.resolve();
    }

    items.forEach(item => {
      const currentDate = moment();
      const endDate = item.ends_at ? moment(item.item.ends_at).toDate() : null;
      let couponStatus = null;

      if (endDate && currentDate > endDate && item.usage_limit !== item.times_used) {
        couponStatus = ''; // Expired
      } else if (item.usage_limit === item.times_used) {
        couponStatus = 'used';
      }

      const updateData = {
        'discount.status': item.status,
        'discount.times_used': item.times_used,
        updatedAt: new Date(),
      };

      if (couponStatus !== null) { // not set status if null
        updateData.status = couponStatus;
      }

      bulk
        .find({
          'discount.id': item.id,
          'discount.code': item.code,
          shop,
        })
        .updateOne({
          $set: updateData,
        });
    });

    return bulk.execute();
  } catch (e) {
    log.error(e);

    return Promise.resolve({
      error: e,
    });
  }
};

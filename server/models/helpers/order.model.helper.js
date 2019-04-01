import OrderModel from '../order';
import log from '../../util/loggerUtil';

export const save = ({ shop, order, couponSent = false, returnError = false }) => {
  const { id, ...orderData } = order; // eslint-disable-line no-unused-vars
  const condition = {
    _id: id,
    shop,
  };
  const updateData = {
    _id: id,
    shop,
    ...order,
    couponSent,
  };

  const options = {
    new: true,
    upsert: true,
    returnNewDocument: true,
  };

  try {
    return OrderModel
      .findOneAndUpdate(condition, { $set: updateData }, options)
      .exec();
  } catch (e) {
    log.error(e);

    return Promise.resolve(returnError ? e : null);
  }
};

export const load = ({ shop, orderId, fields = [] }) => {
  const condition = {
    _id: orderId,
    shop,
  };
  const projection = {};

  if (fields && fields.length) {
    for (const field of fields) {
      if (field) {
        projection[field] = 1;
      }
    }
  }

  try {
    return OrderModel
      .findOne(condition, projection)
      .lean()
      .exec();
  } catch (e) {
    log.error(e);

    return Promise.resolve();
  }
};

export const update = ({ shop, order }) => {
  const { _id, ...orderData } = order;
  const condition = {
    _id,
    shop,
  };

  const updateData = {
    ...orderData,
  };

  const options = {
    new: true,
    upsert: true,
    returnNewDocument: true,
  };

  try {
    return OrderModel
      .findOneAndUpdate(condition, { $set: updateData }, options)
      .exec();
  } catch (e) {
    log.error(e);

    return Promise.resolve();
  }
};

export const remove = ({ shop, order }) => {
  const condition = {
    _id: order.id,
    shop,
  };

  try {
    return OrderModel
      .findOneAndRemove(condition)
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

    const count = await OrderModel.count(criteria);

    if (!count) {
      return Promise.resolve();
    }

    const cursor = await OrderModel
      .find(criteria)
      .select(filterField)
      .lean(true)
      .cursor();

    const records = [];

    await cursor.eachAsync(async (doc) => {
      records.push(doc);

      await Promise.resolve();
    });

    return Promise.resolve(records || []);
  } catch (e) {
    log.error(e);

    return Promise.resolve();
  }
};

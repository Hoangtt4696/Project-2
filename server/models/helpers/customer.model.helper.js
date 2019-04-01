import CustomerModel from '../customer';
import log from '../../util/loggerUtil';

export const save = ({ shop, customer, couponSent = false }) => {
  const { id, ...customerData } = customer; // eslint-disable-line no-unused-vars
  const condition = {
    _id: id,
    shop,
  };
  const updateData = {
    _id: id,
    shop,
    ...customer,
    couponSent,
  };

  const options = {
    new: true,
    upsert: true,
    returnNewDocument: true,
  };

  try {
    return CustomerModel
      .findOneAndUpdate(condition, { $set: updateData }, options)
      .exec();
  } catch (e) {
    log.error(e);

    return Promise.resolve();
  }
};

export const load = ({ shop, customerId, fields = [] }) => {
  const condition = {
    _id: customerId,
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
    return CustomerModel
      .findOne(condition, projection)
      .lean()
      .exec();
  } catch (e) {
    log.error(e);

    return Promise.resolve();
  }
};

export const update = ({ shop, customer }) => {
  const { _id, ...customerData } = customer;
  const condition = {
    _id,
    shop,
  };

  const updateData = {
    ...customerData,
  };

  const options = {
    new: true,
    upsert: true,
    returnNewDocument: true,
  };

  try {
    return CustomerModel
      .findOneAndUpdate(condition, { $set: updateData }, options)
      .exec();
  } catch (e) {
    log.error(e);

    return Promise.resolve();
  }
};

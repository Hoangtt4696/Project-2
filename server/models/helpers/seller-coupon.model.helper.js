// Import Third-party Libs
import _isEmpty from 'lodash/isEmpty';

// Import Utils
import log from '../../util/loggerUtil';

// Import Models
import SellerCouponModel from '../seller-coupon';

export const lastUpdate = async shop => {
  try {
    const lastItems = await SellerCouponModel
      .find({ shop }, { updatedAt: 1 })
      .sort({ updatedAt: -1 })
      .limit(1)
      .lean(true)
      .exec();

    if (lastItems && lastItems.length) {
      return Promise.resolve(lastItems[0].updatedAt);
    }

    return Promise.resolve();
  } catch (e) {
    log.error(e);

    return Promise.resolve();
  }
};

export const bulkAdd = (shop, items) => {
  try {
    const bulk = SellerCouponModel.collection.initializeUnorderedBulkOp();

    if (_isEmpty(items)) {
      return Promise.resolve();
    }

    items.forEach(item => {
      bulk
        .find({
          id: item.id,
          shop,
        })
        .upsert()
        .updateOne({
          $setOnInsert: {
            createdAt: new Date(),
          },
          $set: {
            ...item,
            shop,
            updatedAt: new Date(),
          },
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

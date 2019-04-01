import ShopModel from '../shop';
import log from '../../util/loggerUtil';

export const getShop = ({ shop, fields = ['status', 'authorize'] }, lean = true) => {
  const condition = {
    _id: shop,
    status: 1,
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
    return ShopModel
      .findOne(condition, projection)
      .lean(lean)
      .exec();
  } catch (e) {
    log.error(e);

    return Promise.resolve();
  }
};

export const listShop = async ({ page = 1, limit = 20, fields = [], lean = true }) => {
  page = Number(page) || 1;
  limit = Number(limit) || 10;

  const condition = {
    status: 1,
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
    const cursor = ShopModel
      .find(condition, projection)
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

export const updateAuthorize = ({ shop, status, data = {}, returnError = false }) => {
  const condition = {
    _id: shop,
  };

  const updateData = {
    _id: shop,
    authorize: {
      accessToken: data.accessToken || '',
      refreshToken: data.refreshToken || '',
      expiresIn: data.expiresIn || 0,
    },
    status,
  };

  if (data.haravanSettings) {
    updateData.haravanSettings = data.haravanSettings;
  }

  const options = {
    new: true,
    returnNewDocument: true,
    upsert: true,
  };

  try {
    return ShopModel
      .findOneAndUpdate(condition, { $set: updateData }, options)
      .lean(true)
      .exec();
  } catch (e) {
    log.error(e);

    return Promise.resolve(returnError ? e : null);
  }
};

export const updateSettings = ({ shop, settings, returnError = false }) => {
  const condition = {
    _id: shop,
    status: 1,
  };

  const updateData = {
    haravanSettings: settings,
  };

  const options = {
    new: true,
    returnNewDocument: true,
  };

  try {
    return ShopModel
      .findOneAndUpdate(condition, { $set: updateData }, options)
      .lean(true)
      .exec();
  } catch (e) {
    log.error(e);

    return Promise.resolve(returnError ? e : null);
  }
};

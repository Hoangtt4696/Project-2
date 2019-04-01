// Import Third-party Libs
import _get from 'lodash/get';

// Import Utils
import log from '../../util/loggerUtil';

// Import Models
import PessimisticLockingModel from '../pessimistic-locking';

export const acquireLock = async ({ shop, prefix = '', id, aid }) => {
  try {
    const result = await PessimisticLockingModel.create({
      id: `${prefix ? `${prefix}_` : ''}${id}`,
      shop,
      aid,
    });

    return Promise.resolve(result);
  } catch (e) {
    // Should ignore duplicate error logging
    if (!_get(e, 'message', '').includes('E11000')) {
      log.error(e);
    }

    return Promise.resolve();
  }
};

export const releaseLock = ({ prefix, id, aid, shop }) => {
  const condition = {
    shop,
  };

  if (id) {
    condition.id = prefix ? `${prefix}_${id}` : id;
  }

  if (aid) {
    condition.aid = aid;
  }

  try {
    return PessimisticLockingModel
      .remove(condition)
      .exec();
  } catch (e) {
    log.error(e);

    return Promise.resolve();
  }
};

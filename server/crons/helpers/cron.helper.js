// Import Utils
import log from '../../util/loggerUtil';

// Import Cron-Jobs
import SyncCouponJob from '../sync-coupon.cron';

// Import Configs
import envConfig from '../../../config/config';

const cronConfig = envConfig.cron;

const crons = [
  {
    active: cronConfig.syncCoupon.active,
    cron: SyncCouponJob,
  },
];

export const start = () => {
  try {
    if (!envConfig.cronActive) {
      return;
    }

    crons.forEach(item => {
      if (item.active) {
        item.cron.start();
      }
    });
  } catch (e) {
    log.error(e);
  }
};

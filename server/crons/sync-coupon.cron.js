// Import Third-party Libs
import _isEmpty from 'lodash/isEmpty';
import { CronJob } from 'cron';

// Import Utils
import rabbitmq from '../util/rabbitmqUtil';

// Import Model Helpers
import { lastUpdate as couponLastUpdate } from '../models/helpers/seller-coupon.model.helper';
import { listShop } from '../models/helpers/shop.model.helper';

// Import Configs
import envConfig from '../../config/config';

const cronConfig = envConfig.cron;
const rabbitConfig = envConfig.rabbitmq;
const rabbitQueues = rabbitConfig.queues;

const SyncCouponJob = new CronJob({
  cronTime: cronConfig.syncCoupon.time,
  onTick: async () => {
    const currentTime = new Date();

    let page = 1;
    let shops = null;

    do {
      shops = await listShop({
        page,
        fields: [
          '_id',
          'authorize.accessToken',
        ],
      });

      if (_isEmpty(shops)) {
        break;
      }

      shops.forEach(async shop => {
        const lastUpdateTime = await couponLastUpdate(shop);

        rabbitmq.sendMessage({
          queueName: rabbitQueues.syncCoupon.queueName,
          msg: {
            shop: shop._id,
            accessToken: shop.authorize.accessToken,
            fromDate: lastUpdateTime,
            toDate: currentTime,
          },
        });
      });

      page++;
    } while (!_isEmpty(shops));
  },
  start: false,
  timeZone: 'Asia/Ho_Chi_Minh',
});

export default SyncCouponJob;

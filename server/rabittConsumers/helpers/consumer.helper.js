import log from '../../util/loggerUtil';
import envConfig from '../../../config/config';
import ShopUpdateConsumer from '../shop-update.consumer';
import AppUninstalledConsumer from '../app-uninstalled.consumer';
import OrderConsumer from '../order.consumer';
import OrderRemoveConsumer from '../order-remove.consumer';
import CustomerCreateConsumer from '../customer-create.consumer';
import CustomerUpdateConsumer from '../customer-update.consumer';
import CustomerRemoveConsumer from '../customer-remove.consumer';
import CouponExportConsumer from '../coupon-export.consumer';
import SyncCouponConsumer from '../sync-coupon.consumer';

const rabbitConfig = envConfig.rabbitmq;
const rabbitQueues = rabbitConfig.queues;
const consumers = [
  {
    queue: rabbitQueues.shopUpdate,
    consumerClass: ShopUpdateConsumer,
  },
  {
    queue: rabbitQueues.appUninstall,
    consumerClass: AppUninstalledConsumer,
  },
  {
    queue: rabbitQueues.order,
    consumerClass: OrderConsumer,
  },
  {
    queue: rabbitQueues.orderRemove,
    consumerClass: OrderRemoveConsumer,
  },
  {
    queue: rabbitQueues.customerCreate,
    consumerClass: CustomerCreateConsumer,
  },
  {
    queue: rabbitQueues.customerUpdate,
    consumerClass: CustomerUpdateConsumer,
  },
  {
    queue: rabbitQueues.customerRemove,
    consumerClass: CustomerRemoveConsumer,
  },
  {
    queue: rabbitQueues.couponExport,
    consumerClass: CouponExportConsumer,
  },
  {
    queue: rabbitQueues.syncCoupon,
    consumerClass: SyncCouponConsumer,
  },
];

export const start = () => {
  try {
    if (!rabbitConfig.active) {
      return;
    }

    if (!rabbitConfig.consumerActive) {
      return;
    }

    for (let i = 0; i < consumers.length; i++) {
      const consumer = consumers[i];

      if (!consumer.queue.active) {
        continue;
      }

      for (let j = 0; j < consumer.queue.consumer; j++) {
        const newConsumer = new consumer.consumerClass(consumer.queue.queueName);
        const newErrorConsumer = new consumer.consumerClass(`${consumer.queue.queueName}_error`);

        newConsumer.start();
        newErrorConsumer.start();
      }
    }
  } catch (e) {
    log.error(e);
  }
};

import _get from 'lodash/get';

import rabbitmq from '../util/rabbitmqUtil';
import log from '../util/loggerUtil';
import { syncCoupon } from './helpers/sync-coupon-consumer.helper';

export default class SyncCouponConsumer {
  constructor(queueName) {
    this.queueName = queueName;
    this.channelConsumer = null;
  }

  start() {
    this.channelConsumer = rabbitmq.createConsumer({
      queueName: this.queueName,
      onMessage: this.onMessage.bind(this),
    });
  }

  async onMessage(data, msg) {
    const channel = this.channelConsumer;

    if (!Object.keys(data).includes(...['shop', 'accessToken', 'fromDate', 'toDate'])) {
      return channel.ack(msg);
    }

    if (data.retryCount > 3) {
      const errorMessage = data.error ? data.error : 'Retry count more than 3 times';

      log.warn({
        queueName: this.queueName,
        shopName: data.shop,
        retryCount: data.retryCount,
      }, errorMessage);

      return channel.ack(msg);
    }

    const result = await syncCoupon(data);

    if (_get(result, 'error') || !_get(result, 'done', false)) {
      this.sendQueueError(
        {
          ...result,
          ...data,
        },
        result.error
      );
    }

    channel.ack(msg);
  }

  sendQueueError(data, err) {
    data.retryCount = Number(data.retryCount) + 1;
    data.error = '';
    data.queueName = `${this.queueName.replace('_error', '')}_error`;

    if (err) {
      data.error = toString.call(err) === '[object Object]' ? JSON.stringify(err) : err.toString();
    }

    rabbitmq.sendMessage({
      queueName: data.queueName,
      msg: data,
    });
  }
}

// Import Third-party Libs
import _get from 'lodash/get';

// Import Utils
import rabbitmq from '../util/rabbitmqUtil';
import log from '../util/loggerUtil';

// Import Consumer Helpers
import { exportCoupon } from './helpers/coupon-export-consumer.helper';

export default class CustomerCreateConsumer {
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

    if (!Object.keys(data).includes(...['shop', 'type', 'filterData'])) {
      return channel.ack(msg);
    }

    if (data.retryCount > 3) {
      const errorMessage = data.error ? data.error : 'Retry count more than 3 times';

      log.warn({
        queueName: this.queueName,
        shopName: data.shopName,
        retryCount: data.retryCount,
      }, errorMessage);

      return channel.ack(msg);
    }

    const {
      shop,
      type,
      filterData,
    } = data;

    const result = await exportCoupon({
      shop,
      type,
      filterData,
    });

    if (_get(result, 'error')) {
      this.sendQueueError(data, result.error);
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

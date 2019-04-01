import _get from 'lodash/get';

import rabbitmq from '../util/rabbitmqUtil';
import log from '../util/loggerUtil';
import { updateAuthorize as updateShopAuthorize } from '../models/helpers/shop.model.helper';

export default class AppUninstalledConsumer {
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

    if (!_get(data, 'shopName') || !_get(data, 'shopData')) {
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

    // Update shop authorize
    const result = await updateShopAuthorize({
      shop: data.shopName,
      status: 0,
      data: {},
      returnError: true,
    });

    if (!(result instanceof TypeError)) {
      return channel.ack(msg);
    }

    this.sendQueueError(data, result);

    return channel.ack(msg);
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

const amqp = require('amqp-connection-manager');

import log from './loggerUtil';
import envConfig from '../../config/config';

const rabbitConfig = envConfig.rabbitmq;
const rabbitUri = `amqp://${rabbitConfig.user}:${rabbitConfig.pass}@${rabbitConfig.host}:${rabbitConfig.port}/${rabbitConfig.vhost}`;

class RabbitMQUtil {
  publisherChannel = {};
  consumerChannel = {};
  rabbitConnection = null;

  connect() {
    if (!rabbitConfig.active) {
      return;
    }

    this.rabbitConnection = amqp.connect([rabbitUri]);

    this.rabbitConnection.on('connect', () => {
      console.log('Rabbit connected!');
    });

    this.rabbitConnection.on('disconnect', (err) => {
      console.log('Rabbit disconnected.');

      log.error(err);
    });
  }

  disconnect() {
    return new Promise((resolve, reject) => {
      this.rabbitConnection.close(err => {
        console.info('Disconnected from Rabbit.');

        if (err) {
          return reject(err);
        }

        return resolve();
      });
    });
  }

  createPublisher(queueName) {
    if (!rabbitConfig.active) {
      return;
    }

    if (!rabbitConfig.publisherActive) {
      return;
    }

    if (this.publisherChannel[queueName]) {
      return;
    }

    this.publisherChannel[queueName] = this.rabbitConnection.createChannel({
      setup: channel => {
        channel.prefetch(rabbitConfig.prefetch);

        return channel.assertQueue(queueName, {
          durable: true,
          messageTtl: rabbitConfig.ttl,
        });
      },
    });

    this.publisherChannel[queueName].on('error', (err) => {
      console.log('PublisherChannel error');

      log.error(err);
    });
  }

  createConsumer({ queueName, onMessage }) {
    if (!rabbitConfig.active) {
      return;
    }

    if (!rabbitConfig.consumerActive) {
      return;
    }

    this.consumerChannel[queueName] = this.rabbitConnection.createChannel({
      setup: (channel) => {
        return Promise.all([
          channel.assertQueue(queueName, { durable: true, messageTtl: rabbitConfig.ttl }),
          channel.prefetch(rabbitConfig.prefetch),
          channel.consume(queueName, msg => {
            try {
              this.parseAndValidateMessage({
                queueName,
                msg,
                onMessage,
              });
            } catch (e) {
              log.error(e);
            }
          }, { noAck: false }),
        ]);
      },
    });

    this.consumerChannel[queueName].on('error', err => {
      console.log('Consumer Channel Order err: ');

      log.error(err);
    });

    return this.consumerChannel[queueName];
  }

  parseAndValidateMessage({ queueName, msg, onMessage }) {
    const channel = this.consumerChannel[queueName];

    if (!msg || (msg && !msg.content)) {
      return channel.ack(msg);
    }

    let data = null;

    try {
      data = JSON.parse(msg.content.toString());
    } catch (e) {
      log.error(e);
    }

    onMessage(data, msg);
  }

  sendMessage({ queueName, msg }) {
    if (!rabbitConfig.active) {
      return Promise.resolve(true);
    }

    if (!rabbitConfig.publisherActive) {
      return Promise.resolve(true);
    }

    const queue = this.publisherChannel[queueName];
    const msgBuffer = new Buffer(JSON.stringify(msg));

    if (!queue) {
      return Promise.resolve(false);
    }

    return queue
      .sendToQueue(queueName, msgBuffer, { persistent: true })
      .then(() => Promise.resolve(true))
      .catch(err => {
        console.log('Message was rejected');

        log.error(err);

        this.publisherChannel[queueName].close();
        this.rabbitConnection.close();

        return Promise.resolve(false);
      });
  }
}

export default new RabbitMQUtil();

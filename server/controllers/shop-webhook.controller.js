import rabbitmq from '../util/rabbitmqUtil';
import envConfig from '../../config/config';

const rabbitConfig = envConfig.rabbitmq;
const rabbitQueues = rabbitConfig.queues;

export const shopUpdate = async (req, res) => {
  const shop = req.headers['haravan-shop-domain'] || '';
  const shopData = req.body;

  const sentToQueue = rabbitmq.sendMessage({
    queueName: rabbitQueues.shopUpdate.queueName,
    msg: {
      shopName: shop,
      shopData,
    },
  });

  if (!sentToQueue) {
    return res.sendStatus(400);
  }

  res.sendStatus(200);
};

export const appUninstalled = (req, res) => {
  const shop = req.headers['haravan-shop-domain'] || '';

  const sentToQueue = rabbitmq.sendMessage({
    queueName: rabbitQueues.appUninstall.queueName,
    msg: {
      shopName: shop,
      shopData: {
        status: 0,
        data: {},
      },
    },
  });

  if (!sentToQueue) {
    return res.sendStatus(400);
  }

  res.sendStatus(200);
};

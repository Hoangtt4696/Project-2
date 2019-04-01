import rabbitmq from '../util/rabbitmqUtil';
import envConfig from '../../config/config';

const rabbitConfig = envConfig.rabbitmq;
const rabbitQueues = rabbitConfig.queues;

export const orderHook = async (req, res) => {
  const shop = req.headers['haravan-shop-domain'] || '';
  const { settings } = req.session.couponSettings;
  const { couponOrder, emailOrder } = settings;
  const order = req.body;

  const sentToQueue = rabbitmq.sendMessage({
    queueName: rabbitQueues.order.queueName,
    msg: {
      shopName: shop,
      order,
      couponSettings: couponOrder,
      shopData: req.shopData,
      emailSettings: emailOrder,
    },
  });

  if (!sentToQueue) {
    return res.sendStatus(400);
  }

  res.sendStatus(200);
};

export const remove = async (req, res) => {
  const shop = req.headers['haravan-shop-domain'] || '';
  const order = req.body;

  const sentToQueue = rabbitmq.sendMessage({
    queueName: rabbitQueues.orderRemove.queueName,
    msg: {
      shopName: shop,
      order: {
        id: order.id,
      },
    },
  });

  if (!sentToQueue) {
    return res.sendStatus(400);
  }

  res.sendStatus(200);
};

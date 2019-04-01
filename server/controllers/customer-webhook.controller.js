import rabbitmq from '../util/rabbitmqUtil';
import envConfig from '../../config/config';

const rabbitConfig = envConfig.rabbitmq;
const rabbitQueues = rabbitConfig.queues;

export const customerHook = async (req, res) => {
  const shop = req.headers['haravan-shop-domain'] || '';
  const topic = req.headers['x-haravan-topic'] || '';
  const { settings } = req.session.couponSettings;
  const { couponCustomer, emailCustomer } = settings;
  const customer = req.body;

  if (!['customers/create', 'customers/update', 'customers/delete'].includes(topic)) {
    return res.sendStatus(200);
  }

  let queueName = rabbitQueues.customerCreate.queueName;

  switch (topic) {
    case 'customers/create' :
      queueName = rabbitQueues.customerCreate.queueName;
      break;

    case 'customers/update':
      queueName = rabbitQueues.customerUpdate.queueName;
      break;

    case 'customers/delete':
      queueName = rabbitQueues.customerRemove.queueName;
      break;
  }

  const sentToQueue = rabbitmq.sendMessage({
    queueName,
    msg: {
      shopName: shop,
      customer,
      couponSettings: couponCustomer,
      shopData: req.shopData,
      emailSettings: emailCustomer,
    },
  });

  if (!sentToQueue) {
    return res.sendStatus(400);
  }

  res.sendStatus(200);
};

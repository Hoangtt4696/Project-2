import path from 'path';

export default {
  mongoURL: 'mongodb://localhost:27017/thank-you-coupon',
  mongoPoolSize: 5,
  hostname: 'localhost',
  protocol: 'https://',
  port: 8000,
  session: {
    name: 'base_app',
    secret: '7d12e1c485fa3fba45ce9cc1645c418f',
    exp: 120,
  },
  haravanApp: {
    apiKey: 'b25ad04cdf818ab0decb6094d7d57a42',
    apiSecret: '1a4fc50a009a871558868ace475e9fb9',
    scope: 'read_discount,write_discount,read_orders,read_customers,read_themes,write_themes',
    redirectUri: 'https://localhost/finalize',
    verbose: false,
    embed: true,
    protocol: 'https://',
    webhookHost: 'https://localhost',
    appHost: 'https://localhost',
  },
  log: {
    name: 'thank_you_coupon',
    path: '/var/tmp/',
  },
  mailer: {
    uri: 'http://42.117.4.246:5000/mailer',
    fromName: 'Thank You Coupon',
    fromEmail: 'noreply@haravan.com',
  },
  rabbitmq: {
    active: true,
    publisherActive: true,
    consumerActive: true,
    user: 'baseapp',
    pass: '123',
    host: 'localhost',
    port: 5672,
    vhost: 'thank_you_coupon',
    prefetch: 1,
    ttl: 2 * 24 * 60 * 60 * 1000, // 48h
    retryConsumerTime: 10 * 60 * 1000, // 10m
    reconnectTime: 30 * 1000, // 30s
    queues: {
      shopUpdate: {
        active: true,
        queueName: 'thankyoucoupon_shop_update',
        consumer: 1,
      },
      appUninstall: {
        active: true,
        queueName: 'thankyoucoupon_shop_uninstall',
        consumer: 1,
      },
      order: {
        active: true,
        queueName: 'thankyoucoupon_order',
        consumer: 1,
      },
      orderRemove: {
        active: true,
        queueName: 'thankyoucoupon_order_remove',
        consumer: 1,
      },
      couponExport: {
        active: true,
        queueName: 'thankyoucoupon_coupon_export',
        consumer: 1,
      },
      customerCreate: {
        active: true,
        queueName: 'thankyoucoupon_customer_create',
        consumer: 1,
      },
      customerUpdate: {
        active: true,
        queueName: 'thankyoucoupon_customer_update',
        consumer: 1,
      },
      customerRemove: {
        active: true,
        queueName: 'thankyoucoupon_customer_remove',
        consumer: 1,
      },
      syncCoupon: {
        active: true,
        queueName: 'thankyoucoupon_sync_coupon',
        consumer: 1,
      },
    },
  },
  cronActive: false,
  cron: {
    syncCoupon: {
      active: true,
      time: '0 0 */1 * * *', // 1h,
    },
  },
  pessimisticLock: {
    time: 15, // 15s,
  },
  downloads: {
    dest: path.resolve('./media/downloads'),
    items: {
      export: {
        dest: '/export',
      },
    },
  },
};

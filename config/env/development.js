export default {
  hostname: 'localhost',
  protocol: 'http://',
  mongoURL: 'mongodb://localhost:27017/thank-you-coupon',
  port: 8000,
  rabbitmq: {
    user: 'guest',
    pass: 'guest',
  },
  haravanApp: {
    webhookHost: 'https://e373519f.ngrok.io',
    redirectUri: 'http://localhost:8000/finalize',
  },
};

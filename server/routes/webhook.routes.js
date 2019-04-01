import * as ShopWebhookController from '../controllers/shop-webhook.controller';
import * as CustomerWebhookController from '../controllers/customer-webhook.controller';
import * as OrderWebhookController from '../controllers/order-webhook.controller';
import { webhookValidate } from '../middlewares/haravan.middleware';
import { couponSettings } from '../middlewares/coupon-setting-webhook.middleware';
import { validateHook } from '../middlewares/webhook.middleware';

export default (app) => {
  const routing = '/webhooks';

  app.all(`${routing}/*`, webhookValidate);

  // Shop update hook
  app.route(`${routing}/shop/update`)
    .post(ShopWebhookController.shopUpdate);

  // App uninstalled hook
  app.route(`${routing}/app/uninstalled`)
    .post(ShopWebhookController.appUninstalled);

  // Customer hooks
  app.route(`${routing}/customers/create`)
    .post(
      couponSettings,
      validateHook(),
      CustomerWebhookController.customerHook
    );

  app.route(`${routing}/customers/update`)
    .post(
      couponSettings,
      validateHook(),
      CustomerWebhookController.customerHook
    );

  app.route(`${routing}/customers/delete`)
    .post(
      couponSettings,
      validateHook(),
      CustomerWebhookController.customerHook,
    );

  // Order hooks
  app.route(`${routing}/orders/create`)
    .post(
      couponSettings,
      validateHook(),
      OrderWebhookController.orderHook
    );

  app.route(`${routing}/orders/update`)
    .post(
      couponSettings,
      validateHook(),
      OrderWebhookController.orderHook
    );

  app.route(`${routing}/orders/paid`)
    .post(
      couponSettings,
      validateHook(),
      OrderWebhookController.orderHook
    );

  app.route(`${routing}/orders/fulfilled`)
    .post(
      couponSettings,
      validateHook(),
      OrderWebhookController.orderHook
    );

  app.route(`${routing}/orders/delete`)
    .post(OrderWebhookController.remove);
};

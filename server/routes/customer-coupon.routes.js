import * as CustomerCouponController from '../controllers/customer-coupon.controller';
import { authenticatePublicApi } from '../middlewares/haravan.middleware';

export default (app) => {
  const routing = '/api';

  app.all(`${routing}/customer-coupons*`, authenticatePublicApi);

  app.route(`${routing}/customer-coupons`)
    .post(CustomerCouponController.fetch);
};

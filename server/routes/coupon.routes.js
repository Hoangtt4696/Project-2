import * as CouponController from '../controllers/coupon.controller';
import { authenticateApi } from '../middlewares/haravan.middleware';

export default (app) => {
  const routing = '/api';

  app.all(`${routing}/coupons*`, authenticateApi);

  app.route(`${routing}/coupons`)
    .post(CouponController.fetch);

  app.route(`${routing}/coupons/count`)
    .post(CouponController.count);
};

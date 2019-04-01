import * as ShopController from '../controllers/shop.controller';
import { authenticateApi } from '../middlewares/haravan.middleware';

export default (app) => {
  const routing = '/api';

  app.all(`${routing}/shop*`, authenticateApi);

  // App authenticate
  app.route(`${routing}/shop`)
    .get(ShopController.read);
};

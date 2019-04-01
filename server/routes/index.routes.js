import * as IndexController from '../controllers/index.controller';
import { haravanApi } from '../middlewares/haravan.middleware';

export default (app) => {
  // App authenticate
  app.route('/authenticate')
    .get(haravanApi, IndexController.authenticate);

  // App finalize
  app.route('/finalize')
    .get(haravanApi, IndexController.finalize);
};

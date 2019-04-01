import * as SettingController from '../controllers/setting.controller';
import { authenticateApi } from '../middlewares/haravan.middleware';

export default (app) => {
  const routing = '/api';

  app.all(`${routing}/settings*`, authenticateApi);

  // App authenticate
  app.route(`${routing}/settings`)
    .get(SettingController.read)
    .post(SettingController.update)
    .put(SettingController.update);
};

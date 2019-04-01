import * as DownloadController from '../controllers/download.controller';

export default (app) => {
  app.route('/download/:shop/:year/:month/:day/:topic/:fileName')
    .get(DownloadController.download);
};

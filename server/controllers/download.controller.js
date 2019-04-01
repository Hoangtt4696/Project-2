// Import Native Libs
import path from 'path';
import fs from 'fs';

// Import Third-party Libs
import mime from 'mime';

// Import Configs
import envConfig from '../../config/config';

const downloadConfig = envConfig.downloads;

export const download = (req, res) => {
  const {
    shop,
    year,
    month,
    day,
    topic,
    fileName,
  } = req.params;

  const fullPath = path.join(path.resolve(downloadConfig.dest), shop, year, month, day, topic, fileName);

  fs.access(fullPath, err => {
    if (err) {
      return res.sendStatus(404);
    }

    const name = path.basename(fullPath);
    const mimeType = mime.getType(fullPath);
    const fileStream = fs.createReadStream(fullPath);

    res.setHeader('Content-disposition', `attachment; filename=${name}`);
    res.setHeader('Content-type', mimeType);

    fileStream.pipe(res);
  });
};

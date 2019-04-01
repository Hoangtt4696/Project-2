// Import Third-party Libs
import _isEmpty from 'lodash/isEmpty';
import fse from 'fs-extra';
import XlsxWriteStream from 'xlsx-writestream';

// Import Utils
import log from './loggerUtil';

class XlsxWriteStreamUtil {
  writer = null;

  init(path) {
    this.writer = new XlsxWriteStream(path);
    this.writer.getReadStream().pipe(fse.createWriteStream(path));
  }

  writeToFile(data) {
    try {
      if (_isEmpty(data) || _isEmpty(this.writer)) {
        return Promise.resolve();
      }

      while (data.length) {
        this.writer.addRow(data.shift());
      }

      return Promise.resolve();
    } catch (e) {
      log.error(e);

      return Promise.resolve({
        error: e,
      });
    }
  }

  close() {
    try {
      if (!this.writer) {
        return;
      }

      this.writer.finalize();
      this.writer = null;
    } catch (e) {
      log.error(e);
    }
  }
}

export default new XlsxWriteStreamUtil();

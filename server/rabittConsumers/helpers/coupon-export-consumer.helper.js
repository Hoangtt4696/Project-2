// Import Native Libs
import path from 'path';

// Import Third-party Libs
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import fse from 'fs-extra';
import moment from 'moment';
import uuid from 'uuid';

// Import Utils
import log from '../../util/loggerUtil';
import xslxWriteStreamUtil from '../../util/xlsxWriteStreamUtil';

// Import Helpers
import { sendExportEmail } from '../../util/helpers/email.helper';

// Import Model Helpers
import { query as queryCoupon } from '../../models/helpers/coupon.model.helper';
import { getShop } from '../../models/helpers/shop.model.helper';

// Import Configs
import envConfig from '../../../config/config';

const haravanConfig = envConfig.haravanApp;
const downloadConfig = envConfig.downloads;

// Helper Functions
async function ensureDir(dirPath) {
  try {
    return new Promise((resolve, reject) => {
      fse.ensureDir(dirPath, err => {
        if (err) {
          return reject(err);
        }

        return resolve();
      });
    });
  } catch (e) {
    log.error(e);

    return Promise.reject(e);
  }
}

function formatRows({ type, items }) {
  const formatStatus = item => {
    switch (item.status) {
      case 'new':
        return 'Chưa sử dụng';

      case 'used':
        return 'Đã sử dụng';
    }

    const currentDate = new Date();

    if (item.endDate > currentDate) {
      return 'Hết hạn';
    }

    return '';
  };

  if (type === 'customer') {
    return items.map(item => {
      return {
        'Ngày đăng ký ': moment(item.registerDate).format('DD/MM/YYYY'),
        'Email đăng ký': item.customerEmail,
        'Mã KM': item.couponCode,
        'Trạng thái mã KM': formatStatus(item),
        'Mã đơn hàng sử dụng KM': _get(item, 'refOrder.orderNumber'),
        'Ngày phát sinh đơn hàng sử dụng KM': _get(item, 'refOrder.createdAt') ? moment(item.refOrder.createdAt).format('DD/MM/YYYY') : '',
        'Email sử dụng KM': _get(item, 'refOrder.customerEmail'),
      };
    });
  } else if (type === 'order') {
    return items.map(item => {
      return {
        'Ngày phát sinh đơn hàng nhận KM': moment(item.orderCreatedAt).format('DD/MM/YYYY'),
        'Email nhận KM': item.customerEmail,
        'Mã KM': item.couponCode,
        'Trạng thái mã KM': formatStatus(item),
        'Mã đơn hàng sử dụng KM': _get(item, 'refOrder.orderNumber'),
        'Ngày phát sinh đơn hàng sử dụng KM': _get(item, 'refOrder.createdAt') ? moment(item.refOrder.createdAt).format('DD/MM/YYYY') : '',
        'Email sử dụng KM': _get(item, 'refOrder.customerEmail'),
      };
    });
  }

  return items;
}

async function sendEmail({ shop, type, downloadLink }) {
  const shopData = await getShop({
    shop,
    fields: [
      'haravanSettings.name',
      'haravanSettings.email',
    ],
  });

  if (_isEmpty(_get(shopData, 'haravanSettings'))) {
    return Promise.resolve(false);
  }

  return await sendExportEmail({
    toName: _get(shopData, 'haravanSettings.name', ''),
    toEmail: _get(shopData, 'haravanSettings.email', ''),
    data: {
      subjectType: type === 'customer' ? 'Mã KM của Đăng ký thành viên' : 'Mã KM của ĐH hoàn tất',
      downloadLink,
    },
  });
}

export const exportCoupon = async ({ shop, type, filterData }) => {
  try {
    const currentDate = new Date();
    const fileName = `Coupon_${moment(currentDate).format('M-DD-YYYY-')}${uuid.v4()}.xlsx`;
    const dest = path.resolve(downloadConfig.dest);
    const datePath = moment().format('YYYY/MM/DD');
    const exportPath = downloadConfig.items.export.dest;
    const outputDirectory = path.join(dest, `${shop}/${datePath}`, exportPath);
    const fullPath = path.join(outputDirectory, fileName);
    const downloadLink = `${haravanConfig.appHost}/${path.join('download', shop, datePath, exportPath, fileName)}`;

    await ensureDir(outputDirectory);

    xslxWriteStreamUtil.init(fullPath);

    const fetchItems = async () => {
      return await queryCoupon({
        shop,
        type,
        filterDataObj: filterData,
      });
    };

    let result;

    do {
      result = await fetchItems();
      if (_isEmpty(_get(result, 'records'))) {
        filterData.page++;

        continue;
      }

      xslxWriteStreamUtil.writeToFile(formatRows({
        type,
        items: result.records,
      }));

      filterData.page++;
    } while (!_isEmpty(_get(result, 'records')));

    xslxWriteStreamUtil.close();

    const mailSent = await sendEmail({
      shop,
      type,
      downloadLink,
    });

    if (!mailSent) {
      return Promise.resolve({
        done: false,
      });
    }

    return Promise.resolve({
      done: true,
    });
  } catch (e) {
    log.error(e);

    xslxWriteStreamUtil.close();

    return Promise.resolve({
      error: e,
    });
  }
};

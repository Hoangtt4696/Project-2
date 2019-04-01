// Import Third-party Libs
import _get from 'lodash/get';
import sanitizeHtml from 'sanitize-html';

// Import Utils
import rabbitmq from '../util/rabbitmqUtil';

// Import Helpers
import { formatError, formatSuccess } from '../util/helpers/data-response.helper';

// Import Model Helpers
import { query } from '../models/helpers/coupon.model.helper';

// Import Configs
import envConfig from '../../config/config';

const rabbitConfig = envConfig.rabbitmq;
const rabbitQueues = rabbitConfig.queues;

export const fetch = async (req, res) => {
  const shop = sanitizeHtml(req.session.shop);
  const type = sanitizeHtml(req.body.type);
  const filterData = req.body.filterData;

  if (!shop) {
    return res.json(formatError({
      message: 'Thông tin shop không hợp lệ',
    }));
  }

  if (!filterData) {
    return res.json(formatError({
      message: 'Thông tin không hợp lệ',
    }));
  }

  if (filterData.isExport) {
    const sentToQueue = rabbitmq.sendMessage({
      queueName: rabbitQueues.couponExport.queueName,
      msg: {
        shop,
        type,
        filterData,
      },
    });

    if (sentToQueue) {
      return res.json(formatSuccess({
        message: 'Dữ liệu đang được xử lý và sẽ được qua email khi thành công',
      }));
    }

    return res.json(formatError({
      message: 'Có lỗi xảy ra',
    }));
  }

  const result = await query({
    shop,
    type,
    filterDataObj: filterData,
  });

  res.json(formatSuccess({}, {
    ...result,
  }));
};

export const count = async (req, res) => {
  const shop = sanitizeHtml(req.session.shop);
  const type = sanitizeHtml(req.body.type);
  const filterData = req.body.filterData;

  if (!shop) {
    return res.json(formatError({
      message: 'Thông tin shop không hợp lệ',
    }));
  }

  const result = await query({
    shop,
    type,
    filterDataObj: filterData,
  });

  res.json(formatSuccess({}, _get(result, 'totalRecord', 0)));
};

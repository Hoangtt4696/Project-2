import { get as getShop } from '../util/api/shop.api';
import { formatError, formatSuccess } from '../util/helpers/data-response.helper';
import log from '../util/loggerUtil';

export const read = async (req, res) => {
  try {
    const shopInfo = await getShop(req.HaravanAPI, [
      'email',
      'name',
      'customer_email',
    ]);

    res.json(formatSuccess({}, shopInfo));
  } catch (e) {
    log.error(e);

    res.json(formatError({
      message: 'Có lỗi xảy ra. Vui lòng thử lại sau',
    }));
  }
};

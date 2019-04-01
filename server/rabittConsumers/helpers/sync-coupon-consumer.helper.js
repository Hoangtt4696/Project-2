// Import Third-party Libs
import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';
import moment from 'moment';

// Import Utils
import log from '../../util/loggerUtil';
import HaravanAPIUtil from '../../util/haravanApiUtil';

// Import Model Helpers
import { bulkAdd as bulkAddSellerCoupons } from '../../models/helpers/seller-coupon.model.helper';
import { bulkUpdate as bulkUpdateCoupons } from '../../models/helpers/coupon.model.helper';

// Import APIs
import { get as getCoupons } from '../../util/api/coupon.api';

function fetchCoupons({ HaravanAPI, page, fromDate, toDate }) {
  return getCoupons(HaravanAPI, {
    page,
    updatedAtMin: fromDate ? moment(fromDate).format('YYYY-MM-DDTHH:mm:ss') : null,
    updatedAtMax: moment(toDate).format('YYYY-MM-DDTHH:mm:ss'),
    order: 'updated_date desc',
  });
}

export const syncCoupon = async ({ shop, accessToken, fromDate, toDate, page }) => {
  try {
    page = page || 1;

    const HaravanAPI = new HaravanAPIUtil({
      shop,
      access_token: accessToken,
    });
    let coupons = null;

    do {
      coupons = await fetchCoupons({
        HaravanAPI,
        page,
        fromDate,
        toDate,
      });

      // If empty data return done
      if (_isEmpty(coupons)) {
        return Promise.resolve({
          done: true,
        });
      }

      const sellerCouponResult = await bulkAddSellerCoupons(shop, coupons);

      // If error return page for retry
      if (_get(sellerCouponResult, 'error')) {
        return Promise.resolve({
          error: sellerCouponResult.error,
          page,
        });
      }

      const couponResult = await bulkUpdateCoupons(shop, coupons);

      // If error return page for retry
      if (_get(couponResult, 'error')) {
        return Promise.resolve({
          error: couponResult.error,
          page,
        });
      }

      page++;
    } while (!_isEmpty(coupons));

    return Promise.resolve({
      done: true,
    });
  } catch (e) {
    log.error(e);

    return Promise.resolve({
      error: e,
      page,
    });
  }
};

// Import Third-party Libs
import _isEmpty from 'lodash/isEmpty';
import _forEach from 'lodash/forEach';

// Import Utils
import log from './loggerUtil';

// Import APIs
import { get, getAssets, updateAsset } from './api/theme.api';

export const initAssets = async HaravanAPI => {
  try {
    const themeAssetKey = 'layout/theme.liquid';
    const assetKey = 'snippets/hrvthankyoucoupon-widgets.liquid';
    const assetValue = `{% if customer %}
{% assign digest = customer.id | append: shop.metafields['thank_you_coupon'].api_secret | md5 %}
{% assign apiKey = shop.metafields['thank_you_coupon'].api_key %}

{% comment %}
HD gọi API lấy thông tin mã Coupon của Khách hàng:
- POST {% raw %}{{duong_dan_toi_app}}{% endraw %}/api/customer-coupons
- Query string:
+ page: Trang cần lấy data, mặc định 1
+ limit: Số lượng data cần lấy cho 1 trang, mặc định 20
- Header:
+ "Content-Type": "application/json"
- Data gửi kèm Body:
	{
		"shop": "{{ shop.domain }}",
		"customerId": {{ customer.id }},
		"digest": "{{ digest }}",
		"apiKey": "{{ apiKey }}"
	}
{% endcomment %}
{% endif %}`;
    const themes = await get(HaravanAPI, ['id']);

    if (_isEmpty(themes)) {
      return Promise.resolve();
    }

    _forEach(themes, theme => {
      setTimeout(async () => {
        try {
          const foundAsset = await getAssets(HaravanAPI, theme.id, assetKey);

          if (foundAsset) {
            return;
          }

          const updateAssetResult = await updateAsset(HaravanAPI, theme.id, {
            key: assetKey,
            value: assetValue,
          });

          if (!updateAssetResult) {
            return;
          }

          const foundThemeAsset = await getAssets(HaravanAPI, theme.id, themeAssetKey);

          if (!foundThemeAsset) {
            return;
          }

          if (foundThemeAsset.value.includes('hrvthankyoucoupon-widgets')) {
            return;
          }

          const themeAssetValue = foundThemeAsset.value
            .replace('</body>', '{% include \'hrvthankyoucoupon-widgets\' %}\n</body>');

          await updateAsset(HaravanAPI, theme.id, {
            key: themeAssetKey,
            value: themeAssetValue,
          });
        } catch (e) {
          log.error(e);
        }
      }, 500);
    });

    return Promise.resolve();
  } catch (e) {
    log.error(e);

    return Promise.resolve();
  }
};

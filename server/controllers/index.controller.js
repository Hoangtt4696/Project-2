import { getNewAccessToken } from '../util/api/haravan.api';
import { get as getShop } from '../util/api/shop.api';
// import { initMetafield } from '../util/shopMetafieldUtil';
// import { initAssets } from '../util/shopAssetUtil';
import { initHooks } from '../util/haravanWebhookUtil';
import log from '../util/loggerUtil';
import { updateAuthorize as updateShopAuthorize } from '../models/helpers/shop.model.helper';
import { initWithDefault as initSetting } from '../models/helpers/setting.model.helper';

/**
 * Application Authenticate
 * @param req Incomming Request
 * @param res Response
 */
export const authenticate = (req, res) => {
  res.redirect(req.HaravanAPI.buildAuthURL());
};

/**
 * Finalized
 * @param req Incomming Request
 * @param res Response
 */
export const finalize = async (req, res) => {
  const shop = req.query.shop || '';
  let tokenData = null;

  try {
    tokenData = await getNewAccessToken(req.HaravanAPI);
  } catch (e) {
    log.error(e);
  }

  if (!tokenData || (tokenData && !tokenData.access_token)) {
    return res.sendStatus(401);
  }

  req.HaravanAPI.config.access_token = tokenData.access_token;

  let shopInfo = null;

  try {
    shopInfo = await getShop(req.HaravanAPI);
  } catch (e) {
    log.error(e);
  }

  if (!shopInfo || (shopInfo && !shopInfo.id)) {
    return res.sendStatus(401);
  }

  const authorizeInfo = {
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token,
    expiresIn: tokenData.expires_in,
    haravanSettings: shopInfo,
  };

  await updateShopAuthorize({
    shop,
    status: 1,
    data: authorizeInfo,
  });

  req.session.shop = shop;
  req.session.accessToken = tokenData.access_token;

  // noinspection JSIgnoredPromiseFromCall
  initSetting(shop);
  // noinspection JSIgnoredPromiseFromCall
  // initMetafield(req.HaravanAPI, shop);
  // noinspection JSIgnoredPromiseFromCall
  // initAssets(req.HaravanAPI);
  initHooks(req.HaravanAPI);

  res.redirect(`/${req._parsedUrl.search}`);
};

import _get from 'lodash/get';
import md5 from 'md5';
import sanitizeHtml from 'sanitize-html';

import HaravanAPIUtil from '../util/haravanApiUtil';
import { getShop } from '../models/helpers/shop.model.helper';
import { load as loadSettings } from '../models/helpers/setting.model.helper';

export const haravanApi = (req, res, next) => {
  const apiConfig = {
    shop: req.query.shop || '',
    timestamp: req.query.timestamp || '',
    signature: req.query.signature || '',
    code: req.query.code || '',
  };

  req.HaravanAPI = new HaravanAPIUtil(apiConfig);

  const requestShop = req.query.shop ||
    req.headers['haravan-shop-domain'] ||
    req.body.shop ||
    req.session.shop || '';

  if (req.originalUrl.indexOf('/finalize') !== -1 || req.originalUrl.indexOf('/authenticate') !== -1) {
    if (!req.HaravanAPI.check_security()) {
      return res.sendStatus(401);
    }

    return next();
  }

  if (req.session.shop && req.session.accessToken && requestShop === req.session.shop) {
    req.HaravanAPI.config.shop = req.session.shop;
    req.HaravanAPI.config.access_token = req.session.accessToken;

    return next();
  }

  if (requestShop) {
    return res.redirect(req.HaravanAPI.buildLinkInstallApp(requestShop));
  }

  res.sendStatus(401);
};

export const webhookValidate = async (req, res, next) => {
  const shop = req.headers['haravan-shop-domain'] || '';
  const signature = req.headers['x-haravan-hmac-sha256'] || '';
  const topic = req.headers['x-haravan-topic'] || '';

  if (!shop || !signature || !topic) {
    return res.sendStatus(401);
  }

  const shopData = await getShop({
    shop,
    fields: ['status', 'authorize', 'haravanSettings'],
  });

  if (!shopData) {
    return res.sendStatus(400);
  }

  if (_get(shopData, '_id') && _get(shopData, 'authorize.accessToken')) {
    req.shopData = shopData;

    return next();
  }

  res.sendStatus(401);

  // validate the request is from haravan
  // if (!req.fromHaravan()) {
  //   return res.sendStatus(401);
  // }
};

export const authenticateApi = async (req, res, next) => {
  const apiConfig = {
    shop: req.query.shop || '',
    timestamp: req.query.timestamp || '',
    signature: req.query.signature || '',
    code: req.query.code || '',
  };

  req.HaravanAPI = new HaravanAPIUtil(apiConfig);

  const requestShop = req.query.shop ||
    req.headers['haravan-shop-domain'] ||
    req.body.shop ||
    req.session.shop || '';

  if (req.session.shop && req.session.accessToken && requestShop === req.session.shop) {
    req.HaravanAPI.config.shop = req.session.shop;
    req.HaravanAPI.config.access_token = req.session.accessToken;

    return next();
  }

  if (!req.HaravanAPI.check_security()) {
    return res.sendStatus(401);
  }

  const shopData = await getShop({
    shop: requestShop,
  });

  if (!shopData) {
    return res.sendStatus(401);
  }

  if (_get(shopData, '_id') && _get(shopData, 'authorize.accessToken')) {
    req.HaravanAPI.config.shop = shopData._id;
    req.HaravanAPI.config.access_token = shopData.authorize.accessToken;

    req.session.shop = shopData._id;
    req.session.access_token = shopData.authorize.accessToken;

    return next();
  }

  res.sendStatus(401);
};

export const authenticatePublicApi = async (req, res, next) => {
  const shop = sanitizeHtml(req.body.shop);
  const customerId = sanitizeHtml(req.body.customerId);
  const digest = sanitizeHtml(req.body.digest);
  const apiKey = sanitizeHtml(req.body.apiKey);

  if (!shop || !customerId || !digest || !apiKey) {
    return res.sendStatus(401);
  }

  const shopSettings = await loadSettings(shop, [
    'shopApiKey',
    'shopSecretKey',
  ]);

  if (!shopSettings) {
    return res.sendStatus(400);
  }

  const shopApiKey = _get(shopSettings, 'settings.shopApiKey', '');
  const shopSecretKey = _get(shopSettings, 'settings.shopSecretKey', '');

  const compareDigest = `${md5(`${customerId}${shopSecretKey}`)}`;

  if (apiKey !== shopApiKey || compareDigest !== digest) {
    return res.sendStatus(401);
  }

  return next();
};

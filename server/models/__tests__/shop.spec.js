import test from 'ava';
import Shop from '../shop';
import { getShop, updateAuthorize, updateSettings } from '../helpers/shop.model.helper';
import { connectDB, dropDB } from '../../util/test-helpers';

test.before('connect db', t => {
  connectDB(t, () => {
    Shop.create({
      _id: 'testshop.sku.vn',
      status: 1,
    });
  });
});

test.after.always(t => {
  dropDB(t);
});

test.serial('Should return exist shop with status 1', async t => {
  const shopName = 'testshop.sku.vn';
  const shopData = await getShop({
    shop: shopName,
  });

  t.truthy(shopData);
  t.is(shopData._id, shopName);
  t.is(shopData.status, 1);
});

test.serial('Should return null if shop not exist', async t => {
  const shopName = 'testshop2.sku.vn';
  const shopData = await getShop({
    shop: shopName,
  });

  t.falsy(shopData);
});

test.serial('Should update authorize for exist shop success', async t => {
  const shopName = 'testshop.sku.vn';
  const authorizeData = {
    accessToken: 'access token',
    refreshToken: 'refresh token',
    expiresIn: new Date().getTime(),
  };
  const haravanSettings = {
    name: 'testshop',
    domain: 'sku.vn',
  };
  const savedShop = await updateAuthorize({
    shop: shopName,
    status: 1,
    data: {
      ...authorizeData,
      haravanSettings,
    },
  });

  t.truthy(savedShop);
  t.is(savedShop._id, shopName);
  t.is(savedShop.status, 1);
  t.deepEqual(savedShop.authorize, authorizeData);
});

test.serial('Should create authorize for new shop', async t => {
  const shopName = 'testshop3.sku.vn';
  const authorizeData = {
    accessToken: 'access token',
    refreshToken: 'refresh token',
    expiresIn: new Date().getTime(),
  };
  const haravanSettings = {
    name: 'testshop3',
    domain: 'sku.vn',
  };
  const savedShop = await updateAuthorize({
    shop: shopName,
    status: 1,
    data: {
      ...authorizeData,
      haravanSettings,
    },
  });

  t.truthy(savedShop);
  t.is(savedShop._id, shopName);
  t.is(savedShop.status, 1);
  t.deepEqual(savedShop.authorize, authorizeData);
});

test.serial('Should update haravan settings for exist shop', async t => {
  const shopName = 'testshop3.sku.vn';
  const haravanSettings = {
    email: 'testshop3',
    customerEmail: 'sku.vn',
  };
  const savedSettings = await updateSettings({
    shop: shopName,
    settings: haravanSettings,
  });

  t.truthy(savedSettings);
  t.is(savedSettings._id, shopName);
  t.deepEqual(savedSettings.haravanSettings, haravanSettings);
});

test.serial('Should not update haravan settings if shop not exist', async t => {
  const shopName = 'testshop4.sku.vn';
  const haravanSettings = {
    email: 'testshop4',
    customerEmail: 'sku.vn',
  };
  const savedSettings = await updateSettings({
    shop: shopName,
    settings: haravanSettings,
  });

  t.falsy(savedSettings);
});

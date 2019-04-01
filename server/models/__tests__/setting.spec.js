import test from 'ava';
import Setting from '../setting';
import { init, save, load } from '../helpers/setting.model.helper';
import { connectDB, dropDB } from '../../util/test-helpers';

test.before('connect db', t => {
  connectDB(t, () => {});
});

test.after.always(t => {
  dropDB(t);
});

test.serial('Should create new settings with default settings', async t => {
  const shopName = 'newshop.sku.vn';

  const savedSettings = await new Setting({
    shop: shopName,
  }).save();

  t.truthy(savedSettings);
  t.is(savedSettings.shop, shopName);
  t.truthy(savedSettings.settings);
  t.deepEqual(savedSettings.settings, {
    title: 'Base App',
  });
});

test.serial('Should init new shop\'s setting with default settings', async t => {
  const shopName = 'newshop2.sku.vn';
  const initSettings = await init(shopName);

  t.truthy(initSettings);
  t.is(initSettings.shop, shopName);
  t.truthy(initSettings.settings);
  t.deepEqual(initSettings.settings, {
    title: 'Base App',
  });
});

test.serial('Should init new shop\'s setting with additional input settings', async t => {
  const shopName = 'newshop3.sku.vn';
  const customSetting = 'my setting';
  const initSettings = await init(shopName, {
    customSetting,
  });

  t.truthy(initSettings);
  t.is(initSettings.shop, shopName);
  t.truthy(initSettings.settings);
  t.deepEqual(initSettings.settings, {
    title: 'Base App',
    customSetting,
  });
});

test.serial('Should ignore init settings for exist shop\'s', async t => {
  const shopName = 'newshop3.sku.vn';
  const customSetting = 'my setting';
  const newCustomSetting = 'new my setting';

  const reinitSettings = await init(shopName, {
    customSetting: newCustomSetting,
  });

  t.truthy(reinitSettings);
  t.is(reinitSettings.shop, shopName);
  t.deepEqual(reinitSettings.settings, {
    title: 'Base App',
    customSetting,
  });
});

test.serial('Should load shop\'s settings success', async t => {
  const shopName = 'newshop3.sku.vn';
  const loadedSettings = await load(shopName);

  t.truthy(loadedSettings);
  t.not(typeof loadedSettings.toJSON, 'function');
  t.is(loadedSettings.shop, shopName);
  t.deepEqual(loadedSettings.settings, {
    title: 'Base App',
    customSetting: 'my setting',
  });
});

test.serial('Should load shop\'s settings with specific fields', async t => {
  const shopName = 'newshop3.sku.vn';
  const loadedSettings = await load(shopName, [
    'customSetting',
  ]);

  t.truthy(loadedSettings);
  t.not(typeof loadedSettings.toJSON, 'function');
  t.is(loadedSettings.shop, shopName);
  t.deepEqual(loadedSettings.settings, {
    customSetting: 'my setting',
  });
});

test.serial('Should load shop\'s settings with specific fields and not lean', async t => {
  const shopName = 'newshop3.sku.vn';
  const loadedSettings = await load(shopName, [
    'customSetting',
  ], false);

  t.truthy(loadedSettings);
  t.is(typeof loadedSettings.toJSON, 'function');
  t.is(loadedSettings.shop, shopName);
  t.deepEqual(loadedSettings.settings, {
    customSetting: 'my setting',
  });
});

test.serial('Should append settings to exist shop', async t => {
  const shopName = 'newshop3.sku.vn';
  const anotherCustomSetting = 'another setting';
  const savedSettings = await save(shopName, {
    anotherCustomSetting,
  });

  t.truthy(savedSettings);
  t.is(savedSettings.shop, shopName);
  t.deepEqual(savedSettings.settings, {
    title: 'Base App',
    customSetting: 'my setting',
    anotherCustomSetting,
  });
});

test.serial('Should create new settings if not exist', async t => {
  const shopName = 'newshop4.sku.vn';
  const customSetting = 'my setting';
  const savedSettings = await save(shopName, {
    customSetting,
  });

  t.truthy(savedSettings);
  t.is(savedSettings.shop, shopName);
  t.deepEqual(savedSettings.settings, {
    customSetting,
  });
});

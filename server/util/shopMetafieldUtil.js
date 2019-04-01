// Import Third-party Libs
import _isEmpty from 'lodash/isEmpty';

// Import Utils
import log from './loggerUtil';

// Import APIs
import { get, create, update } from './api/shop-metafield.api';

// Import Helpers
import { genPrivateKey, genPublicKey } from './helpers/common.helper';

// Import Model Helpers
import { save as saveSetting } from '../models/helpers/setting.model.helper';

const createMetafield = async (HaravanAPI, newMetafield) => {
  try {
    return await create(HaravanAPI, {
      ...newMetafield,
    });
  } catch (e) {
    log.error(e);

    return Promise.resolve();
  }
};

const updateMetafield = async (HaravanAPI, metafieldData) => {
  try {
    return await update(HaravanAPI, metafieldData.id, {
      ...metafieldData,
    });
  } catch (e) {
    log.error(e);

    return Promise.resolve();
  }
};

export const initMetafield = async (HaravanAPI, shop) => {
  try {
    const namespace = 'thank_you_coupon';
    const apiSecretMetaKey = 'api_secret';
    const apiKeyMetaKey = 'api_key';
    const privateKey = genPrivateKey(namespace);
    const publicKey = genPublicKey(namespace);

    const apiSecretMeta = await get(HaravanAPI, {
      namespace,
      key: apiSecretMetaKey,
    });

    const apiKeyMeta = await get(HaravanAPI, {
      namespace,
      key: apiKeyMetaKey,
    });

    if (_isEmpty(apiSecretMeta)) {
      await createMetafield(HaravanAPI, {
        namespace,
        key: apiSecretMetaKey,
        value: privateKey,
        valueType: 'string',
      });
    } else {
      await updateMetafield(HaravanAPI, {
        id: apiSecretMeta[0].id,
        value: privateKey,
        valueType: 'string',
      });
    }

    if (_isEmpty(apiKeyMeta)) {
      await createMetafield(HaravanAPI, {
        namespace,
        key: apiKeyMetaKey,
        value: publicKey,
        valueType: 'string',
      });
    } else {
      await updateMetafield(HaravanAPI, {
        id: apiKeyMeta[0].id,
        value: publicKey,
        valueType: 'string',
      });
    }

    await saveSetting(shop, {
      shopApiKey: publicKey,
      shopSecretKey: privateKey,
    });

    return Promise.resolve();
  } catch (e) {
    log.error(e);

    return Promise.resolve();
  }
};

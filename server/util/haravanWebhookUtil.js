import { fetch, create, update } from './api/webhooks.api';
import log from './loggerUtil';
import envConfig from '../../config/config';

import { WEBHOOK_TOPIC, WEBHOOK_PATH } from '../consts/const';

const appConfig = envConfig.haravanApp;
const webhookPath = `${appConfig.webhookHost}/webhooks`;
const registerWebhooks = [
  // Shop

  {
    topic: WEBHOOK_TOPIC.APP_UNINSTALLED,
    address: `${webhookPath}/${WEBHOOK_PATH.APP_UNINSTALLED}`,
    active: true,
  },
  {
    topic: WEBHOOK_TOPIC.SHOP_UPDATE,
    address: `${webhookPath}/${WEBHOOK_PATH.SHOP_UPDATE}`,
    active: true,
  },

  // User Seller

  {
    topic: WEBHOOK_TOPIC.USER_CREATE,
    address: `${webhookPath}/${WEBHOOK_PATH.USER_CREATE}`,
    active: false,
  },
  {
    topic: WEBHOOK_TOPIC.USER_UPDATE,
    address: `${webhookPath}/${WEBHOOK_PATH.USER_UPDATE}`,
    active: false,
  },
  {
    topic: WEBHOOK_TOPIC.USER_DELETE,
    address: `${webhookPath}/${WEBHOOK_PATH.USER_DELETE}`,
    active: false,
  },

  // Customer

  {
    topic: WEBHOOK_TOPIC.CUSTOMER_CREATE,
    address: `${webhookPath}/${WEBHOOK_PATH.CUSTOMER_CREATE}`,
    active: true,
  },
  {
    topic: WEBHOOK_TOPIC.CUSTOMER_UPDATE,
    address: `${webhookPath}/${WEBHOOK_PATH.CUSTOMER_UPDATE}`,
    active: true,
  },
  {
    topic: WEBHOOK_TOPIC.CUSTOMER_DELETE,
    address: `${webhookPath}/${WEBHOOK_PATH.CUSTOMER_DELETE}`,
    active: true,
  },

  // Order

  {
    topic: WEBHOOK_TOPIC.ORDER_CREATE,
    address: `${webhookPath}/${WEBHOOK_PATH.ORDER_CREATE}`,
    active: true,
  },
  {
    topic: WEBHOOK_TOPIC.ORDER_UPDATE,
    address: `${webhookPath}/${WEBHOOK_PATH.ORDER_UPDATE}`,
    active: true,
  },
  {
    topic: WEBHOOK_TOPIC.ORDER_DELETE,
    address: `${webhookPath}/${WEBHOOK_PATH.ORDER_DELETE}`,
    active: true,
  },
  {
    topic: WEBHOOK_TOPIC.ORDER_CANCELLED,
    address: `${webhookPath}/${WEBHOOK_PATH.ORDER_CANCELLED}`,
    active: false,
  },
  {
    topic: WEBHOOK_TOPIC.ORDER_PAID,
    address: `${webhookPath}/${WEBHOOK_PATH.ORDER_PAID}`,
    active: true,
  },
  {
    topic: WEBHOOK_TOPIC.ORDER_FULFILLED,
    address: `${webhookPath}/${WEBHOOK_PATH.ORDER_FULFILLED}`,
    active: true,
  },

  // Refund

  {
    topic: WEBHOOK_TOPIC.REFUND_CREATE,
    address: `${webhookPath}/${WEBHOOK_PATH.REFUND_CREATE}`,
    active: false,
  },

  // Inventory Location Balance

  {
    topic: WEBHOOK_TOPIC.INVENTORY_LOC_BAL_CREATE,
    address: `${webhookPath}/${WEBHOOK_PATH.INVENTORY_LOC_BAL_CREATE}`,
    active: false,
  },
  {
    topic: WEBHOOK_TOPIC.INVENTORY_LOC_BAL_UPDATE,
    address: `${webhookPath}/${WEBHOOK_PATH.INVENTORY_LOC_BAL_UPDATE}`,
    active: false,
  },
  {
    topic: WEBHOOK_TOPIC.INVENTORY_LOC_BAL_DELETE,
    address: `${webhookPath}/${WEBHOOK_PATH.INVENTORY_LOC_BAL_DELETE}`,
    active: false,
  },

  // Inventory Transaction

  {
    topic: WEBHOOK_TOPIC.INVENTORY_TRANS_CREATE,
    address: `${webhookPath}/${WEBHOOK_PATH.INVENTORY_TRANS_CREATE}`,
    active: false,
  },

  // Inventory Transfer

  {
    topic: WEBHOOK_TOPIC.INVENTORY_TRANSFER_CREATE,
    address: `${webhookPath}/${WEBHOOK_PATH.INVENTORY_TRANSFER_CREATE}`,
    active: false,
  },
  {
    topic: WEBHOOK_TOPIC.INVENTORY_TRANSFER_UPDATE,
    address: `${webhookPath}/${WEBHOOK_PATH.INVENTORY_TRANSFER_UPDATE}`,
    active: false,
  },
  {
    topic: WEBHOOK_TOPIC.INVENTORY_TRANSFER_DELETE,
    address: `${webhookPath}/${WEBHOOK_PATH.INVENTORY_TRANSFER_DELETE}`,
    active: false,
  },

  // Inventory Adjustments

  {
    topic: WEBHOOK_TOPIC.INVENTORY_ADJUST_CREATE,
    address: `${webhookPath}/${WEBHOOK_PATH.INVENTORY_ADJUST_CREATE}`,
    active: false,
  },
  {
    topic: WEBHOOK_TOPIC.INVENTORY_ADJUST_UPDATE,
    address: `${webhookPath}/${WEBHOOK_PATH.INVENTORY_ADJUST_UPDATE}`,
    active: false,
  },

  // Location

  {
    topic: WEBHOOK_TOPIC.LOCATION_CREATE,
    address: `${webhookPath}/${WEBHOOK_PATH.LOCATION_CREATE}`,
    active: false,
  },
  {
    topic: WEBHOOK_TOPIC.LOCATION_UPDATE,
    address: `${webhookPath}/${WEBHOOK_PATH.LOCATION_UPDATE}`,
    active: false,
  },
  {
    topic: WEBHOOK_TOPIC.LOCATION_DELETE,
    address: `${webhookPath}/${WEBHOOK_PATH.LOCATION_DELETE}`,
    active: false,
  },
];

const createHook = async (HaravanAPI, newHook) => {
  try {
    return await create(HaravanAPI, {
      topic: newHook.topic,
      address: newHook.address,
    });
  } catch (e) {
    log.error(e);

    return Promise.resolve();
  }
};

const updateHook = async (HaravanAPI, { oldHook, newHook }) => {
  if (oldHook.address === newHook.address) {
    return Promise.resolve();
  }

  try {
    return await update(HaravanAPI, {
      id: oldHook.id,
      topic: newHook.topic,
      address: newHook.address,
    });
  } catch (e) {
    log.error(e);

    return Promise.resolve();
  }
};

export const initHooks = HaravanAPI => {
  try {
    registerWebhooks
      .filter(hook => hook.active)
      .forEach(async registerHook => {
        try {
          const foundHooks = await fetch(HaravanAPI, {
            topic: registerHook.topic,
            address: registerHook.address,
          });

          if (foundHooks && foundHooks.length) {
            await updateHook(HaravanAPI, {
              oldHook: foundHooks[0],
              newHook: registerHook,
            });
          } else {
            await createHook(HaravanAPI, {
              topic: registerHook.topic,
              address: registerHook.address,
            });
          }

          return Promise.resolve();
        } catch (e) {
          log.error(e);

          return Promise.resolve();
        }
      });
  } catch (e) {
    log.error(e);
  }
};

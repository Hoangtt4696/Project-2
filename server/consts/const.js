export const WEBHOOK_TOPIC = {
  // Shop
  APP_UNINSTALLED: 'app/uninstalled',
  SHOP_UPDATE: 'shop/update',

  // User Seller
  USER_CREATE: 'user/create',
  USER_UPDATE: 'user/update',
  USER_DELETE: 'user/delete',

  // Customer
  CUSTOMER_CREATE: 'customers/create',
  CUSTOMER_UPDATE: 'customers/update',
  CUSTOMER_DELETE: 'customers/delete',

  // Order
  ORDER_CREATE: 'orders/create',
  ORDER_UPDATE: 'orders/update',
  ORDER_DELETE: 'orders/delete',
  ORDER_CANCELLED: 'orders/cancelled',
  ORDER_PAID: 'orders/paid',
  ORDER_FULFILLED: 'orders/fulfilled',

  // Refund
  REFUND_CREATE: 'refunds/create',

  // Inventory Location Balance
  INVENTORY_LOC_BAL_CREATE: 'inventorylocationbalances/create',
  INVENTORY_LOC_BAL_UPDATE: 'inventorylocationbalances/update',
  INVENTORY_LOC_BAL_DELETE: 'inventorylocationbalances/delete',

  // Inventory Transaction
  INVENTORY_TRANS_CREATE: 'inventorytransaction/create',

  // Inventory Transfer
  INVENTORY_TRANSFER_CREATE: 'inventorytransfers/create',
  INVENTORY_TRANSFER_UPDATE: 'inventorytransfers/update',
  INVENTORY_TRANSFER_DELETE: 'inventorytransfers/delete',

  // Inventory Adjustments
  INVENTORY_ADJUST_CREATE: 'inventoryadjustments/create',
  INVENTORY_ADJUST_UPDATE: 'inventoryadjustments/update',

  // Location
  LOCATION_CREATE: 'locations/create',
  LOCATION_UPDATE: 'locations/update',
  LOCATION_DELETE: 'locations/delete',
};

export const WEBHOOK_PATH = {
  // Shop
  APP_UNINSTALLED: 'app/uninstalled',
  SHOP_UPDATE: 'shop/update',

  // User Seller
  USER_CREATE: 'user/create',
  USER_UPDATE: 'user/update',
  USER_DELETE: 'user/delete',

  // Customer
  CUSTOMER_CREATE: 'customers/create',
  CUSTOMER_UPDATE: 'customers/update',
  CUSTOMER_DELETE: 'customers/delete',

  // Order
  ORDER_CREATE: 'orders/create',
  ORDER_UPDATE: 'orders/updated',
  ORDER_DELETE: 'orders/delete',
  ORDER_CANCELLED: 'orders/cancelled',
  ORDER_PAID: 'orders/paid',
  ORDER_FULFILLED: 'orders/fulfilled',

  // Refund
  REFUND_CREATE: 'refunds/create',

  // Inventory Location Balance
  INVENTORY_LOC_BAL_CREATE: 'inventorylocationbalances/create',
  INVENTORY_LOC_BAL_UPDATE: 'inventorylocationbalances/update',
  INVENTORY_LOC_BAL_DELETE: 'inventorylocationbalances/delete',

  // Inventory Transaction
  INVENTORY_TRANS_CREATE: 'inventorytransaction/create',

  // Inventory Transfer
  INVENTORY_TRANSFER_CREATE: 'inventorytransfers/create',
  INVENTORY_TRANSFER_UPDATE: 'inventorytransfers/update',
  INVENTORY_TRANSFER_DELETE: 'inventorytransfers/delete',

  // Inventory Adjustments
  INVENTORY_ADJUST_CREATE: 'inventoryadjustments/create',
  INVENTORY_ADJUST_UPDATE: 'inventoryadjustments/update',

  // Location
  LOCATION_CREATE: 'locations/create',
  LOCATION_UPDATE: 'locations/update',
  LOCATION_DELETE: 'locations/delete',
};

export const QUERY_TYPE = {
  FULL: 'FULL',
  COUNT_ONLY: 'COUNT_ONLY',
  DATA_ONLY: 'DATA_ONLY',
  DATA_WITH_COUNT: 'DATA_WITH_COUNT',
  SUM_ONLY: 'SUM_ONLY',
};

export const QUERY_DATA_TYPE = {
  LEAN: true,
  MODEL: false,
};

export const QUERY_SORT_TYPE = {
  ASC: 1,
  DESC: -1,
};

export const QUERY_SORT_TYPE_NAME = {
  ASC: 'asc',
  DESC: 'desc',
};

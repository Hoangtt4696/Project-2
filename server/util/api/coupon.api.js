export const create = (HaravanAPI, {
  isPromotion = false, // Use with another promotions
  appliesToResource = null, // province, product, collection, customer, product_variant, 'null' for all orders
  appliesToId, // Resource id
  appliesOnce = true, // Order total price or line items
  code,
  startsAt,
  endsAt, // 'null' never exp
  minimumOrderAmount = 0,
  usageLimit = null, // 'null' Unlimited or limit number
  discountType, // fixed_amount, percentage, shipping, same_price
  value,
  setTimeActive = false, // begin time of startsAt/endsAt or base on input from startsAt/endsAt
  variants = null, // Use with 'product_variant' resource
}) => {
  const apiPath = '/admin/discounts.json';
  const postData = {
    discount: {
      is_promotion: isPromotion,
      applies_to_resource: appliesToResource,
      applies_to_id: appliesToId,
      applies_once: appliesOnce,
      code,
      ends_at: endsAt,
      minimum_order_amount: minimumOrderAmount,
      starts_at: startsAt,
      usage_limit: usageLimit,
      value,
      discount_type: discountType,
      set_time_active: setTimeActive,
    },
  };

  if (variants) {
    postData.discount.variants = variants;
  }

  return new Promise((resolve, reject) => {
    HaravanAPI.post(apiPath, postData, (err, data) => {
      if (err) {
        reject(err);
      } else if (data && data.discount) {
        resolve(data.discount);
      } else {
        resolve();
      }
    });
  });
};

export const remove = (HaravanAPI, { id }) => {
  const apiPath = `/admin/discounts/${id}.json`;

  return new Promise((resolve, reject) => {
    HaravanAPI.delete(apiPath, (err) => {
      if (err) {
        reject(err);
      }

      resolve();
    });
  });
};

export const get = (HaravanAPI, {
  page = 1,
  limit = 20,
  sinceId, // Restrict results to those after the specified ID.
  createdAtMin, // Show discounts created after a specified date. Format: 2014-04-25T16:15:47
  createdAtMax, // Show discounts created before a specified date. Format: 2014-04-25T16:15:47
  updatedAtMin, // Show discounts last updated after a specified date. Format: 2014-04-25T16:15:47
  updatedAtMax, // Show discounts last updated before a specified date. Format: 2014-04-25T16:15:47
  ids,
  discountType, // fixed_amount, percentage, shipping
  discountStatus, // enable, disable
  order, // [ created_date | updated_date | id ] + [space] + [ asc | desc ]
}) => {
  let apiPath = `/admin/discounts.json?page=${page}&limit=${limit}`;

  if (sinceId) {
    apiPath += `&since_id=${sinceId}`;
  }

  if (createdAtMin) {
    apiPath += `&created_at_min=${createdAtMin}`;
  }

  if (createdAtMax) {
    apiPath += `&created_at_max=${createdAtMax}`;
  }

  if (updatedAtMin) {
    apiPath += `&updated_at_min=${updatedAtMin}`;
  }

  if (updatedAtMax) {
    apiPath += `&updated_at_max=${updatedAtMax}`;
  }

  if (ids) {
    apiPath += `&ids=${ids}`;
  }

  if (discountType) {
    apiPath += `&discount_type=${discountType}`;
  }

  if (discountStatus) {
    apiPath += `&discount_status=${discountStatus}`;
  }

  if (order) {
    apiPath += `&order=${order}`;
  }

  apiPath = encodeURI(apiPath);

  return new Promise((resolve, reject) => {
    HaravanAPI.get(apiPath, (err, data) => {
      if (err) {
        reject(err);
      } else if (data && data.discounts) {
        resolve(data.discounts);
      } else {
        resolve();
      }
    });
  });
};

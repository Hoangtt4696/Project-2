export const get = (HaravanAPI, { namespace, key, valueType, ownerId, ownerResource, limit = 10, fields = [] }) => {
  let apiPath = `/admin/metafields.json?fields=${fields.join(',')}&limit=${limit}`;

  if (namespace) {
    apiPath += `&namespace=${namespace}`;
  }

  if (key) {
    apiPath += `&key=${key}`;
  }

  if (valueType) {
    apiPath += `&value_type=${valueType}`;
  }

  if (ownerId) {
    apiPath += `&metafield[owner_id]=${ownerId}`;
  }

  if (ownerResource) {
    apiPath += `&metafield[owner_resource]=${ownerResource}`;
  }

  return new Promise((resolve, reject) => {
    HaravanAPI.get(apiPath, (err, data) => {
      if (err) {
        reject(err);
      } else if (data && data.metafields) {
        resolve(data.metafields);
      } else {
        resolve();
      }
    });
  });
};

export const getById = (HaravanAPI, id, fields = []) => {
  const apiPath = `/admin/metafields/${id}.json?fields=${fields.join(',')}`;

  return new Promise((resolve, reject) => {
    HaravanAPI.get(apiPath, (err, data) => {
      if (err) {
        reject(err);
      } else if (data && data.metafield) {
        resolve(data.metafield);
      } else {
        resolve();
      }
    });
  });
};

export const create = (HaravanAPI, { namespace, key, value, valueType }) => {
  const apiPath = '/admin/metafields.json';

  const postData = {
    metafield: {
      namespace,
      key,
      value,
      value_type: valueType,
    },
  };

  return new Promise((resolve, reject) => {
    HaravanAPI.post(apiPath, postData, (err, data) => {
      if (err) {
        reject(err);
      } else if (data && data.metafield) {
        resolve(data.metafield);
      } else {
        resolve();
      }
    });
  });
};

export const update = (HaravanAPI, id, { value, valueType }) => {
  const apiPath = `/admin/metafields/${id}.json`;

  const putData = {
    metafield: {
      id,
      value,
      value_type: valueType,
    },
  };

  return new Promise((resolve, reject) => {
    HaravanAPI.put(apiPath, putData, (err, data) => {
      if (err) {
        reject(err);
      } else if (data && data.metafield) {
        resolve(data.metafield);
      } else {
        resolve();
      }
    });
  });
};

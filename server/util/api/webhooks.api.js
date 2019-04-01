import * as queryString from 'querystring';

export const fetch = (HaravanAPI, { address, fields = 'id,address,topic', limit = 10, page = 1, topic }) => {
  const query = queryString.stringify({
    address,
    fields,
    limit,
    page,
    topic,
  });

  const apiPath = `/admin/webhooks.json/?${query}`;

  return new Promise((resolve, reject) => {
    HaravanAPI.get(apiPath, (err, data) => {
      if (err) {
        reject(err);
      } else if (data && data.webhooks) {
        resolve(data.webhooks);
      } else {
        resolve();
      }
    });
  });
};

export const count = (HaravanAPI, { topic, address }) => {
  const params = {};

  if (topic) {
    params.topic = topic;
  }

  if (address) {
    params.address = address;
  }

  const apiPath = `/admin/webhooks/count.json?${queryString.stringify(params)}`;

  return new Promise((resolve, reject) => {
    HaravanAPI.get(apiPath, (err, data) => {
      if (err) {
        reject(err);
      } else if (data && data.count) {
        resolve(data.count);
      } else {
        resolve();
      }
    });
  });
};

export const getById = (HaravanAPI, { id, fields = 'id,address,topic' }) => {
  let apiPath = `/admin/webhooks/${id}.json`;

  if (fields) {
    apiPath += '?fields=${fields}';
  }

  return new Promise((resolve, reject) => {
    HaravanAPI.get(apiPath, (err, data) => {
      if (err) {
        reject(err);
      } else if (data && data.webhook) {
        resolve(data.webhook);
      } else {
        resolve();
      }
    });
  });
};

export const create = (HaravanAPI, { topic, address, format = 'json' }) => {
  const apiPath = '/admin/webhooks.json';
  const postData = {
    webhook: {
      topic,
      address,
      format,
    },
  };

  return new Promise((resolve, reject) => {
    HaravanAPI.post(apiPath, postData, (err, data) => {
      if (err) {
        reject(err);
      } else if (data && data.webhook) {
        resolve(data.webhook);
      } else {
        resolve();
      }
    });
  });
};

export const update = (HaravanAPI, { id, topic, address }) => {
  const apiPath = `/admin/webhooks/${id}.json`;
  const putData = {
    webhook: {
      id,
      topic,
      address,
    },
  };

  return new Promise((resolve, reject) => {
    HaravanAPI.put(apiPath, putData, (err, data) => {
      if (err) {
        reject(err);
      } else if (data && data.webhook) {
        resolve(data.webhook);
      } else {
        resolve();
      }
    });
  });
};

export const remove = (HaravanAPI, { id }) => {
  const apiPath = `/admin/webhooks/${id}.json`;

  return new Promise((resolve, reject) => {
    HaravanAPI.delete(apiPath, err => { // eslint-disable-line
      if (err) {
        return reject(err);
      }

      resolve();
    });
  });
};

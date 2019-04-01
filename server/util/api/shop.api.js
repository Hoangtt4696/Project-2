export const get = (HaravanAPI, fields = []) => {
  const apiPath = `/admin/shop.json?fields=${fields.join(',')}`;

  return new Promise((resolve, reject) => {
    HaravanAPI.get(apiPath, (err, data) => {
      if (err) {
        reject(err);
      } else if (data && data.shop) {
        resolve(data.shop);
      } else {
        resolve();
      }
    });
  });
};

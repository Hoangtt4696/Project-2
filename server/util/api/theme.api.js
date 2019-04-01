export const get = (HaravanAPI, fields = []) => {
  const apiPath = `/admin/themes.json?fields=${fields.join(',')}`;

  return new Promise((resolve, reject) => {
    HaravanAPI.get(apiPath, (err, data) => {
      if (err) {
        reject(err);
      } else if (data && data.themes) {
        resolve(data.themes);
      } else {
        resolve();
      }
    });
  });
};

export const getById = (HaravanAPI, id, fields = []) => {
  const apiPath = `/admin/themes/${id}.json?fields=${fields.join(',')}`;

  return new Promise((resolve, reject) => {
    HaravanAPI.get(apiPath, (err, data) => {
      if (err) {
        reject(err);
      } else if (data && data.theme) {
        resolve(data.theme);
      } else {
        resolve();
      }
    });
  });
};

export const getAssets = (HaravanAPI, themeId, assetKey) => {
  let apiPath = `/admin/themes/${themeId}/assets.json`;

  if (assetKey) {
    apiPath += `?asset[key]=${assetKey}&theme_id=${themeId}`;
  }

  return new Promise((resolve, reject) => {
    HaravanAPI.get(apiPath, (err, data) => {
      if (err) {
        if (err.errors === 'Dữ liệu không tồn tại!') {
          return resolve();
        }

        reject(err);
      } else if (data && data.asset) {
        resolve(data.asset);
      } else {
        resolve();
      }
    });
  });
};

export const updateAsset = (HaravanAPI, themeId, { key, value }) => {
  const apiPath = `/admin/themes/${themeId}/assets.json`;

  const putData = {
    asset: {
      key,
      value,
    },
  };

  return new Promise((resolve, reject) => {
    HaravanAPI.put(apiPath, putData, (err, data) => {
      if (err) {
        reject(err);
      } else if (data && data.asset) {
        resolve(data.asset);
      } else {
        resolve();
      }
    });
  });
};

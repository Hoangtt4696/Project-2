export const getNewAccessToken = HaravanAPI => {
  return new Promise((resolve, reject) => {
    HaravanAPI.getNewAccessToken((err, tokenData) => {
      if (err) {
        reject(err);
      } else if (tokenData && tokenData.access_token) {
        resolve(tokenData);
      } else {
        resolve();
      }
    });
  });
};

export const refreshAccessToken = (HaravanAPI, refreshToken) => {
  return new Promise((resolve, reject) => {
    HaravanAPI.refreshAccessToken(refreshToken, (err, tokenData) => {
      if (err) {
        reject(err);
      } else if (tokenData && tokenData.access_token) {
        resolve(tokenData);
      } else {
        resolve();
      }
    });
  });
};

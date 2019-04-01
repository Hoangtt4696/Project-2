export const validateHook = () => {
  return (req, res, next) => {
    const { couponSettings } = req.session;

    if (!couponSettings) {
      return res.sendStatus(200);
    }

    return next();
  };
};

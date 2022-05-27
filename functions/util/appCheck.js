const { admin } = require('./admin');

module.exports = async (req, res, next) => {
  const appCheckToken = req.header('X-Firebase-AppCheck');
  if (!appCheckToken) {
    res.status(401);
    return next('Unauthorized');
  }

  try {
    await admin.appCheck().verifyToken(appCheckToken);
    return next();
  } catch (err) {
    res.status(401);
    return next('Unauthorized');
  }
};

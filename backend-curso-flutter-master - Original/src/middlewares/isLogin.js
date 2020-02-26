const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    const { token } = req.headers;
    console.log(`isLogin Token: ${token}`);

    const result = await jwt.verify(token, process.env.SECRET);
    if (!result) {
      const error = new Error('invalid token');
      error.httpStatusCode = 403;
      return next(error);
    }
    req.userId = result.id;
    console.log(`userId-----: ${req.userId}`)
    return next();
  } catch (error) {
    return res.status(403).send({ message: error.message });
  }
};

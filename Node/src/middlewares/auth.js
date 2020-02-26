const jwt = require('jsonwebtoken');

const isValidHostname = (req, res, next) => {
   const validHosts = ['dina.ec', 'localhost'];
  if (validHosts.includes(req.hostname)) {
    next();
  } else {
    res.status(403).send({status: 'ACCESS_DENIED'});
  }
};

const isAuth = (req, res, next) => {
   try {
       
    const { token } = req.headers;

    if( token ){
        const data = jwt.verify(token, process.env.JWT_SECRET);
       console.log('jwt data', data);

        if(data.userId != req.body.userId && data.role != 'admin' ){
          throw{code: 403, status: 'ACCESS DENIED', message: 'Mising Header token'}
        }
        // req.sessionData = { userId: data.userId };
        next(); 
    } else {
        throw{code: 403, status: 'ACCESS DENIED', message: 'Mising Header token'}
    }
   } catch (error) {
    res.status(error.code || 500 ).send({ status: error.status || 'ERROR', message: error.message});
       
   }
};

const isLogin = async (req, res, next) => {
  try {
    const { token } = req.headers;

    const result = await jwt.verify(token, process.env.JWT_SECRET);
    
    if (!result) {
      const error = new Error('invalid token');
      error.httpStatusCode = 403;
      return next(error);
    }
    req.userId = result.userId;
    return next();
  } catch (error) {
    return res.status(403).send({ message: error.message });
  }
};

module.exports = { isValidHostname , isAuth, isLogin };

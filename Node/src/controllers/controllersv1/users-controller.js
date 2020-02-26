const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const Users = require('../../mongo/models/users');
const profile = require('./profile');
const tokens = require('./tokens-controller');

const expiresIn = 60 * 60;
///----------------------[   LOGIN USER   ]----------------------------------------------------------///
const login = async (req, resp) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });

    if (user) {

      const token = await jwt.sign( { userId: user._id, role: user.role }, process.env.JWT_SECRET,  { expiresIn } );
      
      const isOK = await bcrypt.compare(password, user.password);

      if (isOK) {
        resp.status(200).send({token,expiresIn});
        // resp.status(200).send({ status: 'OK', data: { token, expiresIn } });

        return _.omit(user.toObject(), 'password', '__v');

      } else {
        resp.status(403).send({ status: 'USER OR PASSWORD INVALID', message: '' });
      }
    } else {
      resp.status(401).send({ status: 'USER NOT FOUND', message: '' });
    }
  } catch (error) {
    resp.status(500).send({ status: 'Error', message: error.message });
  }
};
//////////--------------[   SIGN UP USER    ]----------------------------//////
const createUser = async (request, response) => {
  try {
    
    const { username, email, password, data } = request.body;
    const hash = await bcrypt.hash(password, 15);

    const user = await Users.create({
      username, // username: username
      email,
      data,
      password: hash
    });
    
    
    // // CREATE TOKEN/////////////
    const token = await jwt.sign(
      { userId: user._id, role: user.role }, process.env.JWT_SECRET,{ expiresIn }
    );//////////////////////////
    
    response.status(200).send({token,expiresIn: expiresIn});
    return _.omit(user.toObject(), 'password', '__v');
  } catch (error) {
    if (error.code && error.code === 1100) {

      response.status(400).send({ status: 'DUPLICATED_VALUES', message: error.keyValue });
      return;
    }
    response.status(500).send({ status: 'Error', message: error.message });
  }
};

const updateUser = async (request, response) => {
  try {
    // console.log('req.sessionData', req.sessionData.userId); 

    const { username, email, password, data, userId } = request.body;

    await Users.findByIdAndUpdate(userId, {
      username,
      email,
      data
    });

    response.send({ status: 'OK', message: 'user update' });
  } catch (error) {
    if (error.code && error.code === 1100) {
      response
        .status(400)
        .send({ status: 'DUPLICATED_VALUES', message: error.keyValue });
      return;
    }
    response
      .status(500)
      .send({ status: 'Error', message: "It couldn't be update" });
  }
};
/// Falta DELETE AND GET USERS
const deleteUser = (request, response) => {
  console.log('req-body', request.body);
  response.send({ status: 'OK', message: 'user deleted' });
};

const getUsers = (request, response) => {
  response.send({ status: 'OK', data: [] });
};

///--------[ USER INFO]-------------------//
const userInfo = async (req, res) => {
  try {
    console.log(`body: ${JSON.stringify(req.headers)}`)
    console.log(`USER INFO ID ${req.userId}`)
    const response = await profile.info(req.userId);
    console.log(`response: ${response}`)
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
///--------[ END USER INFO]-------------------//

  // app.post(
  //   '/api/v1/update-avatar',
  //   isLogin,
  //   uploader.single('attachment'),
  //   async (req, res) => {
  //     try {
  //       const { file } = req;
  //       if (!file) {
  //         throw new Error('Please upload a file');
  //       }
  //       await profile.avatar(req.userId, req.filePath);
  //       res.status(200).send(req.filePath);
  //     } catch (error) {
  //       res.status(500).send({ message: error.message });
  //     }
  //   }
  // );

// create a new refreshToken for an especific user by Id
const registerToken = async (req, res)=>{
  try {
    const { token } = req.headers;  
    console.log('token: '+ token );
    console.log('\n');
    const data = await jwt.verify(token, process.env.JWT_SECRET);
    const payload = _.omit(data, ['iat', 'exp']);
    console.log(`data register: ${payload}`);
    await tokens.newRefreshToken(token, payload);
    res.status(200).send({ message: 'OK' });
  } catch (error) {
    console.log('registerToken', error.message);
    res.status(500).send({ message: error.message });
  }
};

// create a new jwt token for an especific user by Id
const refreshToken = async (req, res)=>{
  try {
    const { token } = req.headers;
    const data = await tokens.refresh(token);
    if (!data) throw new Error('invalid refreshToken');
    console.log('token refrescado');
    res.status(200).send(data);
  } catch (error) {
    console.log('error refresh-token', error.message);
    if (error.message === '403') {
      res.status(403).send({ message: error.message });
    } else {
      res.status(500).send({ message: error.message });
    }
  }

};

module.exports = {  
  createUser,
  deleteUser,
  getUsers,
  updateUser,
  registerToken,//TOKENS
  refreshToken,
  userInfo,
  login
};

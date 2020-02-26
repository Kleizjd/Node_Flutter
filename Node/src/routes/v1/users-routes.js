const express = require('express');
const { isAuth , isValidHostname, isLogin } = require('../../middlewares/auth');
const usersController = require('../../controllers/controllersv1/users-controller');

const router = express.Router();

router.post('/login', usersController.login); 
router.post('/create', usersController.createUser);
router.post('/update', isValidHostname, isAuth, usersController.updateUser);
/////---------[ TOKEN ]---------------------------------------------//
router.post('/registerToken', isLogin, usersController.registerToken);
router.post('/refreshToken', usersController.refreshToken);
/////---------[ END TOKEN ]-----------------------------------------//
router.get('/userInfo', isLogin, usersController.userInfo);

// router.post('/delete', usersController.deleteUser);
// router.get('/get-all', usersController.getUsers);

module.exports = router;
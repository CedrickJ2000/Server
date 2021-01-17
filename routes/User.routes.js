var express = require('express');
var router = express.Router();

const UserController = require('../controllers/User.Controllers.js');
const verifyToken = require('../controllers/Verify.token');

router.post('/add/user', UserController.addUser);

router.post('/user/login', UserController.userLogin);

router.get('/user/info/:_id', verifyToken, UserController.getUserInfo);

router.get(
  '/user/favorites/:userID',
  verifyToken,
  UserController.getUserFavorites
);

// Update Favorites
router.put(
  '/user/updatefavorites/:userID',
  verifyToken,
  UserController.updateUserFavorites
);
module.exports = router;

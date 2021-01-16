const User = require('../models/users.model');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.addUser = async (req, res) => {
  try {
    const findEmail = await User.find({ EmailAddress: req.body.EmailAddress });
    const findUserName = await User.find({ UserName: req.body.UserName });

    const validationSchema = Joi.object({
      UserName: Joi.string().min(5).required(),
      FirstName: Joi.string().min(3).required(),
      LastName: Joi.string().required(),
      EmailAddress: Joi.string().min(8).required().email(),
      Password: Joi.string()
        .min(6)
        .required()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    });

    const { error } = validationSchema.validate(req.body);
    if (error) return res.status(400).send({ message: error });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.Password, salt);
    if (findEmail.length >= 1 && findUserName.length >= 1) {
      return res
        .status(403)
        .send({ message: 'Email And Username is already existed ' });
    } else if (findEmail.length >= 1) {
      return res.status(403).send({ message: 'Email is already existed' });
    } else if (findUserName.length >= 1) {
      return res.status(403).send({ message: 'UserName is already existed' });
    } else {
      const user = new User({
        UserName: req.body.UserName,
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        EmailAddress: req.body.EmailAddress,
        Password: hashedPassword,
      });

      const saveUser = await user.save();
      res.send({ user: user._id });
      return res.status(200).send(saveUser);
    }
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

exports.userLogin = async (req, res) => {
  try {
    const validationLogin = Joi.object({
      EmailAddress: Joi.string().min(6).required(),
      Password: Joi.string().min(6).required(),
    });

    // Request Validations
    const { error } = validationLogin.validate(req.body);
    if (error)
      return res.status(400).send({
        message: error.details[0].message,
        status: 'none',
        statusCode: 400,
      });

    // Check if username exists
    const user = await User.findOne({ EmailAddress: req.body.EmailAddress });
    if (!user)
      return res.status(409).send({
        message: `"Username or Password is wrong"`,
        status: 'none',
        statusCode: 409,
      });
    const validPass = await bcrypt.compare(req.body.Password, user.Password);
    if (!validPass)
      return res.status(403).send({
        message: `"Invalid Password or Email"`,
        status: 'none',
        statusCode: 403,
      });

    // Create and assign token
    const payload = {
      _id: user._id,
      EmailAddress: user.EmailAddress,
    };
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '1d',
    });
    res.status(200).header('auth-token', token).send({
      token: token,
      _id: user._id,
      logged_in: 'Yes',
      message: `User verified`,
      status: 200,
    });
  } catch (err) {
    return res.status(400).json({ message: err.message, status: 400 });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const getInfo = await User.findById(req.params._id);
    return res
      .status(200)
      .json({ message: 'User Retrived', data: getInfo, statusCode: 200 });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message, statusCode: 400 });
  }
};

exports.getUserFavorites = async (req, res) => {
  // Check User ID if match
  if (req.params.UserName != req.user._id)
    return res.status(401).json({ message: 'User Access Denied', status: 401 });

  try {
    const user = await User.findById(req.params.UserName);
    return res.status(200).json({
      data: user.favorites,
      message: `User ${user.UserName} favorites is retrived`,
      status: 200,
    });
  } catch (err) {
    return res.status(400).json({ message: err.message, status: 400 });
  }
};
exports.updateUserFavorites = async (req, res) => {
  // Check User ID if match
  if (req.params.userID != req.user._id)
    return res.status(401).send({ message: 'User Access Denied', status: 401 });

  try {
    const userID = req.params.userID;
    const reqBody = req.body.Movies;
    const findExis = await User.find({ _id: userID });
    const favorites = findExis[0].favorites;
    for (let i = 0; i < favorites.length; i++) {
      if (
        findExis[0].favorites[i].background_image_original ===
        reqBody.background_image_original
      )
        return res.status(409).send({
          message: 'This Movie is already exist in your favorites.',
          status: 409,
        });
    }
    const updateFavorites = await User.updateOne(
      { _id: userID },
      { $push: { favorites: reqBody } }
    );
    return res.status(200).json({
      data: updateFavorites,
      message: `User ${userID} The Movie Has Been Added`,
      status: 200,
    });
  } catch (err) {
    return res.status(400).json({ message: err.message, status: 400 });
  }
};

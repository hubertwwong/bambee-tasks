const UserModel = require('../models/userModel');
const {errorRender} = require('../util/misc');

/**
 * Login a user
 * 
 * TODO:
 * 1. Check params correctness.
 * 2. Check if user actually is in db.
 * 3. Check if password is correct before generating a JWT token.
 * 
 * @returns Sends a JWT token or an error message.
 */
exports.authLogin = async (req, res) => {
  try {
    // console.log("> authLogin controller " + req.body.username + "|" + req.body.password);
    let user = await UserModel.signin(req.body.username, req.body.password);
    // console.log("> output of authLogin " + user);
    res.json({message: 'User signed in'});
  } catch(err) {
    errorRender(err, res);
  }
};

/**
 * Register a user.
 * 
 * TODO:
 * 1. Check for params.
 * 2. Check for existing users.
 */
exports.authRegister = async (req, res) => {
  try {
    await UserModel.register(req.body.username, req.body.password);
    res.json({message:'User registered'});
  } catch(err) {
    errorRender(err, res);
  }
};
const UserModel = require('../models/userModel');
const {errorRender} = require('../util/misc');

/**
 * Login a user
 * 
 * Request body should look like:
 * {
 *  username: YourUserName
 *  password: yourPassword
 * }
 */
exports.authLogin = async (req, res) => {
  try {
    let jwtTokenObj = await UserModel.signin(req.body.username, req.body.password);
    res.json(jwtTokenObj);
  } catch(err) {
    errorRender(err, res);
  }
};

/**
 * Register a user.
 * 
 * Request body should look like:
 * {
 *  username: YourUserName
 *  password: yourPassword
 * }
 */
exports.authRegister = async (req, res) => {
  try {
    let jwtTokenObj = await UserModel.register(req.body.username, req.body.password);
    res.json(jwtTokenObj);
  } catch(err) {
    errorRender(err, res);
  }
};
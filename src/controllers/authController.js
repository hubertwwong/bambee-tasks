const UserModel = require('../models/userModel');
const {errorRender} = require('../util/misc');

/**
 * Login a user
 * 
 * Upon sucessful login, this will return a jwtToken.
 * 
 * Request body should look like:
 * {
 *  username: YourUserName
 *  password: yourPassword
 * }
 * 
 * Token should come in this format.
 * {
 *  jwtToken: YourJWTToken
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
 * Upon sucessful login, this will return a jwtToken.
 * 
 * Request body should look like:
 * {
 *  username: YourUserName
 *  password: yourPassword
 * }
 * 
 * Token should come in this format.
 * {
 *  jwtToken: YourJWTToken
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
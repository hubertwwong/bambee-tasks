const UserModel = require('../models/userModel');
const {errorRender} = require('../util/misc');

/**
 * Login a user
 * 
 * Upon sucessful login, this will return a jwt.
 * 
 * Request body should look like:
 * {
 *  username: YourUserName
 *  password: yourPassword
 * }
 * 
 * Token should come in this format.
 * {
 *  jwt: YourJWT
 * }
 */
exports.authLogin = async (req, res) => {
  try {
    let jwtObj = await UserModel.signin(req.body.username, req.body.password);
    res.json(jwtObj);
  } catch(err) {
    errorRender(err, res);
  }
};

/**
 * Register a user.
 * 
 * Upon sucessful login, this will return a jwt.
 * 
 * Request body should look like:
 * {
 *  username: YourUserName
 *  password: yourPassword
 * }
 * 
 * Token should come in this format.
 * {
 *  jwt: YourJWT
 * }
 */
exports.authRegister = async (req, res) => {
  try {
    let jwtObj = await UserModel.register(req.body.username, req.body.password);
    res.json(jwtObj);
  } catch(err) {
    errorRender(err, res);
  }
};
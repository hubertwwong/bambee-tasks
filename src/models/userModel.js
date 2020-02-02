const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//var token = jwt.sign({ foo: 'bar' }, 'shhhhh');

const UserGooseModel = require('../mongoose/models/userGooseModel');

/**
 * Register a user in the db.
 * 
 * @param username - username
 * @param password - unencrypted password 
 * @returns JWT token or error object.
 */
exports.register = async (username, password) => {
  try {
    if (!username || !password) {
      return Promise.reject(new Error(JSON.stringify({
        message: "Required params not passed in",
        status: 422
      })));
    }

    let existingUser = await UserGooseModel.find({username: username});
    // User not found. Can try to register the user.
    if (!existingUser || existingUser.length == 0) {
      let hash = await bcrypt.hashSync(password, parseInt(process.env.PASSWORD_HASH_ROUNDS));
      const newUser = new UserGooseModel({
        username: username,
        password: hash
      });
      let user = await newUser.save();
      const tokenWithUserID = await jwt.sign({id: user.id}, process.env.JWT_SECRET_KEY);
      
      return Promise.resolve({jwt: tokenWithUserID});
    }
    
    return Promise.reject(new Error(JSON.stringify({
        message: "User already exists",
        status: 409,
      })));
  } catch(err) {
    return Promise.reject(new Error(err));
  }
};

/**
 * Signs in a user.
 *
 * @param username - username
 * @param password - unencrypted password  
 * @returns JWT token or error object.
 */
exports.signin = async (username, password) => {
  try {
    if (!username || !password) {
      return Promise.reject(new Error(JSON.stringify({
        message: "Required params not passed in",
        status: 422
      })));
    }

    let existingUser = await UserGooseModel.findOne({username: username});
    // Check for existing user before trying to register them.
    if (existingUser) {
      // Hash the password. We are storing that rather than the actual password.
      let res = await bcrypt.compareSync(password, existingUser.password);
      
      // Password failed.
      if (!res){
        return Promise.reject(new Error(JSON.stringify({
            message: "Username or password wrong",
            status: 401
          })));
      };

      // Returning the user.
      const tokenWithUserID = await jwt.sign({id: existingUser.id}, process.env.JWT_SECRET_KEY);
      return Promise.resolve({jwt: tokenWithUserID});
    }
    
    return Promise.reject(new Error(JSON.stringify({
        message: "User not found",
        status: 404
      })));
  } catch(err) {
    return Promise.reject(new Error(err));
  }
};

/**
 * Find a userID.
 * 
 * Note: This is not exposed to the API.
 * 
 * @param userID - mongo id of the user.
 * @returns user
 */
exports.find = async(userID) => {
  try {
    if (!userID) {
      return Promise.reject(new Error(JSON.stringify({
        message: "Required params not passed in",
        status: 422
      })));
    }
    let existingUser = await UserGooseModel.findOne({_id: userID});
    if (existingUser) {
      return existingUser;
    }

    return Promise.reject(new Error(JSON.stringify({
      message: "User not found",
      status: 404
    })));
  } catch(err) {
    return Promise.reject(new Error(err));
  }
}
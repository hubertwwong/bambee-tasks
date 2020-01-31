const bcrypt = require('bcryptjs');

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
    // User found.
    if (!existingUser || existingUser.length == 0) {
      let hash = await bcrypt.hashSync(password, parseInt(process.env.PASSWORD_HASH_ROUNDS));
      const newUser = new UserGooseModel({
        username: username,
        password: hash
      });
      let res = await newUser.save();
      return res;
    }
    
    return Promise.reject(new Error(JSON.stringify({
        message: "User already exists",
        status: 422,
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

    let existingUser = await UserGooseModel.find({username: username});
    // Check for existing user before trying to register them.
    if (existingUser && existingUser.length > 0) {
      // Hash the password. We are storing that rather than the actual password.
      let res = await bcrypt.compareSync(password, existingUser[0].password);
      
      // Password failed.
      if (!res){
        return Promise.reject(new Error(JSON.stringify({
            message: "Username or password wrong",
            status: 422
          })));
      };

      // Returning the user.
      return Promise.resolve(existingUser[0]);
    }
    
    return Promise.reject(new Error(JSON.stringify({
        message: "User not found",
        status: 404
      })));
  } catch(err) {
    return Promise.reject(new Error(err));
  }
};
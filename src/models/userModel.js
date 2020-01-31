const bcrypt = require('bcryptjs');
//const {promisify} = require('util');

const UserModel = require('../schemas/userSchema');

/**
 * Register a user in the db.
 * 
 * @returns JWT token or error object.
 */
exports.register = async (username, password) => {
  try {
    // debug
    // let resF = await UserModel.find();
    // resF.forEach(i => {
    //   console.log(resF);
    // });

    // console.log(">>> register model " + username + "|" + password);
    let existingUser = await UserModel.find({username: username});
    // User found.
    if (!existingUser || existingUser.length == 0) {
      // Reminder. Parse the env values if you want ints.
      let hash = await bcrypt.hashSync(password, parseInt(process.env.PASSWORD_HASH_ROUNDS));
      const newUser = new UserModel({
        username: username,
        password: hash
      });
      let res = await newUser.save();
      // console.log("> User saved " + res);
      return res;
    }
    // console.log("> User already found.");
    return Promise.reject("User already exists");
  } catch(err) {
    // console.log("> User register > ERR" + err);
    return Promise.reject(new Error(err));
  }
};

/**
 * Signs in a user.
 * 
 * @returns JWT token or error object.
 */
exports.signin = async (username, password) => {
  try {
    // console.log(">>> signin model " + username + "|" + password);
    let existingUser = await UserModel.find({username: username});
    // User should not exist before we regsiter them.
    // console.log(existingUser);
    if (existingUser && existingUser.length > 0) {
      // Hash the password. We are storing that rather than the actual password.
      // console.log(">>> " + password + " | " + existingUser[0].password);
      let res = await bcrypt.compareSync(password, existingUser[0].password);
      
      if (!res){
        return Promise.reject(new Error(JSON.stringify({
            message: "Username or password wrong",
            status: 422
          })));
      };

      console.log(">>> resolve promise" + existingUser[0]);
      return Promise.resolve(existingUser[0]);
    }
    
    return Promise.reject(new Error(JSON.stringify({
        message: "User not found",
        status: 404
      })));
  } catch(err) {
    console.log("> authLogin > catch > " + err);
    return Promise.reject(new Error(err));
  }
};
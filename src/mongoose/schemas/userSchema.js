const mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
  username: {
    type: String,
    index: true,
    unique: true
  },
  password: String
});

module.exports = UserSchema;
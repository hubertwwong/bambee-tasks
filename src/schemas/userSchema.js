const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

let UserSchema = new mongoose.Schema({
  username: {
    type: String,
    index: true,
    unique: true
  },
  password: String
});

// Wrapping the schema and model in one.
// Mongoose schemas are fancy constructors.
module.exports = mongoose.model('User', UserSchema);
const mongoose = require('mongoose');

// Wrapping the schema and model in one.
// Mongoose schemas are fancy constructors.
module.exports = mongoose.model('User', new mongoose.Schema({
  name: {
    type: String,
    index: true,
    unique: true
  },
  password: String,
  salt: String,
}));
const mongoose = require('mongoose');

const UserSchema = require('../schemas/userSchema');

module.exports = mongoose.model('UserSchema', UserSchema);
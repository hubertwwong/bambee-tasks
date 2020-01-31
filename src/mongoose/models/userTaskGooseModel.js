const mongoose = require('mongoose');

const UserSchema = require('../schemas/userTaskSchema')

module.exports = mongoose.model('UserTask', UserTask);
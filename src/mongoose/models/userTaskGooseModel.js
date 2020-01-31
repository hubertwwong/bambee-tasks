const mongoose = require('mongoose');

const UserTaskSchema = require('../schemas/userTaskSchema')

module.exports = mongoose.model('UserTask', UserTaskSchema);
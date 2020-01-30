const mongoose = require('mongoose');

const user = require('./user');

module.exports = mongoose.model('UserTask', new mongoose.Schema({
  userID: {
    type: String,
    index: true,
    unique: true
  },
  tasks: [{
    name: String,
    description: String,
    status: String,
    dueDate: Date
  }]
}));
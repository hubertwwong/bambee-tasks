const mongoose = require('mongoose');

let UserTasksSchema = new mongoose.Schema({
  userID: {
    type: String,
    index: true,
    unique: true
  },
  tasks: [{
    name: String,
    description: String,
    stage: String,
    dueDate: Date
  }]
});

module.exports = mongoose.model('UserTask', UserTasksSchema);
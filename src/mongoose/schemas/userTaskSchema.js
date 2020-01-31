const mongoose = require('mongoose');

const TaskSchema = require('./taskSchema');

let UserTaskSchema = new mongoose.Schema({
  userID: {
    type: String,
    index: true,
    unique: true
  },
  tasks: [TaskSchema]
});

module.exports = UserTaskSchema;
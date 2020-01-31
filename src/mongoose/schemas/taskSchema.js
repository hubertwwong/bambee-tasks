const mongoose = require('mongoose');

let TaskSchema = new mongoose.Schema({
  name: String,
  description: String,
  stage: String,
  dueDate: Date
});

module.exports = TaskSchema;
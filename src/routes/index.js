const express = require('express');
const router = express.Router();

// const authRoutes = require('./authRoutes');
const taskRoutes = require('./taskRoutes');

module.exports = (app) =>{
  // app.use('/auth', authRoutes);
  app.use('/v2/tasks', taskRoutes);
}

//const express = require('express');
//const router = express.Router();

const authRoutes = require('./authRoutes');
const taskRoutes = require('./taskRoutes');


module.exports = (app) =>{
  app.use('/v1/auth', authRoutes);
  app.use('/v2/tasks', taskRoutes);

  // catch all route to return 404
  app.get("*", (req, res) => {
    res.sendStatus(404);
  });  
}

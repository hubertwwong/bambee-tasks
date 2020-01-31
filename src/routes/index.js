const jwt = require('express-jwt');

const authRoutes = require('./authRoutes');
const taskRoutes = require('./taskRoutes');
const errors = require('../middleware/errors');
const val = require('../middleware/validate');

module.exports = (app) =>{
  // Putting the middleware here to DRY things rather on the individual routes.
  app.use('/v1/auth', val.validate('user'), errors, authRoutes);
  app.use('/v2/tasks', jwt({secret: process.env.JWT_SECRET_KEY}), taskRoutes);

  // catch all route to return 404
  app.get("*", (req, res) => {
    res.sendStatus(404);
  });  
}

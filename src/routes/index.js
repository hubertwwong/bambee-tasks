const jwt = require('express-jwt');

const authRoutesV1 = require('./v1/authRoutes');
const taskRoutesV1 = require('./v1/taskRoutes');
const taskRoutesV2 = require('./v2/taskRoutes');
const errors = require('../middleware/errors');
const val = require('../middleware/validate');

module.exports = (app) =>{
  // Putting the middleware here to DRY things rather on the individual routes.
  app.use('/v1/auth', val.validate('user'), errors, authRoutesV1);
  app.use('/v1/tasks', jwt({secret: process.env.JWT_SECRET_KEY}), taskRoutesV1);
  app.use('/v2/tasks', jwt({secret: process.env.JWT_SECRET_KEY}), taskRoutesV2);

  // catch all route to return 404
  app.get("*", (req, res) => {
    res.sendStatus(404);
  });  
}

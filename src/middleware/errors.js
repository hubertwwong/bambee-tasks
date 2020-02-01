/**
 * Errors is a simple middleware that checks for error that gets returned from express validator.
 * If there are errors, just return 400.
 * Otherwise pass the request along.
 */

const { validationResult } = require('express-validator');

// NOTE:
// Need module.exports and not exports.
// Also note that if you do specify err, it has to be the last middleware
module.exports = (req, res, next) => {
  // console.log('>>>>>>>>>>>>>> ERR MIDDLEWARE REPORT');
  const errors = validationResult(req);

  // 
  // https://github.com/auth0/express-jwt/issues/189
  // console.log(err);
  // if (err.name === 'UnauthorizedError') {
    // res.status(401).send({message: 'Invalid token'});
  // }
  
  // You only want this to fire if there are any error messages.
  if (!errors.isEmpty()) {
    res.status(422).json({ 
      errors: errors.array() 
    });
  } else {
    // If no errors, continue the request.
    next();
  }
}
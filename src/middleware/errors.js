/**
 * Errors is a simple middleware that checks for error that gets returned from express validator.
 * If there are errors, just return 400.
 * Otherwise pass the request along.
 */

const { validationResult } = require('express-validator');

// NOTE:
// Need module.exports and not exports.
module.exports = (req, res, next) => {
  const errors = validationResult(req);
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
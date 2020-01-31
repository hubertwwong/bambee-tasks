/**
 * Validate controller params using the express-validator middleware.
 */

const { body } = require('express-validator')

exports.validate = (method) => {
  switch (method) {
    case 'user': {
      return [ 
          body('username', `username doesn't exists`).exists(),
          body('password', `password doesn't exists`).exists(),
        ];   
    }
  }
}
/**
 * Validate controller params using the express-validator middleware.
 */

const { body } = require('express-validator')

exports.validate = (method) => {
  switch (method) {
    case 'user': {
      return [ 
          body('username', `username doesn't exists in body`).exists(),
          body('password', `password doesn't exists in body`).exists(),
        ];   
    }
    case 'createTask': {
      return [ 
        body('name', `name doesn't exists in body`).exists(),
        body('description', `description doesn't exists in body`).exists(),
        body('dueDate', `dueDate doesn't exists in body`).exists(),
      ];
    }

  }
}
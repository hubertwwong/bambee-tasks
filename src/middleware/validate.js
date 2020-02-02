/**
 * express-validator configuration
 * 
 * To use:
 * 1. require this file in the route file.
 * 2. Specify the validation. (e.g. v.validate("createTask"))
 * 
 * I kept the validation simple.
 * Just validiating if dates are iso and that other fields exist.
 * Can add more if needed.
 */

const { body, oneOf } = require('express-validator')

const constants = require('./constants');

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
    case 'patchTaskV1': {
      return oneOf([ 
        body('name', `name doesn't exists in body`).exists(),
        body('description', `description doesn't exists in body`).exists(),
        body('dueDate', `dueDate doesn't exists in body`).exists().isISO8601(),
        body('stage', `stage doesn't exists in body or is not ${constants.v1.stage}`).exists().isIn(constants.v1.stage),
      ]);
    }
    case 'patchTaskV2': {
      return oneOf([
        body('name', `name doesn't exists in body`).exists(),
        body('description', `description doesn't exists in body`).exists(),
        body('dueDate', `dueDate doesn't exists in body`).exists().isISO8601(),
        body('stage', `stage doesn't exists in body or not these values ${constants.v2.stage}`).exists().isIn(constants.v2.stage),
      ]);
    }
    case 'putTaskV1': {
      return [ 
        body('name', `name doesn't exists in body`).exists(),
        body('description', `description doesn't exists in body`).exists(),
        body('dueDate', `dueDate doesn't exists in body`).exists().isISO8601(),
        body('stage', `stage doesn't exists in body or is not ${constants.v1.stage}`).exists().isIn(constants.v1.stage),
      ];
    }
    case 'putTaskV2': {
      return [ 
        body('name', `name doesn't exists in body`).exists(),
        body('description', `description doesn't exists in body`).exists(),
        body('dueDate', `dueDate doesn't exists in body`).exists().isISO8601(),
        body('stage', `stage doesn't exists in body or not these values ${constants.v2.stage}`).exists().isIn(constants.v2.stage),
      ];
    }
  }
}
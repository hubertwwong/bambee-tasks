/**
 * Validate controller params using the express-validator middleware.
 */

const { body, oneOf } = require('express-validator')

const {validateTaskPatchV1, validateTaskPatchV2} = require('./customValidators');
const constants = require('./constants');

exports.validate = (method) => {
  // console.log(">>>> VALIDATE " + method);
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
      return [
        validateTaskPatchV1
      ];
    }
    case 'patchTaskV2': {
      return oneOf([
        body('name', `name doesn't exists in body`).exists(),
        body('description', `description doesn't exists in body`).exists(),
        body('dueDate', `dueDate doesn't exists in body`).exists(),
        body('stage', `stage doesn't exists in body or not these values ${constants.v2.stage}`).exists().isIn(constants.v2.stage),
      ]);
    }
    case 'putTaskV1': {
      return [ 
        body('name', `name doesn't exists in body`).exists(),
        body('description', `description doesn't exists in body`).exists(),
        body('dueDate', `dueDate doesn't exists in body`).exists(),
        body('stage', `stage doesn't exists in body or is not ${constants.v1.stage}`).exists().isIn(constants.v1.stage),
      ];
    }
    case 'putTaskV2': {
      return [ 
        body('name', `name doesn't exists in body`).exists(),
        body('description', `description doesn't exists in body`).exists(),
        body('dueDate', `dueDate doesn't exists in body`).exists(),
        body('stage', `stage doesn't exists in body or not these values ${constants.v2.stage}`).exists().isIn(constants.v2.stage),
      ];
    }
  }
}
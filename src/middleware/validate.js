/**
 * Validate controller params using the express-validator middleware.
 */

const { body, params } = require('express-validator')

const STAGE_KEYWORDS_V1 = ['New', 'Completed'];
const STAGE_KEYWORDS_V2 = ['New', 'Completed', 'In-Progress'];


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
    case 'patchTask': {
      return [ 
        body('name', `name doesn't exists in body`).optional(),
        body('description', `description doesn't exists in body`).optional(),
        body('dueDate', `dueDate doesn't exists in body`).optional(),
        body('stage', `stage doesn't exists in body`).optional(),
      ];
    }
    case 'putTaskV1': {
      return [ 
        body('name', `name doesn't exists in body`).exists(),
        body('description', `description doesn't exists in body`).exists(),
        body('dueDate', `dueDate doesn't exists in body`).exists(),
        body('stage', `stage doesn't exists in body or is not ${STAGE_KEYWORDS_V2}`).exists().isIn(STAGE_KEYWORDS_V1),
      ];
    }
    case 'putTaskV2': {
      return [ 
        body('name', `name doesn't exists in body`).exists(),
        body('description', `description doesn't exists in body`).exists(),
        body('dueDate', `dueDate doesn't exists in body`).exists(),
        body('stage', `stage doesn't exists in body or not these values ${STAGE_KEYWORDS_V2}`).exists().isIn(STAGE_KEYWORDS_V2),
      ];
    }
  }
}
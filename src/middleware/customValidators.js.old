/**
 * Custom validators middleware.
 */

const constants = require('./constants');

/**
 * validator for the task PATCH route for v1.
 */
exports.validateTaskPatchV1 = (req, res, next) => {
  this.validateTaskPatch(constants.v1.stage, req, res, next);
}

/**
 * validator for the task PATCH route for v2
 */
exports.validateTaskPatchV2 = (req, res, next) => {
  this.validateTaskPatch(constants.v2.stage, req, res, next);
}

/**
 * validates the arguments in the patch route of task.
 * 
 * @param stages - array of stages. This varies if you are on v1 vs. v2 of the route.
 * @param req - request object
 * @param res - response object
 * @param next - next callback
 */
exports.validateTaskPatch = (stages, req, res, next) => {
  // List of valid keys we are checking against.
  const validKeys = {
    name: true,
    description: true,
    dueDate: true,
    stage: true,
  }

  // validation flag.
  let valid = true;

  // Check if body exist.
  if (!req.body || Object.keys(req.body).length == 0) {throw new Error(JSON.stringify({"message": "Body not specified"}))}
  
  // Check the body arguments
  for (let [bodyKey, bodyVal] of Object.entries(req.body)) {
    // Invalid key found, body is not valid.
    if (validKeys[bodyKey] === undefined) {
      valid = false;
    }
    
    // Check the validity of stage key.
    if (bodyKey === 'stage') {
      let validstage = false;
      //console.log(">>>>>>>>>>");
      for (let i = 0 ; i < stages.length ; i++) {
        console.log(">>>" + stages[i] + "|" + bodyVal);
        if (stages[i] == bodyVal) {
          validstage = true;
          break;
        };
      }
      if (!validstage) {
        throw new Error(`stage is not a legal value. These are the valid values ${stages}`);    
      }
    }
  };

  if (!valid) {
    throw new Error("Legal key not found");
  }

  // Run the next middleware if validations are good.
  next();
};
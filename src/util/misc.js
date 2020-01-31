/**
 * Some misc functions that did't really belong elsewhere.
 * Unused...
 */

/**
 * A simple error handler for the controller to DRY things.
 * Assumes error messages are either simple or in this format
 * 
 * {
 *  message: "Your error message"
 *  status: 404 
 * }
 * 
 * Takes the error objects and tries to return it in a consistent fashion.
 * 
 * @param err - Error object.
 * @param res - Response handler from express.
 */
exports.errorRender = (err, res) => {
  const errJSON = JSON.parse(err.message);
  if (errJSON.status) {res.status(errJSON.status)};
  res.json(errJSON);
}
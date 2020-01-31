/**
 * Some misc functions that did't really belong elsewhere.
 * Unused...
 */

/**
 * A simple error handler for the controller to DRY things.
 * 
 * Takes the error objects and tries to return it in a consistent fashion.
 * 
 * @param err Error object from catch block.
 * @param res Response handler from express.
 */
exports.errorDisp = (err, res) => {
  console.log("GOT HERE");
  console.log(err);
  const errJSON = JSON.parse(err.message);
  if (errJSON.statusCode) {res.status(errJSON.status)};
  res.json(errJSON);
}
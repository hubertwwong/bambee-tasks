const UserTaskModel = require('../models/userTaskModel');
const {errorRender} = require('../util/misc');

// Display list of all Tasks.
exports.taskList = (req, res) => {
  res.send('NOT IMPLEMENTED: Task list');
};

// Display detail page for a specific Task.
exports.taskDetail = (req, res) => {
  res.send('NOT IMPLEMENTED: Task detail: ' + req.params.id);
};

/**
 * Creates a task
 * 
 * TODO:
 * 1. check params.
 * 2. 
 */
exports.taskCreate = async (req, res) => {
  try {
    console.log("> task controller " + req.user);
    let task = await UserTaskModel.createTask(req.user.id, {
        name: req.body.name,
        description: req.body.description,
        dueDate: req.body.dueDate
      });
    res.send('NOT IMPLEMENTED: Task create POST');
  } catch(err) {
    console.log(">>> task controller catch block");
    errorRender(err, res);
  }
};

// Handle Task delete on POST.
exports.taskDelete = (req, res) => {
  res.send('NOT IMPLEMENTED: Task delete POST');
};

// Handle Task update on PUT.
exports.taskUpdatePut = (req, res) => {
  res.send('NOT IMPLEMENTED: Task update PUT');
};

// Handle Task update on PATCH.
exports.taskUpdatePatch = (req, res) => {
  res.send('NOT IMPLEMENTED: Task update PATCH');
};
const UserTaskModel = require('../models/userTaskModel');
const {errorRender} = require('../util/misc');

/**
 * Get a list of task by the user
 */
exports.taskList = async (req, res) => {
  try {
    let tasks = await UserTaskModel.getTasks(req.user.id);
    res.json(tasks);
  } catch(err) {
    errorRender(err, res);
  }
};

/**
 * Get a specific task by a user.
 */
exports.taskDetail = async (req, res) => {
  try {
    let task = await UserTaskModel.getTask(req.user.id, req.params.id);
    res.json(task);
  } catch(err) {
    errorRender(err, res);
  }
};

/**
 * Creates a new task.
 */
exports.taskCreate = async (req, res) => {
  try {
    let task = await UserTaskModel.createTask(req.user.id, {
        name: req.body.name,
        description: req.body.description,
        dueDate: req.body.dueDate
      });
    res.json({message: 'Task created'});
  } catch(err) {
    errorRender(err, res);
  }
};

// Handle Task delete on POST.
exports.taskDelete = async (req, res) => {
  res.send('NOT IMPLEMENTED: Task delete POST');
};

/**
 * Update a task.
 */
exports.taskUpdatePut = async (req, res) => {
  try {
    let tasks = await UserTaskModel.updateTask(req.user.id, req.params.id, req.body);
    res.json({"message": "Task updated"});
  } catch(err) {
    errorRender(err, res);
  }
};

// Handle Task update on PATCH.
exports.taskUpdatePatch = async (req, res) => {
  console.log(req.body);
  res.send('NOT IMPLEMENTED: Task update PATCH');
};
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
exports.taskCreate = (req, res) => {
  res.send('NOT IMPLEMENTED: Task create POST');
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
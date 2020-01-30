// Display list of all Tasks.
exports.task_list = function(req, res) {
  res.send('NOT IMPLEMENTED: Task list');
};

// Display detail page for a specific Task.
exports.task_detail = function(req, res) {
  res.send('NOT IMPLEMENTED: Task detail: ' + req.params.id);
};

// Handle Task create on POST.
exports.task_create_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Task create POST');
};

// Handle Task delete on POST.
exports.task_delete_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Task delete POST');
};

// Handle Task update on PUT.
exports.task_update_put = function(req, res) {
  res.send('NOT IMPLEMENTED: Task update PUT');
};

// Handle Task update on PATCH.
exports.task_update_patch = function(req, res) {
  res.send('NOT IMPLEMENTED: Task update PATCH');
};
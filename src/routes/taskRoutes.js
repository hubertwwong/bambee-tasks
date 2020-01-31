const express = require('express');
const router = express.Router();

const tasks = require('../controllers/tasksController');
const errors = require('../middleware/errors');
const val = require('../middleware/validate');

router.get('/', tasks.taskList);
router.get('/:id', tasks.taskDetail);
router.post('/', val.validate('createTask'), errors, tasks.taskCreate);
router.delete('/:id', tasks.taskDelete);
router.put('/:id', tasks.taskUpdatePut);
router.patch('/:id', tasks.taskUpdatePatch);

module.exports = router;
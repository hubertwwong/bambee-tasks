const express = require('express');
const router = express.Router();

const tasks = require('../controllers/tasksController');

router.get('/', tasks.taskList);
router.get('/:id', tasks.taskDetail);
router.post('/', tasks.taskCreate);
router.delete('/:id', tasks.taskDelete);
router.put('/:id', tasks.taskUpdatePut);
router.patch('/:id', tasks.taskUpdatePatch);

module.exports = router;
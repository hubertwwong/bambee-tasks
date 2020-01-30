const express = require('express');
const router = express.Router();

const tasks = require('../controllers/tasksController');

router.get('/', tasks.task_list);
router.get('/:id', tasks.task_detail);
router.post('/', tasks.task_create_post);
router.delete('/:id', tasks.task_delete_post);
router.put('/:id', tasks.task_update_put);
router.patch('/:id', tasks.task_update_patch);

module.exports = router;
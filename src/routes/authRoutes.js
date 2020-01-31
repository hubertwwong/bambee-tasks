const express = require('express');
const router = express.Router();

const auth = require('../controllers/authController');
const errors = require('../middleware/errors');
const val = require('../middleware/validate');

router.post('/login', val.validate('user'), errors, auth.authLogin);
router.post('/register', val.validate('user'), errors, auth.authRegister);

module.exports = router;
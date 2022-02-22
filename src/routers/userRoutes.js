const express = require('express'); 
const router = express.Router();

const usersController = require('../controllers/usersController.js');
const upload = require('../middlewares/img-users');
const validations = require('../middlewares/register-validator'); 

const validatorLogin=require('../middlewares/login-validator');

router.get('/', usersController.list); 
router.delete('/:id',usersController.delete );
router.get('/login',usersController.login); 
router.post('/login',validatorLogin, usersController.session);

router.get('/register',usersController.register);
router.post('/register', upload.single('image'), validations, usersController.store );

router.get('/:id', usersController.usuario);

router.get('/:id/edit', usersController.edition);
router.put('/:id/edit', upload.single('image'),usersController.update);

module.exports = router;
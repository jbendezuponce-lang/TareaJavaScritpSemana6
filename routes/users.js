const express = require('express');
const router = express.Router();
const usersController = require('../controllers/userController');
const { validateCreate, validateUpdate, validateId } = require('../middlewares/validation');

router.get('/', usersController.getUsers);
router.get('/:id', validateId, usersController.getUser);
router.post('/', validateCreate, usersController.createUser);
router.put('/:id', validateId, validateUpdate, usersController.updateUser);
router.delete('/:id', validateId, usersController.deleteUser);

module.exports = router;

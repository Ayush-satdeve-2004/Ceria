const express = require('express');
const {
  getUsers,
  toggleBlockUser,
  deleteUser
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All user management routes are protected and restricted to Admins
router.use(protect);
router.use(authorize('admin'));

router.get('/', getUsers);
router.put('/block/:id', toggleBlockUser);
router.delete('/:id', deleteUser);

module.exports = router;

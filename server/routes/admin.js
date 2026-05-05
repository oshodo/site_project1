// server/routes/admin.js
const express = require('express');
const router  = express.Router();
const {
  getDashboard, getAllUsers, updateUser, deleteUser,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes are doubly protected: JWT + admin role
router.use(protect, adminOnly);

router.get('/dashboard',    getDashboard);
router.get('/users',        getAllUsers);
router.put('/users/:id',    updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    getMyDoctors,
    getAssignedPatients
} = require('../Controllers/UserController');

router.post('/', createUser); // Create a new user
router.get('/', getUsers); // Get all users
router.get('/:id', getUserById); // Get user by ID
router.put('/:id', updateUser); // Update user by ID
router.delete('/:id', deleteUser); // Delete user by ID
router.get('/patient/my-doctors', auth, getMyDoctors);
router.get('/doctor/assigned', auth, getAssignedPatients);

module.exports = router;
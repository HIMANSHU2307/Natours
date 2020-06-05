const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); 

const { getAllUsers, addNewUser, getUser, updateUser, deleteUser } = userController;

router
    .route('/')
    .get(getAllUsers)
    .post(addNewUser)
router
    .route('/:id/:opt?')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser)  

module.exports = router;    

/* eslint-disable prettier/prettier */
const express = require('express');

const router = express.Router();
const tourController = require('../controllers/tourController'); 
// all the exports methods will be returned, tourController will be the object with all the returned methods
const { getAllTours, createTour, getTour, updateTour, deleteTour, aliasTopTours } = tourController;

// middleware for checking param
// router.param('id', checkId);

// ALIASING
router
    .route('/top-5-cheap')
    .get(aliasTopTours, getAllTours)  

router
    .route('/')
    .get(getAllTours)
    .post(createTour) 
    // first arrgument is to check the body of req weather the data is valid or not

router
    .route('/:id/:opt?')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour)

  

module.exports = router;   
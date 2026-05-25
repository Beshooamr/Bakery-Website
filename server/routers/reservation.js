const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservation');

router.post('/create', reservationController.createReservation);
router.get('/customer/:customerId', reservationController.getCustomerReservations);
router.get('/all', reservationController.getAllReservations);
router.put('/update/:id', reservationController.updateReservationStatus);

module.exports = router;

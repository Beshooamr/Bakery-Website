const Reservation = require('../models/reservation');
const User = require('../models/user');
const { ReservationService } = require('../services/reservationservice');

// IoC: the controller wires dependencies and passes them into the service.
const reservationService = new ReservationService(Reservation, User);

const createReservation = async (req, res) => {
  try {
    const newReservation = await reservationService.createReservation(req.body);
    res.status(201).json({ message: 'Reservation created successfully', reservation: newReservation });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const getCustomerReservations = async (req, res) => {
  try {
    const reservations = await reservationService.getCustomerReservations(req.params.customerId);
    res.status(200).json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getAllReservations = async (req, res) => {
  try {
    const reservations = await reservationService.getAllReservations();
    res.status(200).json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const updateReservationStatus = async (req, res) => {
  try {
    const reservation = await reservationService.updateReservationStatus(req.params.id, req.body.status);
    res.status(200).json({ message: 'Reservation status updated', reservation });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

module.exports = {
  createReservation,
  getCustomerReservations,
  getAllReservations,
  updateReservationStatus,
};

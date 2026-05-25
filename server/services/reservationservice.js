class ServiceError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

class ReservationService {
  constructor(ReservationModel, UserModel) {
    // Dependency Injection: the model is received from outside instead of imported directly.
    this.ReservationModel = ReservationModel;
    this.UserModel = UserModel;
  }

  async createReservation({
    customer,
    name,
    email,
    phone,
    date,
    time,
    partySize,
    specialRequests,
  }) {
    if (!name || !email || !date || !time || !partySize) {
      throw new ServiceError(400, 'Name, email, date, time, and partySize are required');
    }

    const reservationCustomer = customer || (await this.UserModel.findOne({ email }).select('_id'))?._id;

    return this.ReservationModel.create({
      customer: reservationCustomer,
      name,
      email,
      phone,
      date,
      time,
      partySize,
      specialRequests,
    });
  }

  async getCustomerReservations(customerId) {
    return this.ReservationModel.find({ customer: customerId });
  }

  async getAllReservations() {
    return this.ReservationModel.find({}).populate('customer', 'name email phone');
  }

  async updateReservationStatus(id, status) {
    if (!status) {
      throw new ServiceError(400, 'Status is required');
    }

    const reservation = await this.ReservationModel.findByIdAndUpdate(id, { status }, { new: true });

    if (!reservation) {
      throw new ServiceError(404, 'Reservation not found');
    }

    return reservation;
  }
}

module.exports = { ReservationService, ServiceError };

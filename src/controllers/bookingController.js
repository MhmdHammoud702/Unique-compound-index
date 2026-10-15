const bookingService = require("../services/bookingService");

async function getBookingsController(req, res) {
  const result = await bookingService.getBookings();
  res.status(result.statusCode).json(result.payload);
}

async function addBookingController(req, res) {
  const result = await bookingService.addBooking(req.body);
  res.status(result.statusCode).json(result.payload);
}

module.exports = { getBookingsController, addBookingController };

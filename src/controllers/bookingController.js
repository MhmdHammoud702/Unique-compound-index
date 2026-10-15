const bookingService = require("../services/bookingService");

async function getBookingsController(req, res) {
  const bookings = await bookingService.getBookings();
  res.json({ data: bookings });
}

async function addBookingController(req, res) {
  const booking = await bookingService.addBooking(req.body);
  res.status(201).json({ data: booking });
}

module.exports = { getBookingsController, addBookingController };

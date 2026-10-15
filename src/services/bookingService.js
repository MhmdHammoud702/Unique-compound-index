const Booking = require("../models/Booking");

async function getBookings() {
  try {
    return await Booking.find().sort({ bookingDate: 1 }).lean();
  } catch (error) {
    const serviceError = new Error("Could not load bookings.");
    serviceError.statusCode = 500;
    serviceError.cause = error;
    throw serviceError;
  }
}

async function addBooking({ roomId, userId, bookingDate }) {
  try {
    return await Booking.create({ roomId, userId, bookingDate });
  } catch (error) {
    if (error.code === 11000) {
      const conflict = new Error("Room is already booked for that time slot.");
      conflict.statusCode = 409;
      conflict.code = "E11000";
      throw conflict;
    }

    if (error.name === "ValidationError") {
      error.statusCode = 400;
    }

    throw error;
  }
}

module.exports = { getBookings, addBooking };

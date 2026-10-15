const Booking = require("../models/Booking");

async function getBookings() {
  try {
    const bookings = await Booking.find().sort({ bookingDate: 1 }).lean();
    return { statusCode: 200, payload: { data: bookings } };
  } catch (error) {
    console.error("Could not load bookings:", error);
    return {
      statusCode: 500,
      payload: { message: "Could not load bookings." },
    };
  }
}

async function addBooking({ roomId, userId, bookingDate }) {
  try {
    const booking = await Booking.create({ roomId, userId, bookingDate });
    return { statusCode: 201, payload: { data: booking } };
  } catch (error) {
    if (error.code === 11000) {
      return {
        statusCode: 409,
        payload: {
          code: "E11000",
          message: "Room is already booked for that time slot.",
        },
      };
    }

    if (error.name === "ValidationError") {
      return {
        statusCode: 400,
        payload: { message: error.message },
      };
    }

    console.error("Could not create booking:", error);
    return {
      statusCode: 500,
      payload: { message: "Could not create booking." },
    };
  }
}

module.exports = { getBookings, addBooking };

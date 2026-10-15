const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    bookingDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

bookingSchema.index(
  { roomId: 1, bookingDate: 1 },
  { unique: true, name: "unique_room_booking_date" }
);

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;

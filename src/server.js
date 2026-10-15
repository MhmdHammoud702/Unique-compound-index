const mongoose = require("mongoose");
const express = require("express");
const { connectDatabase } = require("./config/database");
const Booking = require("./models/Booking");
const bookingRoutes = require("./routes/bookingRoutes");
const { startConcurrentBookingJob } = require("./jobs/concurrentBookingJob");
require("dotenv").config();

const TEST_BOOKING_DATE = new Date("2026-10-15T11:00:00.000Z");

async function startServer() {
  const uri =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/booking_api";
  const databaseUrl = new URL(uri);
  databaseUrl.pathname = `/booking_demo_${Date.now()}`;

  await connectDatabase(databaseUrl.toString());
  await Booking.init();

  const app = express();
  app.use(express.json());
  app.use("/api/bookings", bookingRoutes);

  const roomId = "room-101";

  const port = Number(process.env.PORT || 3000);
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);

    startConcurrentBookingJob({
      baseUrl: `http://127.0.0.1:${port}`,
      userIds: ["Mohammad", "Elie"],
      booking: {
        roomId,
        bookingDate: TEST_BOOKING_DATE,
      },
    })
      .then(async (results) => {
        console.log("Concurrent booking responses:");
        console.log(JSON.stringify(results, null, 2));

        const count = await Booking.countDocuments({
          roomId,
          bookingDate: TEST_BOOKING_DATE,
        });
        console.log(`Bookings for Room 101 at 11:00 AM: ${count}`);

        const successCount = results.filter((result) => result.status === 201).length;
        const duplicateCount = results.filter(
          (result) => result.status === 409 && result.body.code === "E11000"
        ).length;
        if (count !== 1 || successCount !== 1 || duplicateCount !== 1) {
          console.error("Expected one successful booking and one duplicate-key error.");
        }
      })
      .catch((error) => {
        console.error("Concurrent booking test failed:", error);
      });
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});

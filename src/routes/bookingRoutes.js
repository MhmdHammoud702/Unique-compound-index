const express = require("express");
const {
  getBookingsController,
  addBookingController,
} = require("../controllers/bookingController");

const router = express.Router();

router.get("/", getBookingsController);
router.post("/", addBookingController);

module.exports = router;

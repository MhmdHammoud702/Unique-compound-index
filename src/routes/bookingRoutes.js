const express = require("express");
const {
  getBookingsController,
  addBookingController,
} = require("../controllers/bookingController");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

router.get("/", asyncHandler(getBookingsController));
router.post("/", asyncHandler(addBookingController));

module.exports = router;

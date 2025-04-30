const express = require("express");
const router = express.Router();
const doctorController = require("../controller/doctorController");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

router.get(
  "/doctor/general",
  authenticateToken,
  authorizeRoles(["Doctor"]),
  doctorController.getGeneralStats
);

router.get(
  "/doctor/appointments",
  authenticateToken,
  authorizeRoles(["Doctor"]),
  doctorController.getAppointmentAnalytics
);

router.get(
  "/doctor/patients",
  authenticateToken,
  authorizeRoles(["Doctor"]),
  doctorController.getPatientInsights
);

module.exports = router;

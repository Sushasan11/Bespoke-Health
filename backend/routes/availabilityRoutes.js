const express = require("express");
const router = express.Router();
const availabilityController = require("../controller/availabilityController");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");
const doctorController = require("../controller/doctorController");


router.post(
  "/set",
  authenticateToken,
  authorizeRoles(["Doctor"]),
  availabilityController.setDoctorAvailability
);

router.post(
  "/fees",
  authenticateToken,
  authorizeRoles(["Doctor"]),
  availabilityController.setConsultationFees
);


router.get(
  "/me",
  authenticateToken,
  authorizeRoles(["Doctor"]),
  availabilityController.getOwnAvailability
);

router.get(
  "/fees",
  authenticateToken,
  authorizeRoles(["Doctor"]),
  availabilityController.getOwnConsultationFees
);
router.get(
  "/stats",
  authenticateToken,
  authorizeRoles(["Doctor"]),
  doctorController.getGeneralStats
);


router.get(
  "/doctors/:doctorId/availability",
  availabilityController.getDoctorAvailability
);

router.get(
  "/doctors/:doctorId/fees",
  availabilityController.getConsultationFees
);

module.exports = router;

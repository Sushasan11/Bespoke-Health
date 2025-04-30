const express = require("express");
const router = express.Router();
const analyticsController = require("../controller/analyticsController");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");


router.use(authenticateToken);
router.use(authorizeRoles(["Admin"]));


router.get("/overview", analyticsController.getAnalyticsOverview);


router.get("/users", analyticsController.getUserAnalytics);


router.get("/doctors", analyticsController.getDoctorAnalytics);


router.get("/patients", analyticsController.getPatientAnalytics);


router.get("/appointments", analyticsController.getAppointmentAnalytics);


router.get("/revenue", analyticsController.getRevenueAnalytics);

module.exports = router;
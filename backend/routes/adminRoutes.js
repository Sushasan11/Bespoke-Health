const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRoles } = require("../middleware/auth");
const adminPatientController = require("../controller/adminPatientController");
const adminDoctorController = require("../controller/adminDoctorController");
const adminPaymentController = require("../controller/adminPaymentController");


router.use(authenticateToken);
router.use(authorizeRoles(["Admin"]));


router.get("/patients", adminPatientController.getAllPatients);
router.get("/patients/:id", adminPatientController.getPatientDetails);
router.put("/patients/:id", adminPatientController.updatePatient);
router.delete("/patients/:id", adminPatientController.deletePatient);
router.post("/patients/:id/email", adminPatientController.sendEmailToPatient);


router.get("/doctors", adminDoctorController.getAllDoctors);
router.get("/doctors/:id", adminDoctorController.getDoctorDetails);
router.put("/doctors/:id/status", adminDoctorController.updateDoctorStatus);

router.post("/doctors/:id/email", adminDoctorController.sendEmailToDoctor);


router.get("/payments", adminPaymentController.getAllPayments);
router.get("/payments/:id", adminPaymentController.getPaymentDetails);
router.post("/payments/:id/refund", adminPaymentController.processRefund);
router.post("/payments/report", adminPaymentController.generatePaymentReport);

module.exports = router;

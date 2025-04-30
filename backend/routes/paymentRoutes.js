const express = require("express");
const router = express.Router();
const paymentController = require("../controller/paymentController");
const { authenticateToken } = require("../middleware/auth");


router.post(
  "/:paymentId/process",
  authenticateToken,
  paymentController.processPayment
);


router.post(
  "/:paymentId/khalti/initiate",
  authenticateToken,
  paymentController.initiateKhaltiPayment
);


router.post(
  "/khalti/verify",
  paymentController.verifyKhaltiPayment
);

router.get(
  "/:paymentId",
  authenticateToken,
  paymentController.getPaymentDetails
);

module.exports = router;

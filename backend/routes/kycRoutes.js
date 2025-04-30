const express = require("express");
const router = express.Router();
const kycController = require("../controller/kycController");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");
const { uploadKYC } = require("../utils/fileUpload");


router.post(
  "/submit",
  authenticateToken,
  uploadKYC.fields([
    { name: "citizenship_front", maxCount: 1 },
    { name: "citizenship_back", maxCount: 1 },
  ]),
  kycController.submitKYC
);

router.get("/status", authenticateToken, kycController.getKYCStatus);


router.get(
  "/review",
  authenticateToken,
  authorizeRoles(["Admin"]),
  kycController.getKYCsForReview
);

router.put(
  "/review/:kycId",
  authenticateToken,
  authorizeRoles(["Admin"]),
  kycController.reviewKYC
);



module.exports = router;

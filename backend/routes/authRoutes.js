const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const { authenticateToken } = require("../middleware/auth");
const { uploadCV } = require("../utils/fileUpload");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const {
  sendVerificationEmail,
  sendForgotPasswordEmail,
} = require("../utils/email");
const { generateOTP, verifyOTP } = require("../utils/otp");

const prisma = new PrismaClient();

router.post("/signup", uploadCV.single("cv"), authController.signup);
router.post("/login", authController.login);
router.post("/verify-email", authController.verifyEmail);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.changePassword);


router.get("/profile", authenticateToken, authController.getProfile);

module.exports = router;

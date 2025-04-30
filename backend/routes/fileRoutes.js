const express = require("express");
const router = express.Router();
const path = require("path");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");


router.get("/:type/:filename", (req, res) => {
  const { type, filename } = req.params;

  
  if (!["kyc", "cv", "medicines", "chat"].includes(type)) {
    return res.status(404).send("File not found");
  }

  const filePath = path.join(__dirname, "../uploads", type, filename);
  res.sendFile(filePath);
});

module.exports = router;

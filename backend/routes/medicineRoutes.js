const express = require("express");
const router = express.Router();
const medicineController = require("../controller/medicineController");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");
const { uploadMedicineImage } = require("../utils/fileUpload");

router.get("/", medicineController.getAllMedicines);
router.get("/categories", medicineController.getMedicineCategories);
router.get("/:id", medicineController.getMedicineById);

router.post(
  "/add",
  authenticateToken,
  authorizeRoles(["Admin"]),
  uploadMedicineImage.single("image"),
  medicineController.addMedicine
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles(["Admin"]),
  uploadMedicineImage.single("image"),
  medicineController.updateMedicine
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles(["Admin"]),
  medicineController.deleteMedicine
);

router.get(
  "/admin/all",
  authenticateToken,
  authorizeRoles(["Admin"]),
  medicineController.getAdminMedicines
);

module.exports = router;

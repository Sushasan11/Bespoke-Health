const express = require('express');
const router = express.Router();
const diseaseController = require('../controller/diseaseController');
const { authenticateToken } = require('../middleware/auth');

router.get('/symptoms', diseaseController.getAllSymptoms);
router.post('/predict', authenticateToken, diseaseController.predictDiseaseAPI);
router.post('/predict-anonymous', diseaseController.predictDiseaseAPI);
module.exports = router;
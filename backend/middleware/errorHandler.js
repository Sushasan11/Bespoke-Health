const multer = require('multer');

const handleFileUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        error: "File size too large. Maximum file size allowed: 5MB for KYC documents and 10MB for CV." 
      });
    }
    return res.status(400).json({ error: `File upload error: ${err.message}` });
  }
  
  if (err.message.includes('Invalid file type')) {
    return res.status(400).json({ error: err.message });
  }
  
  next(err);
};

module.exports = { handleFileUploadErrors };
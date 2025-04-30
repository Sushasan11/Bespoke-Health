const multer = require('multer');
const path = require('path');
const fs = require('fs');


const uploadsDir = path.join(__dirname, '../uploads');
const kycDir = path.join(uploadsDir, 'kyc');
const cvDir = path.join(uploadsDir, 'cv');
const medicineDir = path.join(uploadsDir, 'medicines'); 
const chatDir = path.join(uploadsDir, 'chat');


[uploadsDir, kycDir, cvDir, medicineDir, chatDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const chatStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, chatDir);
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    cb(null, `chat_${Date.now()}${fileExt}`);
  }
});

const chatFileFilter = (req, file, cb) => {
  const allowedFileTypes = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedFileTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, PDFs, and documents are allowed.'), false);
  }
};

const medicineStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, medicineDir);
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    cb(null, `medicine_${Date.now()}${fileExt}`);
  }
});
const kycStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, kycDir);
  },
  filename: (req, file, cb) => {
    const userId = req.user.id;
    const documentType = file.fieldname; 
    const fileExt = path.extname(file.originalname);
    cb(null, `${userId}_${documentType}_${Date.now()}${fileExt}`);
  }
});

const cvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, cvDir);
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    cb(null, `cv_${Date.now()}${fileExt}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['.jpg', '.jpeg', '.png', '.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedFileTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, JPEG, PNG and PDF files are allowed.'), false);
  }
};
const uploadChatAttachment = multer({
  storage: chatStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, 
  },
  fileFilter: chatFileFilter
});


const uploadKYC = multer({
  storage: kycStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, 
  },
  fileFilter
});

const uploadCV = multer({
  storage: cvStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, 
  },
  fileFilter
});

const uploadMedicineImage = multer({
  storage: medicineStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, 
  },
  fileFilter
});
module.exports = {
  uploadKYC,
  uploadCV,
  uploadMedicineImage,
  uploadChatAttachment
};
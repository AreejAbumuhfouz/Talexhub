const multer  = require('multer');
const multerS3= require('multer-s3');
const { v4: uuidv4 } = require('uuid');
const { s3, BUCKET } = require('../config/storage');

const cvUpload = multer({
  storage: multerS3({
    s3, bucket: BUCKET,
    key: (_req, file, cb) => cb(null, `cvs/${uuidv4()}-${Date.now()}`),
  }),
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE_MB || 10) * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = (process.env.ALLOWED_CV_TYPES || '').split(',');
    if (allowed.includes(file.mimetype)) return cb(null, true);
    cb(new Error('Only PDF and DOCX files are allowed'));
  },
});

const imageUpload = multer({
  storage: multerS3({
    s3, bucket: BUCKET,
    key: (_req, file, cb) => cb(null, `images/${uuidv4()}-${Date.now()}`),
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = (process.env.ALLOWED_IMAGE_TYPES || '').split(',');
    if (allowed.includes(file.mimetype)) return cb(null, true);
    cb(new Error('Only JPEG, PNG and WebP images are allowed'));
  },
});

module.exports = { cvUpload, imageUpload };

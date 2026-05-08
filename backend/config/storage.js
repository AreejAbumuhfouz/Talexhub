const { S3Client } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  endpoint:        process.env.STORAGE_ENDPOINT,
  region:          process.env.STORAGE_REGION || 'us-east-1',
  credentials: {
    accessKeyId:     process.env.STORAGE_ACCESS_KEY,
    secretAccessKey: process.env.STORAGE_SECRET_KEY,
  },
  forcePathStyle: true,
});

module.exports = { s3, BUCKET: process.env.STORAGE_BUCKET };

// config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: 'dcgdg9ths',
  api_key: '775155217447482',
  api_secret: '_C2Sgsp89a4g3vFteDANAiw_vnk',
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ProConnect', // Folder name in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg','webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

module.exports = {
  cloudinary,
  storage,
};

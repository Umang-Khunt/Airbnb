const cloudinary= require("cloudinary").v2;
const {CloudinaryStorage} = require("multer-storage-cloudinary");
require("dotenv").config();


    cloudinary.config({
        cloud_name:process.env.CLOUDE_NAME,
        api_key:process.env.CLODE_API_KEY,
        api_secret:process.env.CLODE_API_SECRETE
    });

    const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'marihotel_dev',
    allowedFormat:['png','jpg','jpeg'], 
  },
});

module.exports= {
    cloudinary,
    storage
};
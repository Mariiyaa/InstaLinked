const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../CloudinaryConfig')

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'your-folder-name', // Specify the folder where files should be stored
    allowed_formats: ['jpg', 'png', 'jpeg','mp4','pdf'],
    resource_type: 'auto', // Allowed file formats
  },
});
const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true); // Accept video files
      console.log(file.mimetype); 
    } else if (file.mimetype.startsWith('image/')) {
      cb(null, true); // Accept image files
    } else {
      cb(new Error('Invalid file type! Only images and videos are allowed.'));
    }
  }, });

const createProfile = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Request File:", req.file); 
    const { fullname,bio, externalLinks } = req.body;
    const email="mariyaa.d6@gmail.com"
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const profileImagePath = req.file ? req.file.path : null;
    const profileImageRelativePath = req.file.path.replace(/\\/g, "/"); 
    if (!fullname || !bio || !externalLinks || !profileImagePath) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find the user by email
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user details
    existingUser.fullName=fullname;
    existingUser.profileImage = profileImageRelativePath;
    existingUser.bio = bio;
    existingUser.externalLinks = JSON.parse(externalLinks);

    // Save the updated user
    await existingUser.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: existingUser,
    });
  } catch (error) {
    console.error("Error creating/updating profile:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

const displayProfile = async(req,res) => {
    const email="mariyaa.d6@gmail.com"
    const existingUser = await User.findOne({ email });
    console.log(existingUser)
    if(existingUser) {
      res.json(existingUser)

    }

}


module.exports = {
  createProfile,
  upload,
  displayProfile 
};

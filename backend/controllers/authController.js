const User = require('../models/User');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const speakeasy = require('speakeasy');
const admin = require('../firebase');
require('dotenv').config();

// Function to verify Firebase token
const verifyFirebaseToken = async (token) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    throw new Error('Invalid Firebase token');
  }
};




// Register User
const register = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    // Validate inputs
    if (!email || !password || password !== confirmPassword) {
      return res.status(400).json({ message: 'Please provide email, password, and ensure passwords match.' });
    }
console.log(email,password)
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    // Hash password and save user
    
    const newUser = new User({
      email,
      // password: hashedPassword,
    });

    // Generate OTP using Speakeasy
    const otp = speakeasy.totp({
      secret: process.env.OTP_SECRET,
      encoding: 'base32',
      step: 300
    });

    console.log('Generated OTP:', otp); 

    //newUser.email=email;// Save the OTP temporarily or with the user (in production, save securely)
    newUser.otp = otp; // You might want to use a separate collection or temporary store in production
    await newUser.save().then(
      console.log("doneee")
    );

    // Respond to the user immediately
    res.status(201).json({ message: 'User registered successfully. Confirmation and verification emails sent.' });


    var message = `Thank you for signing up! Begin your journey with Instalinked.`;
    await sendEmail(newUser.email, 'Welcome to Instalinked!', message);

    var message = `Your verification code is ${otp}.`;
    await sendEmail(newUser.email, 'otp verification Request', message);
  

  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};





const resendOtp= async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const otp = speakeasy.totp({
      secret: process.env.OTP_SECRET || 'your-secret-key', // Use a secure secret key
      encoding: 'base32',
      step: 300 // Time step in seconds (5 minutes)
    });
    
    const message = `Your new verification code is ${otp}.`;
    await sendEmail(user.email, 'otp verification resend Request', message);
   

    res.status(200).json({ message: 'New OTP sent successfully.' });
  } catch (err) {
    console.error('Error resending OTP:', err);
    res.status(500).json({ message: 'Error resending OTP. Please try again.' });
  }
}



const verifyUser=async (req, res) => {
  try {
    const {Password,email,otp } = req.body;

    // Validate inputs
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required.' });
    }

    // Find the user by email
    const user = await User.findOne({ otp });
    if (!user) {
      const useremail = await User.deleteOne({ email});
      if(useremail){
        console.log("deleteddd")
      }
      return res.status(400).json({ message: 'User not found.' });
      

    }
    else {
      console.log("sucessss")
      console.log("Password:", Password,email,otp);

      const hashedPassword = await bcrypt.hash(Password, 10);
      
      user.otp=undefined
      user.password=hashedPassword
      console.log("passssssssssssssssss",user.password,hashedPassword)
      await user.save();
    }
    console.log('Received OTP:', otp)
    res.status(200).json({ message: 'OTP verified successfully. Your account is now active.' });
    
  } catch (error) {
    console.error('Error during OTP verification:', error.message);
    res.status(500).json({ error });
  }
}




// Login User
const login = async (req, res) => {
  const { emailOrPhone, password } = req.body;
  console.log(emailOrPhone, password);

  try {
    let user;
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrPhone);
    const isPhone = /^\d{9}$/.test(emailOrPhone);

    if (isEmail) {
      user = await User.findOne({ email: emailOrPhone });
    } else if (isPhone) {
      user = await User.findOne({ phone: emailOrPhone });
    } else {
      return res.status(400).json({ message: 'Invalid email or phone number format' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_whatSECRET, { expiresIn: '1h' });

    res.json({
      token,
      user: {
        userId: user._id,
        fullname: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        profileImage: user.profileImage || "",
        bio: user.bio || "",
        dateOfBirth: user.dateOfBirth || "",
        gender: user.gender || "",
        location: user.location || "",
        occupation: user.occupation || "",
        personas: user.persona || "",
        contentPreferences: user.contentPreferences || "",
        externalLinks: user.externalLinks || [],
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};




const loginWithGoogle = async (req, res) => {
  const { firebaseToken } = req.body;
  console.log(firebaseToken);

  try {
    if (!firebaseToken) return res.status(400).json({ message: 'Firebase token is required' });
    const decodedFirebaseToken = await verifyFirebaseToken(firebaseToken);
    console.log(decodedFirebaseToken)
    let user = await User.findOne({ email: decodedFirebaseToken.email });

    if (!user) {
      user = new User({ email: decodedFirebaseToken.email, password: null });
      await user.save();
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      user: {
        userId: user._id,
        fullname: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        profileImage: user.profileImage || "",
        bio: user.bio || "",
        dateOfBirth: user.dateOfBirth || "",
        gender: user.gender || "",
        location: user.location || "",
        occupation: user.occupation || "",
        personas: user.persona || "",
        contentPreferences: user.contentPreferences || "",
        externalLinks: user.externalLinks || [],
      },
    });
  } catch (error) {
    console.error('LoginWithGoogle Error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};




// Request Password Reset
const resetPasswordRequest = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
    const message = `You requested a password reset. Click the link to reset your password: ${resetUrl}`;
    await sendEmail(user.email, 'Password Reset Request', message);

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Reset Password Request Error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};




// Reset Password
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      _id: decoded.userId,
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user password and clear reset token
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  register,
  login,
  loginWithGoogle,
  verifyUser,
  resendOtp,
  resetPasswordRequest,
  resetPassword,
};

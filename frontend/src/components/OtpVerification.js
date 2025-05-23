import React, { useState } from 'react';
import { useNavigate,useLocation } from 'react-router-dom'; // For redirection
import axios from 'axios'
const OtpVerification = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const location = useLocation();
  const Password = location.state?.Password;
  console.log(Password)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/verify-otp', 
        { Password,email,otp },
      );
    
      setMessage(response.data.message);
      console.log(message)
        navigate('/your-name',{ state:{email} });
    
    } catch (error) {
      setMessage(error.response?.data?.message||'Error verifying OTP. Please try again.');
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await axios.post('/api/auth/resend-otp', { email });
  
      // Check if the response status is 200
      if (response.status === 200) {
        setMessage(response.data.message); // Set the message from the response
      } else {
        // Handle other status codes if needed
        setMessage('Unexpected response from the server.');
      }
    } catch (error) {
      // Handle errors (network errors, server errors, etc.)
      setMessage(error.response?.data?.message || 'Error resending OTP. Please try again.');
    }
  };

  return (
    <div>
      <h2>OTP Verification</h2>
      <form>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button type="submit" onClick={handleSubmit}>Verify OTP</button>
      </form>
      {message && <p>{message}</p>}
      <button onClick={handleResendOtp}>Resend OTP</button>
    </div>
  );
};

export default OtpVerification;

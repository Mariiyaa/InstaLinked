import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../style/login.css";

import { auth } from "../firebaseConfig"; 
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const Login = () => {
  const [emailOrPhone, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();


//validation
  const isValidEmail = (input) => {
    const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email.test(input);
  };

  const isValidPhoneNumber = (input) => {
    const phone = /^\d{9}$/; 
    return phone.test(input);
  };


  // Handle Email/Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!isValidEmail(emailOrPhone) && !isValidPhoneNumber(emailOrPhone)) {
      setErrorMessage("Please enter a valid email or phone number.");
      return;
    }
    try {
      
      const response = await axios.post("/api/auth/login", { emailOrPhone, password });
      console.log("Token:", response.data.token);
      navigate("/Home");
    } catch (error) {
      setErrorMessage("Invalid credentials ");
      console.error(error);
    }
  };

  // Handle Google Login
  const handleGoogleLogin = async () => {
    setErrorMessage(""); 
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken(); 

      console.log("Google Login ID Token:", idToken);
      const response = await axios.post("/api/auth/login-google", { firebaseToken: idToken });
      console.log(response.data.name)
      navigate("/Home",{state:response.data.name});
    } catch (error) {
      console.error(error);
      setErrorMessage("Google login failed.")
    }
  };

  return (
   <div className="login-page">
    {errorMessage && ( 
        <h3 class="error">{errorMessage}</h3>
      )}
    <div className="login-container">
      <div>
      <form onSubmit={handleLogin} className="login-form">
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Email or Phone "
          value={emailOrPhone}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        <a href="/reset-password-request" className="forgot-password">
          Forgot Password?
        </a>
      </form>
      </div>

      <div className="google-login">
        <button onClick={handleGoogleLogin} className="google-login-btn">
          <img
            src="googleicon.png"
            alt="Google Logo"
            className="google-logo"
          />
          Log in with Google
        </button>
      </div>
    </div>
    </div>
  );
};

export default Login;

import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../firebaseConfig"; 
import bookshelves from "../assets/bookshelves-amico.png"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Footer from "./Footer";

const Login = () => {
  const [emailOrPhone, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Validation Functions
  const isValidEmail = (input) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
  const isValidPhoneNumber = (input) => /^\d{9}$/.test(input);

  // Function to Store User in sessionStorage
  const saveUserTosessionStorage = (userData) => {
    if (userData) {
      sessionStorage.clear(); // Clear previous data to allow multiple users
      sessionStorage.setItem("user", JSON.stringify(userData));
    } else {
      console.error("userData is undefined or null");
    }
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
      console.log("Token:", response.data);

      saveUserTosessionStorage(response.data.user); // Store user in sessionStorage

      navigate("/Home");
    } catch (error) {
      setErrorMessage("Invalid credentials");
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
      
      saveUserTosessionStorage(response.data.user); // Store user in sessionStorage
      const user = JSON.parse(sessionStorage.getItem("user"));
      console.log(user)
      navigate("/Home", { state: response.data.name });
    } catch (error) {
      console.error(error);
      setErrorMessage("Google login failed.");
    }
  };

  return (
    <PageWrapper>
      <Main>
        <Placeholder src={bookshelves}/>
        <FormWrapper>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <Title>Login</Title>
          <Subtitle>Welcome Back!</Subtitle>
          <Form onSubmit={handleLogin}>
            <Input
              type="text"
              name="email"
              placeholder="Enter Email "
              value={emailOrPhone}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <SubmitButton type="submit">Login</SubmitButton>
            <a href="/reset-password-request" className="forgot-password">
              Forgot Password?
            </a>
            <Separator>
              <SeparatorText>or login with</SeparatorText>
            </Separator>
            <OAuthButtons>
              <GoogleButton onClick={handleGoogleLogin}>
                <GoogleLogo src="googleicon.png" alt="Google Logo" />
                Login with Google
              </GoogleButton>
              {/* <FacebookButton>
                <GoogleLogo src="facebookicon.png" alt="Google Logo" />
                Login with Facebook
                </FacebookButton> */}
            </OAuthButtons>
          </Form>
          <LoginLink>
  Don't have an account? <span onClick={() => navigate('/')}>Sign up</span>
</LoginLink>
        </FormWrapper>
      </Main>
      <Footer />
    </PageWrapper>
  );
};

export default Login;

// Styled Components
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f4f2ee;
`;

const Main = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  padding: 20px;
  width: 100%;
  
  /* Stack components vertically on mobile */
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 15px;
  }
  
  /* More spacing on larger screens */
  @media (min-width: 1200px) {
    justify-content: space-evenly;
    padding: 50px;
  }
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  
  /* Hide image on very small screens */
  @media (max-width: 480px) {
    display: none;
  }
`;

const Placeholder = styled.img`
  width: 400px;
  height: auto;
  max-width: 100%;
  border-radius: 10px;
  
  /* Adjust size for different screens */
  @media (max-width: 992px) {
    width: 350px;
  }
  
  @media (max-width: 768px) {
    width: 300px;
  }
`;

const FormWrapper = styled.div`
  width: 100%;
  max-width: 500px;
  padding: 30px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  
  /* Adjust padding for smaller screens */
  @media (max-width: 768px) {
    padding: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 15px;
    max-width: 100%;
  }
`;

const Title = styled.h2`
  margin-bottom: 25px;
  text-align: center;
  font-size: 24px;
  color: #000000;
  font-weight: bold;
  
  @media (max-width: 480px) {
    font-size: 20px;
    margin-bottom: 15px;
  }
`;

const Subtitle = styled.p`
  text-align: center;
  margin-bottom: 10px;
  color: #000000;
  font-weight: bold;
  
  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 10px;
  
  @media (max-width: 480px) {
    gap: 10px;
  }
`;

const Input = styled.input`
  margin-bottom: 10px;
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  font-size: 16px;
  border-radius: 5px;
  transition: border-color 0.2s;

  &:focus {
    border-color: #006d77;
  }
  
  @media (max-width: 480px) {
    padding: 10px;
    font-size: 14px;
    margin-bottom: 5px;
  }
`;

const ForgotPassword = styled.a`
  text-align: right;
  color: #006d77;
  font-size: 14px;
  text-decoration: none;
  margin-top: -5px;
  
  &:hover {
    text-decoration: underline;
  }
  
  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const LoginLink = styled.div`
  margin-top: 15px;
  font-size: 14px;
  text-align: center;
  color: #555;

  span {
    color: #006d77;
    font-weight: bold;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 12px;
    margin-top: 10px;
  }
`;

const SubmitButton = styled.button`
  padding: 12px;
  font-size: 16px;
  color: #fff;
  background-color: #006d77;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #004d55;
  }
  
  @media (max-width: 480px) {
    padding: 10px;
    font-size: 14px;
  }
`;

const OAuthButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const GoogleButton = styled.button`
  padding: 10px;
  background: white;
  border: 1px solid #ddd;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  font-size: 14px;
  
  @media (max-width: 480px) {
    padding: 8px;
    font-size: 12px;
  }
`;

const FacebookButton = styled.button`
  padding: 10px;
  background: white;
  border: 1px solid #ddd;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 480px) {
    padding: 8px;
    font-size: 12px;
  }
`;

const GoogleLogo = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 10px;
  
  @media (max-width: 480px) {
    width: 16px;
    height: 16px;
    margin-right: 8px;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 10px;
  text-align: center;
  font-size: 14px;
  
  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const Separator = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 5px 0;
  
  &::before,
  &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid #ccc;
    margin: 0 10px;
  }
`;

const SeparatorText = styled.span`
  font-size: 14px;
  color: #555;
  font-weight: 500;
  
  @media (max-width: 480px) {
    font-size: 12px;
  }
`;
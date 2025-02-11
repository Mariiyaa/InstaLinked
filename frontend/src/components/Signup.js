import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from "../firebaseConfig"; 
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Footer from './Footer';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await axios.post('/api/auth/signup', { email, password, confirmPassword });

      setSuccess('Signup successful! Please check your email for the verification code.');
      navigate("/verify-otp", { state: { Password: formData.confirmPassword } });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
 
  };
  const handleGoogleSignup = async () => {
    setError(""); 
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken(); 

      console.log("Google Login ID Token:", idToken);
      const response = await axios.post("/api/auth/login-google", { firebaseToken: idToken });
      console.log(response.data.name)
      navigate("/your-name",{state:response.data.name});
    } catch (error) {
      console.error(error);
      setError("Google login failed.")
    }
  };

  return (
    <>

      <PageWrapper>
        <Main>
          <Placeholder />
          <FormWrapper>
            <Title>Sign up</Title>
            <Subtitle>Welcome</Subtitle>
            <Form onSubmit={handleSubmit}>
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
               <Input
                type="password"
                name="confirmPassword"
                placeholder="confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />

              {error && <ErrorMessage>{error}</ErrorMessage>}
              {success && <SuccessMessage>{success}</SuccessMessage>}

              <CheckboxWrapper>
                <Checkbox type="checkbox" id="terms" required />
                <CheckboxLabel htmlFor="terms">By signing up, I agree with the Terms of Use & Privacy Policy</CheckboxLabel>
              </CheckboxWrapper>

              <SubmitButton type="submit">Sign up</SubmitButton>
              <Separator><SeparatorText>Or sign up with</SeparatorText></Separator>
              <OAuthButtons>
              <GoogleButton onClick={handleGoogleSignup} >
          <GoogleLogo
            src="googleicon.png"
            alt="Google Logo"

          />
          sign up with Google
        </GoogleButton>
        <FacebookButton>
                <GoogleLogo src="facebookicon.png" alt="Google Logo" />
                sign up with Facebook
                </FacebookButton>
              </OAuthButtons>

              
            </Form>
            <SignupLink>Returning user? <Link to="/login"><LoginLink>Login here</LoginLink></Link></SignupLink>
          </FormWrapper>
          
        </Main>
        <Footer/>
      </PageWrapper>
    </>
  );
};

export default Signup;

// Styled Components

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f8f9fa;
`;

const Main = styled.main`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-grow: 1;
  padding: 50px;
`;

const Placeholder = styled.div`
  width: 500px;
  height: 300px;
  background: #e0e0e0;
  border-radius: 10px;
`;

const FormWrapper = styled.div`
width: 500px;
  padding: 30px 60px;
  background: #fff;
  justify-self: center;
  align-self: center;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  font-size: 24px;
  margin-bottom:10px;
  color: #333;
`;

const Subtitle = styled.p`
  text-align: center;
  margin-bottom:10px;
  color: #666;
`;

const Form = styled.form`
  display: flex;
  width:100%;
  justify-self: center;
  align-self: center;
  gap: 10px;
  margin-bottom:10px;
  flex-direction: column;
`;

const Input = styled.input`
  margin-bottom: 10px;
  width:100%;
  padding: 12px;
  font-size: 16px;
  border-radius: 5px;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const Checkbox = styled.input``;

const CheckboxLabel = styled.label`
  color: #555;
  padding-left:10px;
`;

const SubmitButton = styled.button`
  padding: 12px;
  color: #fff;
  background-color: #004d4d;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const OAuthButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
`;

const GoogleButton = styled.button`
  padding: 10px;
  background: white;
  border: 1px solid #ddd;
  display: flex;
    position: relative;
    width: 100%;
    align-items: center;
    justify-content: center;
    padding: 10px 15px;
    border: none;
    background-color: #ffffff;
    color: #757575;
    font-size: 13px;
    font-weight: bold;
    border-radius: 5px;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;


const FacebookButton = styled.button`
  
  background: white;
  border: 1px solid #ddd;
  display: flex;
    position: relative;
    width: 100%;
    align-items: center;
    justify-content: center;
    padding: 10px 10px;
    border: none;
    background-color: #ffffff;
    color: #757575;
    font-size: 13px;
    font-weight: bold;
    border-radius: 5px;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;
const GoogleLogo =styled.img`
width: 20px;
height: 20px;
margin-right: 10px;`

const SignupLink = styled.p`
  justify-content: center;
  display:flex;
  text-decoration:none;
 
`;
const LoginLink=styled.p`
 color:#004d4d;
 text-decoration: none;
`

const ErrorMessage = styled.div`
  color: red;
`;

const SuccessMessage = styled.div`
  color: green;
`;
const Separator = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 10px 0;

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
`;
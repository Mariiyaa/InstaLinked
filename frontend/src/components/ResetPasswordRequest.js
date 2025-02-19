import React, { useState } from "react";
import axios from "axios";
import styled from 'styled-components';
import logo from '../assets/logo.svg'
const ResetPasswordRequest = () => {
  const [email, setEmail] = useState("");
  const [message,setMessage]=useState("")

  const handleRequest = async (e) => {
    e.preventDefault();
    setMessage("")
    try {
      await axios.post("api/auth/reset-password-request", { email });
      setMessage("Reset link send to your email")
    } catch (error) {
      alert(error.response.data.message || "Failed to send reset email!");
    }
  };

  return (<>
    <Header>
    <Logo src={logo}></Logo>
  </Header>
    <StyledForm onSubmit={handleRequest}>
    <StyledHeading>Reset Password</StyledHeading>
    <StyledInput type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
    <StyledButton type="submit">Send Reset Email</StyledButton>
    <StyledMessage>{message}</StyledMessage>
  </StyledForm>
  </>
  );
};

export default ResetPasswordRequest;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height:8vh;
  padding: 15px 30px;
  background:#006D77;
  color: white;
  font-weight: bold;
`;

const Logo = styled.img`font-size: 20px;`;
const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;  
  padding: 20px;
  border: 1px solid #ccc; // Optional border
  border-radius: 5px;   // Optional rounded corners
  width: 500px; 
        // Set a width for the form
  position:absolute;
  bottom:50%;
  margin-left:33%;
   margin-right:30%;      // Center the form on the page
`;

const StyledHeading = styled.h2`
  margin-bottom: 15px;
  color: #333; // Example color
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 3px;
  box-sizing: border-box; // Prevent padding from increasing width
`;

const StyledButton = styled.button`
  background: #006D77;
   width: 100%;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 3px;
  cursor: pointer;

  &:hover {
    background: #005662; // Darker shade on hover
  }
`;

const StyledMessage = styled.h4`
  margin-top: 15px;
  color: ${(props) => (props.children.includes("Reset link") ? "green" : "red")}; // Conditional color
`;

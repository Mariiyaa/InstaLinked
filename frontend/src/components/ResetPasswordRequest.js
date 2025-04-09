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
      console.log("Sending reset password request for email:", email);
      await axios.post("api/auth/reset-password-request", { email });
      setMessage("Reset link send to your email")
    } catch (error) {
      alert(error.response.data.message || "Failed to send reset email!");
    }
  };

  return (<>
  <Pagewrapper>
    <Header>
    <Logo src={logo}></Logo>
  </Header>
    <StyledForm >
    <StyledHeading>Reset Password</StyledHeading>
    <StyledInput type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
    <StyledButton onClick={handleRequest} type="submit">Send Reset Email</StyledButton>
    <StyledMessage>{message}</StyledMessage>
  </StyledForm>
  </Pagewrapper>
  </>
  );
};

export default ResetPasswordRequest;
const Pagewrapper= styled.div`  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f4f2ee;`
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
const StyledForm = styled.div`
  width: 500px;
  padding: 30px;
  background: #ffffff;
  border-radius: 10px;
  align-self: center;
  justify-self: center;
  text-align: center;
  margin-top: 15%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
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

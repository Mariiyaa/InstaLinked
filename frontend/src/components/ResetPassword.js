import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import styled from 'styled-components';

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [conPassword, setConPassword] = useState("");
  const navigate=useNavigate();
  const handleReset = async (e) => {
    if(!newPassword.match(conPassword)){
      alert("password different ")
      return;
    }

    e.preventDefault();
    try {
      await axios.post("api/auth/reset-password", { token, newPassword });
      alert("Password reset successful!");
      navigate('/login')
    } catch (error) {
      alert(error.response.data.message || "Password reset failed!");
    }
  };

  return (<>
   <Header>
    <Logo>InstaLinked</Logo>
  </Header>
    <StyledForm onSubmit={handleReset}>
      <StyledHeading>Set New Password</StyledHeading>
      <StyledInput type="password" placeholder="Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
      <StyledHeading>Confirm Password</StyledHeading>
      <StyledInput type="password" placeholder="Password" value={conPassword} onChange={(e) => setConPassword(e.target.value)} required />
      <StyledButton type="submit">Reset Password</StyledButton>
    </StyledForm>
  </>
 
  );
};

export default ResetPassword;
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

const Logo = styled.div`font-size: 20px;`;
const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;  
  padding: 20px;
  border: 1px solid #ccc; // Optional border
  border-radius: 5px;   // Optional rounded corners
  width: 300px;        // Set a width for the form
  margin: auto auto;       // Center the form on the page
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
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 3px;
  cursor: pointer;

  &:hover {
    background: #005662; // Darker shade on hover
  }
`;



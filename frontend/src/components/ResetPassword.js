import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import styled from 'styled-components';
import logo from '../assets/logo.svg'
const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [conPassword, setConPassword] = useState("");
    const [message,setMessage]=useState("")
  const navigate=useNavigate();

  const handleReset = async (e) => {
    setMessage("")
    console.log("handle reset called")
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
  <Pagewrapper>
   <Header>
    <Logo src={logo}></Logo>
  </Header>
    <StyledForm >
      <StyledHeading>Set New Password</StyledHeading>
      <StyledInput type="password" placeholder="Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
      <StyledHeading>Confirm Password</StyledHeading>
      <StyledInput type="password" placeholder="Password" value={conPassword} onChange={(e) => setConPassword(e.target.value)} required />
      <StyledButton onClick={handleReset} type="submit">Reset Password</StyledButton>
    </StyledForm>
    </Pagewrapper>
  </>
 
  );
};

export default ResetPassword;
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

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";

const NameSelection = () => {
  const [name, setName] = useState("");
  const location = useLocation();
  const email = location.state?.email || sessionStorage.getItem("userEmail");

  const navigate = useNavigate();
console.log(email)
  const handleSubmit = () => {
    navigate("/persona-selection", { state: { email:email,  name:name } });
  };

  return (
    <PageContainer>
      {/* ✅ Navbar */}
      <Navbar>
        <Logo>InstaLinked</Logo>
        <Steps>Steps 1/3</Steps>
       
      </Navbar>

      {/* ✅ Main Content */}
      <ContentContainer>
        <Title>What would you like to be known as?</Title>
        <InputField
          type="text"
          placeholder="Enter your name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
      </ContentContainer>
    </PageContainer>
  );
};

export default NameSelection;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f8f6f2;
  font-family: "Arial", sans-serif;
`;

const Navbar = styled.nav`
  width: 100%;
  background-color: #0f6b6f;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  position: absolute;
  top: 0;
`;

const Logo = styled.div`
  font-size: 20px;
  font-weight: bold;
`;

const Steps = styled.div`
  font-size: 14px;
`;

const SkipButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 14px;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 80px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #333;
`;

const InputField = styled.input`
  width: 300px;
  padding: 10px;
  margin-top: 10px;
  border: 2px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

const SubmitButton = styled.button`
  background-color: #0f6b6f;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  margin-top: 15px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background-color: #0d5b5f;
  }
`;
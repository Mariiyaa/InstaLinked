
import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';


const ContentSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userEmail = location.state?.email || localStorage.getItem('userEmail');

  const [selectedContent, setSelectedContent] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');


  const contentOptions = [
    { name: 'Articles', icon: '📄' },
    { name: 'Songs', icon: '🎵' },
    { name: 'Photographs', icon: '📸' },
    { name: 'Audio Stories', icon: '🎙️' },
    { name: 'Text Stories', icon: '📜' },
    { name: 'Research Papers', icon: '📚' },
    { name: 'Short Videos', icon: '🎥' },
    { name: 'Documented Videos', icon: '📂' },
    { name: 'Music', icon: '🎶' },
    { name: 'Art', icon: '🎨' },
    { name: 'Sculptures', icon: '🗿' },
    { name: 'Monuments', icon: '🏛️' },
    { name: 'Buildings', icon: '🏢' },
    { name: 'Folklores', icon: '📖' },
  ];

  const handleContentSelect = (content) => {
    setSelectedContent((prev) =>
      prev.includes(content) ? prev.filter((c) => c !== content) : [...prev, content]
    );
  };

  const handleSubmit = async () => {
    if (!userEmail) {
      setErrorMessage('User email is missing! Please log in again.');
      return;
    }
    if (selectedContent.length === 0) {
      setErrorMessage('Please select at least one content type.');
      return;
    }

    try {
      const response = await axios.post('/api/content-select', {email: userEmail, contentPreferences: selectedContent });
       
        navigate('/login');
 
    } catch (error) {
      console.error('Error submitting content selection:', error);
      setErrorMessage('Something went wrong.');
    }
  };

  return (
    <Container>
    <Header>
        <Logo>Instalinked</Logo>
        <Progress>Steps 3/3</Progress>
        <SkipButton onClick={() => navigate('/Login')}>Skip ➝</SkipButton>
      </Header>

      <Main>
        <Title>Customize Your Feed</Title>
        <Description>Select the types of content you want to explore.</Description>

        <ContentGrid>
          {contentOptions.map((content) => (
            <ContentCard
              key={content.name}
              selected={selectedContent.includes(content.name)}
              onClick={() => handleContentSelect(content.name)}
            >
              <Icon>{content.icon}</Icon>
              <ContentName>{content.name}</ContentName>
            </ContentCard>
          ))}
        </ContentGrid>

        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}


        <NextButton onClick={handleSubmit}>Finish →</NextButton>
      </Main>
    </Container>
  );
};

export default ContentSelection;

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height:100%;
  gap:40px;
  background: #f5f3ee;
`;

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
const Progress = styled.div`font-size: 16px;`;
const SkipButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
`;

const Main = styled.div`
position:relative;
height:100%;
  text-align: center;
  gap:40px;
  padding: 40px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const Description = styled.p`
  font-size: 16px;
  color: #555;
  margin-bottom: 30px;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  max-width: 900px;
  margin: auto;
`;
const ContentCard = styled.div`
  background: ${(props) => (props.selected ?'#006D77' : 'white')};
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  &:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const Icon = styled.div`
  font-size: 30px;
  margin-bottom: 10px;
  color: ${(props) => (props.selected ? '#E5E5E5' : '#004d40')};
`;

const ContentName = styled.h2`
  font-size: 18px;
  font-weight: bold;
`;


const ErrorMessage = styled.div`
  color: red;
  margin-top: 20px;
`;

const NextButton = styled.button`
  margin-top: 30px;
  margin-bottom:40%;
  padding: 12px 24px;
  font-size: 16px;
  background-color: #006D77;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
  &:hover {
    background-color: #00332e;
  }
`;

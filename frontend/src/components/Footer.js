import React from "react";
import styled from "styled-components";
import logo from'../assets/logo.svg'

const Footer = () => {
  return (
    <FooterContainer>
      <TopSection>
        <Logo src={logo} alt="Logo" />
        <NavLinks>
         
          <NavItem href="#">About us</NavItem>
          <NavItem href="#">Features</NavItem>
          <NavItem href="#">Help Center</NavItem>
          <NavItem href="#">Contact us</NavItem>
          <NavItem href="#">FAQs</NavItem>
         
        </NavLinks>
      </TopSection>

      <Divider />

      <BottomSection>
        <LanguageSelector>
          <select>
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
          </select>
        </LanguageSelector>
        <CopyrightText>
          © 2025 Brand, Inc. • <a href="#">Privacy</a> • <a href="#">Terms</a> •{" "}
          
        </CopyrightText>
        <SocialIcons>
          <Icon href="#"><i className="fab fa-twitter"></i></Icon>
          <Icon href="#"><i className="fab fa-facebook"></i></Icon>
          <Icon href="#"><i className="fab fa-linkedin"></i></Icon>
          <Icon href="#"><i className="fab fa-youtube"></i></Icon>
        </SocialIcons>
      </BottomSection>
    </FooterContainer>
  );
};

export default Footer;

// Styled Components
const FooterContainer = styled.footer`
  background: #006d77;
  color: white;
  padding: 40px 0;
  text-align: center;
`;

const TopSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
`;

const Logo = styled.img`
position:relative;
  height:80% ;
`;

const NavLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
`;

const NavItem = styled.a`
  color: white;
  text-decoration: none;
  font-size: 16px;

  &:hover {
    text-decoration: underline;
  }
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background-color: #ccc;
  width: 60%;
  margin: 20px auto;
`;

const BottomSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  max-width: 900px;
  margin: auto;
`;

const LanguageSelector = styled.div`
  select {
    padding: 5px;
    border-radius: 5px;
    border: none;
  }
`;

const CopyrightText = styled.p`
  font-size: 14px;

  a {
    color: white;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 10px;
`;

const Icon = styled.a`
  color: white;
  font-size: 18px;

  &:hover {
    opacity: 0.7;
  }
`;

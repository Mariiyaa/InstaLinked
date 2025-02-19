import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import AppNavbar from "./AppNavbar";

const ProfileEdit = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [message, setMessage] = useState("");

  console.log("ProfileEdit received userData:", user);
  const [userProfile, setUserProfile] = useState({
    fullName: "",
    profileImage: '',
    bio: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    location: "",
    occupation: "",
    persona: [],
    contentPreferences: [],
    externalLinks: [""],
  });

  const saveUserToLocalStorage = (userData) => {
    if (userData) {
      localStorage.clear(); // Clear previous data to allow multiple users
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      console.error("userData is undefined or null");
    }
  };
  useEffect(() => {
    if (user) {
      setUserProfile((prev) => ({
        ...prev,
        ...user,
        fullName:user.fullName,
        contentPreferences:user.contentPreferences || [],
        personas: user.personas || [],// Use data from context
        profileImage: user.profileImage || null,
      }));
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = file;
      setUserProfile({ ...userProfile, profileImage: imageUrl });
    }
  };

  const handleExternalLinkChange = (index, value) => {
    const updatedLinks = [...userProfile.externalLinks];
    updatedLinks[index] = value;
    setUserProfile({ ...userProfile, externalLinks: updatedLinks });
  };

  const addExternalLink = () => {
    setUserProfile({ ...userProfile, externalLinks: [...userProfile.externalLinks, ""] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      Object.keys(userProfile).forEach((key) => {
        if (key === "externalLinks") {
          formData.append(key, JSON.stringify(userProfile[key]));
        } else {
          formData.append(key, userProfile[key]);
        }
      });

      const response = await axios.post("/api/profile/create-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      saveUserToLocalStorage(userProfile)
      saveUserToLocalStorage(response.data.user)
      setMessage(response.data.message);

    } catch (error) {
      console.error("Error uploading profile", error);
    }
  };

  return (
    <>
      <AppNavbar />
      <Container>
        <MainContent>
          <FormContainer>
            <Title>Edit Your Profile</Title>
            <ProfilePhoto>
  <input type="file" id="fileUpload" hidden accept="image/*" onChange={handleFileChange} />
  <Label htmlFor="fileUpload">
    {userProfile.profileImage ? (
      <ProfileImage src={userProfile.profileImage} alt="Profile Preview" />
    ) : (
      <p style={{textAlign:"center"}}> Upload Photo</p>
    )}
  </Label>
</ProfilePhoto>

            <Form onSubmit={handleSubmit}>
              <Row>
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={userProfile.fullName}
                  onChange={(e) => setUserProfile({ ...userProfile, fullName: e.target.value })}
                  required
                />
                <Input
                  type="text"
                  placeholder="Occupation"
                  value={userProfile.occupation}
                  onChange={(e) => setUserProfile({ ...userProfile, occupation: e.target.value })}
                  required
                />
              </Row>

              <Row>
                <Input
                  type="text"
                  placeholder="Phone Number"
                  value={userProfile.phone}
                  onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                  required
                />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={userProfile.email}
                  onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                  required
                />
              </Row>

              <Textarea
                placeholder="About you"
                value={userProfile.bio}
                onChange={(e) => setUserProfile({ ...userProfile, bio: e.target.value })}
                
              ></Textarea>
              <p> Date of Birth :</p>
              <Row>
                <Input
                  type="date"
                  value={userProfile.dateOfBirth}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setUserProfile({ ...userProfile, dateOfBirth: e.target.value })}
                  required
                />
                <Select
                  value={userProfile.gender}
                  onChange={(e) => setUserProfile({ ...userProfile, gender: e.target.value })}
                  required
                >
                  <option value="">Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Select>
              </Row>

              <Row>
                <Input
                  type="text"
                  placeholder="Location"
                  value={userProfile.location}
                  onChange={(e) => setUserProfile({ ...userProfile, location: e.target.value })}
                />
              </Row>
             {/* Personas Selector */}
<select
  multiple
  value={userProfile.persona || []}
  onChange={(e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);

    // Update state while avoiding duplicates
    setUserProfile((prevProfile) => ({
      ...prevProfile,
      persona: Array.from(new Set([...prevProfile.persona, ...selectedOptions])),
    }));
  }}
  style={{
    width: '100%',
    padding: '5px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    height: '120px', // Allow space for multiple selections
  }}
>
  <option value="Heritage Lover">Heritage Lover</option>
  <option value="Explorer">Explorer</option>
  <option value="Researcher">Researcher</option>
  <option value="Practitioner">Practitioner</option>
  <option value="Conservator">Conservator</option>
  <option value="Artist">Artist</option>
</select>

{/* Display selected persona */}
<div
  style={{
    marginTop: "10px",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "10px",
    border: "1px solid #ccc",
    padding: "5px",
    borderRadius: "5px",
    minHeight: "40px",
  }}
>
  {userProfile.persona && userProfile.persona.length > 0 ? (
    userProfile.persona.map((persona) => (
      <div
        key={persona}
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#006D77",
          padding: "5px 10px",
          borderRadius: "5px",
          fontSize: "14px",
        }}
      >
        <p style={{ color: 'white' }}>{persona}</p>
        <button
          onClick={() => {
            const updatedpersona = userProfile.persona.filter((p) => p !== persona);
            setUserProfile({ ...userProfile, persona: updatedpersona });
          }}
          style={{
            marginLeft: "8px",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "#ffffff",
            fontWeight: "bold",
          }}
        >
          ✕
        </button>
      </div>
    ))
  ) : (
    <span style={{ color: "#777", fontStyle: "italic" }}>No personas selected</span>
  )}
</div>

{/* Content Preferences Selector */}
<select
  multiple
  value={userProfile.contentPreferences || []}
  onChange={(e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);

    // Update state while avoiding duplicates
    setUserProfile((prevProfile) => ({
      ...prevProfile,
      contentPreferences: Array.from(new Set([...prevProfile.contentPreferences, ...selectedOptions])),
    }));
  }}
  style={{
    width: '100%',
    padding: '5px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    height: '120px', // Allow space for multiple selections
  }}
>
  <option value="Articles">Articles</option>
  <option value="Songs">Songs</option>
  <option value="Research Papers">Research Papers</option>
  <option value="Short Videos">Short Videos</option>
  <option value="Documented Videos">Documented Videos</option>
  <option value="Music">Music</option>
  <option value="Art">Art</option>
  <option value="Sculptures">Sculptures</option>
  <option value="Monuments">Monuments</option>
  <option value="Folklores">Folklores</option>
</select>

{/* Display selected content preferences */}
<div
  style={{
    marginTop: "10px",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "10px",
    border: "1px solid #ccc",
    padding: "5px",
    borderRadius: "5px",
    minHeight: "40px",
  }}
>
  {userProfile.contentPreferences && userProfile.contentPreferences.length > 0 ? (
    userProfile.contentPreferences.map((content) => (
      <div
        key={content}
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#006D77",
          padding: "5px 10px",
          borderRadius: "5px",
          fontSize: "14px",
        }}
      >
        <p style={{ color: 'white' }}>{content}</p>
        <button
          onClick={() => {
            const updatedContent = userProfile.contentPreferences.filter((p) => p !== content);
            setUserProfile({ ...userProfile, contentPreferences: updatedContent });
          }}
          style={{
            marginLeft: "8px",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "#ffffff",
            fontWeight: "bold",
          }}
        >
          ✕
        </button>
      </div>
    ))
  ) : (
    <span style={{ color: "#777", fontStyle: "italic" }}>No content preferences selected</span>
  )}
</div>


              <h3>Portfolio Links</h3>
              {userProfile.externalLinks.map((link, index) => (
                <Row key={index}>
                  <Input
                    type="url"
                    value={link}
                    onChange={(e) => handleExternalLinkChange(index, e.target.value)}
                    placeholder="Link to your work"
                  />
                </Row>
              ))}
              <Button type="button" onClick={addExternalLink}>
                + Add More Links
              </Button>

              <SocialMedia>
                <Icon>
                  <FaInstagram />
                </Icon>
                <Icon>
                  <FaLinkedin />
                </Icon>
                <Icon>
                  <FaTwitter />
                </Icon>
              </SocialMedia>

              <ButtonRow>
                <SaveButton>Save & Continue</SaveButton>
                <CancelButton>Cancel</CancelButton>
              </ButtonRow>
              {message && <Message>{message}</Message>}
            </Form>
          </FormContainer>
        </MainContent>
         {/* Right Sidebar */}
      <Sidebar>
        <Updates>
          <h3>Platform Updates</h3>
          <UpdateCard>
            <Badge>New Feature</Badge>
            <h4>Creator Collaboration Tool</h4>
            <p>Start co-creating content now with our new collaboration features!</p>
          </UpdateCard>

          <UpdateCard>
            <Badge type="event">Event</Badge>
            <h4>Digital Heritage Workshop</h4>
            <p>Join us this Saturday for an interactive session.</p>
          </UpdateCard>

          <UpdateCard>
            <Badge type="trending">Trending</Badge>
            <h4>Folklore Stories</h4>
            <p>Explore curated stories from around the world.</p>
          </UpdateCard>

          <UpdateCard>
            <Badge type="trending">Trending</Badge>
            <h4>Fables and Tales</h4>
          </UpdateCard>
        </Updates>

        <QuickLinks>
          <h3>Quick Links</h3>
          <LinkItem>🌟 Change Theme</LinkItem>
          <LinkItem>🔒 Privacy Settings</LinkItem>
          <LinkItem>🔑 Change Password</LinkItem>
          <LinkItem>🌎 Language Preference</LinkItem>
          <LinkItem>🔔 Notification Settings</LinkItem>
        </QuickLinks>
      </Sidebar>
      </Container>
    </>
  );
};

export default ProfileEdit;


// Styled Components

const Container = styled.div`
  display: flex;
  justify-content: center;
  padding: 3%;
  background-color: #f4f3ee;
`;

const MainContent = styled.div`
  width: 60%;
  background: white;
  padding: 20px;
  border-radius: 8px;
`;

const FormContainer = styled.div`
  padding: 20px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const ProfilePhoto = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const Label = styled.label`
  background: #ececec;
  border-radius: 50%;
  height: 150px;
  width: 150px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Row = styled.div`
  display: flex;
  gap: 10px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content:center;
  gap: 30px;
`;

const Button = styled.button`
  padding: 10px;
  background:#006D77 ;
  border-radius:5px;
  font-size:16px;
  color: white;
  border: none;
  cursor: pointer;
`;

const SaveButton = styled(Button)`
width:30%;`;

const CancelButton = styled(Button)`
  background: #e0e0e0;
  color: black;
  width:30%
`;

const SocialMedia = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
`;

const Icon = styled.div`
  font-size: 24px;
`;

const Message = styled.p`
  text-align: center;
  color: green;
`;

export const Sidebar = styled.div`
 width: 30%;
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const Updates = styled.div`
 flex: 1;
  background: white;
  padding: 15px;
  border-radius: 8px;
`;

export const UpdateCard = styled.div`
  margin-bottom: 10px;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 5px;
`;

export const Badge = styled.span`
  display: inline-block;
  padding: 5px 10px;
  background: ${(props) =>
    props.type === "event" ? "blue" : props.type === "trending" ? "orange" : "green"};
  color: white;
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 5px;
`;

export const QuickLinks = styled.div`
 flex: 1;
  background: white;
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
`;

export const LinkItem = styled.div`
  padding: 8px 0;
  cursor: pointer;
  border-bottom: 1px solid #eee;
`;
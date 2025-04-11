import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import AppNavbar from "./AppNavbar";

const ProfileEdit = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState(null);

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

  const saveUserTosessionStorage = (userData) => {
    if (userData) {
      sessionStorage.clear(); // Clear previous data to allow multiple users
      sessionStorage.setItem("user", JSON.stringify(userData));
    } else {
      console.error("userData is undefined or null");
    }
  };

  useEffect(() => {
    if (user) {
      setUserProfile((prev) => ({
        ...prev,
        ...user,
        fullName: user.fullName,
        contentPreferences: user.contentPreferences || [],
        personas: user.personas || [], // Use data from context
        profileImage: user.profileImage || null,
      }));
      
      // If user has a profile image already, set it as preview
      if (user.profileImage) {
        setPreview(user.profileImage);
      }
    }
  }, []);

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (preview && typeof preview === 'string' && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a URL for the file to display preview
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
      
      // Keep the actual file in state for upload
      setUserProfile({ ...userProfile, profileImage: file });
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
      
      // Add all fields to formData
      Object.keys(userProfile).forEach((key) => {
        if (key === "externalLinks" || key === "persona" || key === "contentPreferences") {
          formData.append(key, JSON.stringify(userProfile[key]));
        } else if (key === "profileImage" && userProfile[key] && typeof userProfile[key] === 'object') {
          // If profileImage is a File object, append it directly
          formData.append(key, userProfile[key]);
        } else {
          formData.append(key, userProfile[key]);
        }
      });

      const response = await axios.post("/api/profile/create-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      saveUserTosessionStorage(response.data.user);
      setMessage(response.data.message);

    } catch (error) {
      console.error("Error uploading profile", error);
      setMessage("Error saving profile. Please try again.");
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
                {preview ? (
                  <ProfileImage src={preview} alt="Profile Preview" />
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
                <SaveButton type="submit">Save & Continue</SaveButton>
                <CancelButton type="button">Cancel</CancelButton>
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
            <h3>upcoming features</h3>
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
  width: 60%;
  margin:8%;
  align-self: center;
  justify-self: center;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  gap: 20px;
  
  @media (max-width: 1024px) {
    width: 80%;
  }
  
  @media (max-width: 768px) {
    width: 90%;
    padding: 15px;
    flex-direction: column;
  }
  
  @media (max-width: 480px) {
    width: 95%;
    margin: 10px auto;
    padding: 10px;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  flex: 1;
  
  @media (max-width: 768px) {
    gap: 15px;
  }
  
  @media (max-width: 480px) {
    gap: 10px;
  }
`;

const FormContainer = styled.div`
  width: 100%;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    padding: 15px;
  }
  
  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const ProfilePhoto = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  width: 150px;
  height: 150px;
  margin: 0 auto 20px;
  border: 2px dashed #ddd;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  
  @media (max-width: 768px) {
    width: 120px;
    height: 120px;
  }
  
  @media (max-width: 480px) {
    width: 100px;
    height: 100px;
  }
`;

const Label = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  cursor: pointer;
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
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 5px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  
  @media (max-width: 480px) {
    padding: 8px;
    font-size: 14px;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  min-height: 100px;
  font-size: 16px;
  
  @media (max-width: 480px) {
    padding: 8px;
    min-height: 80px;
    font-size: 14px;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  
  @media (max-width: 480px) {
    padding: 8px;
    font-size: 14px;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  gap: 10px;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 5px;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  background: ${props => props.primary ? '#116466' : props.secondary ? '#6c757d' : '#dc3545'};
  color: white;
  
  @media (max-width: 480px) {
    width: 100%;
    padding: 8px 15px;
    font-size: 14px;
  }
`;

const SaveButton = styled(Button)`
  background-color: #006D77;
`;

const CancelButton = styled(Button)`
  background: #e0e0e0;
  color: black;
  width: 30%;
  
  @media (max-width: 480px) {
    width: 100%;
  }
`;

const SocialMedia = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
`;

const Icon = styled.div`
  font-size: 24px;
  cursor: pointer;
`;

const Message = styled.p`
  text-align: center;
  color: green;
`;

const Sidebar = styled.div`
  width: 30%;
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const Updates = styled.div`
  flex: 1;
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const UpdateCard = styled.div`
  margin-bottom: 10px;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 5px;
`;

const Badge = styled.span`
  display: inline-block;
  padding: 5px 10px;
  background: ${(props) =>
    props.type === "event" ? "#4287f5" : props.type === "trending" ? "#ff9900" : "#28a745"};
  color: white;
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 5px;
`;

const QuickLinks = styled.div`
  flex: 1;
  background: white;
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const LinkItem = styled.div`
  padding: 8px 0;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  
  &:hover {
    color: #006D77;
  }
`;
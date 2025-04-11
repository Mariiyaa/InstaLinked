import React, { useState } from "react";
import styled from "styled-components";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCloudUploadAlt, FaEllipsisH, FaRegHeart, FaRegComment } from "react-icons/fa";

const contentTypes = {
  Image: "image/*",
  Reel: "video/*",
  Audio: "audio/*",
  Pdf: ".pdf,.doc,.docx",
  Documentary:"video/*"
};

const categories = {
  Heritage: "Heritage",
  Research: "Research",
  Art: "Art",
  Music: "Music",
  Story: "Story",
};

const CreatePost = () => {
  const navigate = useNavigate();

  const [selectedType, setSelectedType] = useState("Image");
  const [selectedCategory, setSelectedCategory] = useState("Heritage");
  const [file, setFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [visibility, setVisibility] = useState("Public");
  const [error, setError] = useState("");

  const user = sessionStorage.getItem("user");
  const userObject = JSON.parse(user);
  console.log("User Email:", userObject.email);

  const handlePublish = async () => {
    if (!file) {
      alert("Please upload a file before publishing!");
      return;
    }

    const formData = new FormData();
    formData.append("email", userObject.email);
    formData.append("file", file);
    formData.append("caption", caption);
    formData.append("tags", tags);
    formData.append("hashtags", hashtags);
    formData.append("visibility", visibility);
    formData.append("type", selectedType);
    formData.append("category", selectedCategory);

    console.log("📂 FormData Contents:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      console.log("formdata : ",formData)
      const response = await axios.post("/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        alert("Post published successfully!");
        handleReset();
      }
    } catch (error) {
      console.error("❌ Error publishing post:", error);
      alert("Failed to publish post. Please try again.");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: contentTypes[selectedType],
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const validTypes = contentTypes[selectedType].split(",");
        
        if (!validTypes.some((type) => file.type.startsWith(type.replace("/*", "")))) {
          setError(`Invalid file type selected. Only ${selectedType} files are allowed!`);
          setFile(null);
          return;
        }
        
        // Check video duration for Reels (must be <= 60 seconds)
        if (selectedType === "Reel") {
          const videoElement = document.createElement('video');
          videoElement.preload = 'metadata';
          
          videoElement.onloadedmetadata = function() {
            window.URL.revokeObjectURL(videoElement.src);
            const duration = videoElement.duration;
            
            if (duration > 45) {
              setError(`Reel videos cannot be longer than 45 seconds. Your video is ${Math.round(duration)} seconds.`);
              setFile(null);
              setPreviewURL("");
              return;
            } else {
              setFile(file);
              setPreviewURL(URL.createObjectURL(file));
              setError("");
            }
          };
          
          videoElement.src = URL.createObjectURL(file);
        } else {
          setFile(file);
          setPreviewURL(URL.createObjectURL(file));
          setError("");
        }
      }
    },
  });

  const handleReset = () => {
    setFile(null);
    setPreviewURL("");
    setCaption("");
    setTags("");
    setHashtags("");
    setVisibility("Public");
  };

  return (
    <Container>
      <Header><span>Create New Post</span>
      <CloseButton onClick={() => navigate("/Home")}>X</CloseButton></Header>
      

      <Content>
        <LeftSection>
          <Title>Create New Post</Title>


          <label>Select post type</label>
          <ButtonGroup>
            {Object.keys(contentTypes).map((type) => (
              <ContentTypeButton key={type} active={selectedType === type} onClick={() => setSelectedType(type)}>
                {type}
              </ContentTypeButton>
            ))}
          </ButtonGroup>

          <label>Select post category</label>
          <ButtonGroup>
            {Object.keys(categories).map((cat) => (
              <ContentTypeButton key={cat} active={selectedCategory === cat} onClick={() => setSelectedCategory(cat)}>
                {cat}
              </ContentTypeButton>
            ))}
          </ButtonGroup>

          <Dropzone {...getRootProps()}>
            <input {...getInputProps()} />
            {previewURL ? (
              <PreviewImage src={previewURL} alt="Preview" />
            ) : (
              <DropzoneContent>
                <FaCloudUploadAlt size={48} color="#116466" />
                <p>Drag & Drop or Click to Select {selectedType}</p>
              </DropzoneContent>
            )}
          </Dropzone>
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <TextArea placeholder="Write your caption..." value={caption} onChange={(e) => setCaption(e.target.value)} />
          <Input type="text" placeholder="Tag people" value={tags} onChange={(e) => setTags(e.target.value)} disabled />
          <Input type="text" placeholder="Add hashtags" value={hashtags} onChange={(e) => setHashtags(e.target.value)} />

          <Button primary onClick={handlePublish}>Publish</Button>
          <Button danger onClick={handleReset}>Reset</Button>
        </LeftSection>

        {/* Right Section */}
        <RightSection>
          <Title>Preview</Title>
          <PreviewCardWrapper>
            <PreviewCardContent>
              <PreviewCardLeftSection>
                {previewURL ? (
                  <>
                    {selectedType === "Image" && <PreviewImage src={previewURL} alt="Post Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    {(selectedType === "Reel" || selectedType === "Documentary") && (
                      <video 
                        src={previewURL} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        controls
                      />
                    )}
                    {selectedType === "Audio" && (
                      <div style={{ background: '#000', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                        <div style={{ fontSize: '36px', marginBottom: '10px' }}>🎵</div>
                        <audio src={previewURL} controls style={{ width: '80%' }} />
                      </div>
                    )}
                    {selectedType === "Pdf" && (
                      <div style={{ background: '#000', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                        <div style={{ fontSize: '48px', marginBottom: '10px', color: 'white' }}>📄</div>
                        <p style={{ color: 'white' }}>PDF Document</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#ccc' }}>
                    Post content will appear here
                  </div>
                )}
              </PreviewCardLeftSection>
              
              <PreviewCardRightSection>
                <PreviewHeader>
                  <UserInfo>
                    <ProfileImage 
                      src={userObject.profileImage || '/default-profile.png'} 
                      alt={userObject.username || "User"}
                    />
                    <div>
                      <Username>{userObject.username || userObject.email}</Username>
                      <p style={{ fontSize: '12px', color: '#666', margin: '0' }}>{userObject.occupation || "User"}</p>
                    </div>
                  </UserInfo>
                  <div>
                    <FaEllipsisH />
                  </div>
                </PreviewHeader>
                
                <PreviewContent>
                  {caption && (
                    <CaptionWrapper>
                      <strong style={{ marginRight: '8px' }}>
                        {userObject.username || userObject.email}
                      </strong>
                      {caption}
                    </CaptionWrapper>
                  )}
                  
                  {hashtags && (
                    <HashtagWrapper>
                      #{hashtags.split(" ").join(" #")}
                    </HashtagWrapper>
                  )}
                  
                  <CommentsPreview>
                    <p style={{ color: '#8e8e8e', fontSize: '14px' }}>No comments yet</p>
                  </CommentsPreview>
                </PreviewContent>
                
                <PreviewFooter>
                  <div>
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '10px' }}>
                      <FaRegHeart size={24} />
                      <FaRegComment size={24} />
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>0 likes</div>
                    <div style={{ color: '#8e8e8e', fontSize: '10px', textTransform: 'uppercase', marginBottom: '10px' }}>Just now</div>
                  </div>
                  
                  <CommentInputPreview>
                    <input type="text" placeholder="Add a comment..." disabled />
                    <button disabled>Post</button>
                  </CommentInputPreview>
                </PreviewFooter>
              </PreviewCardRightSection>
            </PreviewCardContent>
          </PreviewCardWrapper>
        </RightSection>
      </Content>
    </Container>
  );
};

export default CreatePost;
const Container = styled.div`
  width: 75%;
  height: 90vh;
  margin: 20px auto;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  
  @media (max-width: 1024px) {
    width: 90%;
  }
  
  @media (max-width: 768px) {
    width: 95%;
    height: auto;
    min-height: 90vh;
    padding: 15px;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    margin: 10px auto;
    padding: 10px;
  }
`;

const Header = styled.h2`
  text-align: center;
  display: flex;
  justify-content: space-between;
  background: #116466;
  color: white;
  padding: 10px;
  border-radius: 5px;
  
  @media (max-width: 480px) {
    padding: 8px;
    font-size: 18px;
  }
`;
const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
`;

const Content = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const LeftSection = styled.div`
  width: 45%;
  background: white;
  position: relative;
  padding: 20px;
  height: 90%;
  border-radius: 10px;
  
  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    min-height: 400px;
  }
  
  @media (max-width: 480px) {
    padding: 15px;
  }
`;

const RightSection = styled.div`
  width: 45%;
  background: white;
  padding: 20px;
  border-radius: 10px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
  
  @media (max-width: 480px) {
    padding: 15px;
  }
`;

const Title = styled.h3`
  margin-bottom: 15px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 15px;
  gap: 2%;
  
  @media (max-width: 480px) {
    flex-wrap: wrap;
    gap: 5px;
  }
`;

const ContentTypeButton = styled.button`
  flex: 1;
  padding: 8px 15px;
  background: ${(props) => (props.active ? "#116466" : "#ddd")};
  color: ${(props) => (props.active ? "white" : "black")};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  
  @media (max-width: 480px) {
    padding: 6px 10px;
    font-size: 14px;
  }
`;

const Dropzone = styled.div`
  padding: 20px;
  background-color: #dddddd;
  text-align: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  height: 25vh;
  border-radius: 5px;
  margin-bottom: 15px;
  
  @media (max-width: 768px) {
    height: 20vh;
  }
  
  @media (max-width: 480px) {
    height: 15vh;
    padding: 10px;
  }
`;

const PreviewImage = styled.img`
  object-fit: cover;
  border-radius: 5px;
  max-height: 100%;
  max-width: 100%;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 10vh;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  
  @media (max-width: 480px) {
    height: 8vh;
    padding: 8px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  
  @media (max-width: 480px) {
    padding: 8px;
  }
`;

const VisibilityWrapper = styled.div`
  margin-bottom: 15px;
  select {
    margin-left: 10px;
    padding: 5px;
  }
`;

const Button = styled.button`
  background: ${(props) => (props.primary ? "#116466" : props.danger ? "#ff4d4d" : props.secondary ? "#777" : "#ccc")};
  color: white;
  padding: 10px;
  margin-right: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  
  @media (max-width: 480px) {
    padding: 8px;
    font-size: 14px;
  }
`;

const RecentPost = styled.div`
  display: flex;
  margin-bottom: 10px;
  
  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const PostIcon = styled.div`
  font-size: 24px;
  margin-right: 10px;
`;
const PreviewCardWrapper = styled.div`
  background: #fff;
  border-radius: 8px;
  border: 1px solid #dbdbdb;
  overflow: hidden;
  height: 400px;
  
  @media (max-width: 768px) {
    height: auto;
  }
`;

const PreviewCardContent = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const PreviewCardLeftSection = styled.div`
  flex: 1;
  background: black;
  position: relative;
  overflow: hidden;
`;

const PreviewCardRightSection = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #dbdbdb;
  height: 100%;
`;

const PreviewHeader = styled.div`
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #efefef;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
`;

const Username = styled.strong`
  font-size: 16px;
  font-weight: 500;
`;

const PreviewContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 14px;
`;

const CaptionWrapper = styled.div`
  margin-bottom: 10px;
`;

const HashtagWrapper = styled.div`
  margin-bottom: 10px;
  color: #116466;
  font-weight: 500;
`;

const CommentsPreview = styled.div`
  margin-bottom: 10px;
`;

const PreviewFooter = styled.div`
  padding: 10px;
  border-top: 1px solid #efefef;
`;

const CommentInputPreview = styled.div`
  display: flex;
  padding: 8px 0;
  margin-top: 10px;

  input {
    flex: 1;
    border: none;
    padding: 8px;
    background: none;
    outline: none;
  }

  button {
    background: none;
    border: none;
    color: #0095f6;
    font-weight: 600;
    opacity: 0.3;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  text-align: center;
  margin-top: 5px;
`;

const DropzoneContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 10px;

  p {
    margin-top: 10px;
    color: #666;
  }
`;
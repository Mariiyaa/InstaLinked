import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import default_user from "../assets/default_user.jpg";
import UserInteraction from "./UserInteraction"
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { FaHeart, FaRegComment, FaPaperPlane, FaBookmark } from "react-icons/fa";
import disk from "../assets/disk.jpg";


const PopUPexplore = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [currentPost, setCurrentPost] = useState(null);
    const { postId } = useParams();
    const [comments, setComments] = useState([
        { username: "user.one", text: "Great post! Love the design.", time: "1h ago" },
        { username: "user.two", text: "Amazing work!", time: "30m ago" },
        { username: "user.one", text: "Great post! Love the design.", time: "1h ago" },
        { username: "user.two", text: "Amazing work!", time: "30m ago" },
    ]);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        const fetchRandomPosts = async () => {
            try {
                const response = await axios.get("/api/explore/explore-page?random=true");
                const posts = response.data; // Assuming this is an array
                if (Array.isArray(posts)) {
                  console.log(posts[0]?.user?.fullName); // Log the full name of the first post's user
                  setPosts(posts);
            
                  // Find the initial post based on `postId`
                  const initialPost = posts.find((p) => p._id === postId);
                  setCurrentPost(initialPost || posts[0]);
                }
              } catch (error) {
                console.error("Error fetching posts:", error.response?.data || error.message);
              }
        };
        fetchRandomPosts();
    }, [postId]);

    const handleNavigate = (direction) => {
        if (!posts.length || !currentPost) return;
        const currentIndex = posts.findIndex((p) => p._id === currentPost._id);
        if (currentIndex !== -1) {
            const newIndex = direction === "prev" ? currentIndex - 1 : currentIndex + 1;
            if (newIndex >= 0 && newIndex < posts.length) {
                const nextPost = posts[newIndex];
                setCurrentPost(nextPost);
                window.history.replaceState(null, "", `/p/${nextPost._id}`);
            }
        }
    };

    if (!posts.length) return <p>Loading posts...</p>;

    if (!currentPost) {
        const firstPost = posts[0];
        if (firstPost) {
            setCurrentPost(firstPost);
            navigate(`/p/${firstPost._id}`, { replace: true });
        }
        return <p>Loading post...</p>;
    }

    return (
        <ModalOverlay>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => navigate(-1)}>&times;</CloseButton>
      
            {/* Mobile-only UserDetails above media */}
            <MobileUserDetails>
              <UserDetails>
                <UserImg src={currentPost?.user?.profileImage || default_user} alt="User" />
                <div>
                  <p style={{ fontWeight: "bold", fontSize: "16px" }}>
                    {currentPost?.user?.fullName || "Unknown User"}
                  </p>
                  <p style={{ fontSize: "12px", padding: "10px", color: "#fff" }}>
                    {new Date(currentPost?.created_at).toLocaleString()}
                  </p>
                </div>
              </UserDetails>
            </MobileUserDetails>
      
            <MediaContainer>
              {currentPost.content_type === "Pdf" && <MediaPdf src={currentPost.url} alt="Post" />}
              {currentPost.content_type === "Image" && <MediaImage src={currentPost.url} alt="Post" />}
              {["Documentary", "Reel"].includes(currentPost.content_type) && (
                <MediaVideo src={currentPost.url} controls />
              )}
              {currentPost.content_type === "Audio" && (
                <AudioWrapper>
                  <AudioThumbnail src={disk} alt="Audio Disk" />
                  <audio controls src={currentPost.url}></audio>
                </AudioWrapper>
              )}
            </MediaContainer>
      
            <CommentSection>
              {/* Desktop-only UserDetails */}
              <DesktopUserDetails>
                <UserDetails>
                  <UserImg src={currentPost?.user?.profileImage || default_user} alt="User" />
                  <div>
                    <p style={{ fontWeight: "bold", fontSize: "16px" }}>
                      {currentPost?.user?.fullName || "Unknown User"}
                    </p>
                    <p style={{ fontSize: "12px", padding: "10px", color: "#fff" }}>
                      {new Date(currentPost?.created_at).toLocaleString()}
                    </p>
                  </div>
                </UserDetails>
              </DesktopUserDetails>
      
              <Caption>{currentPost?.caption || "This is a caption..."}</Caption>
      
              {currentPost?.hashtags && (
                <HashtagsContainer>
                  {Array.isArray(currentPost.hashtags)
                    ? currentPost.hashtags.map((tag, index) => (
                        <Hashtag key={index}>#{tag}</Hashtag>
                      ))
                    : typeof currentPost.hashtags === "string"
                    ? currentPost.hashtags.split(" ").map((tag, index) => (
                        <Hashtag key={index}>#{tag}</Hashtag>
                      ))
                    : null}
                </HashtagsContainer>
              )}
      
              <UserInteraction setCurrentPost={setCurrentPost} currentpost={currentPost} />
            </CommentSection>
      
            <NavLeftButton onClick={() => handleNavigate("prev")}>
              <FaArrowLeft
                size={30}
                style={{
                  zIndex: 1000,
                  position: "absolute",
                  color: "white",
                  top: 0,
                  right: 0,
                  padding: "5px",
                  backgroundColor: "hsla(171, 89.50%, 7.50%, 0.62)",
                }}
              />
            </NavLeftButton>
            <NavRightButton onClick={() => handleNavigate("next")}>
              <FaArrowRight
                size={30}
                style={{
                  zIndex: 1000,
                  position: "absolute",
                  color: "white",
                  top: 0,
                  right: 0,
                  padding: "5px",
                  backgroundColor: "hsla(171, 89.50%, 7.50%, 0.62)",
                }}
              />
            </NavRightButton>
          </ModalContent>
        </ModalOverlay>
      );
      
};

export default PopUPexplore;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    
    @media (max-width: 768px) {
        align-items: center;
    }
`;

const ModalContent = styled.div`
    background-color: white;
    display: flex;
    flex-direction: row;
    width: 50%;
    height: 60%;
    overflow: hidden;
    position: relative;
    
    @media (max-width: 768px) {
        flex-direction: column;
        width: 90%;
        height: 70%;
    }
    
    @media (max-width: 480px) {
        width: 95%;
        height: 70%;
    }
`;

const CloseButton = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 24px;
    background: none;
    border: none;
    cursor: pointer;
    z-index: 10;
`;

const UserDetails = styled.div`
    display: flex;
    align-items: center;
    padding: 16px;
    background-color: #006D77;
    color:#ffffff;
    border-bottom: 1px solid #ddd;
`;

const UserImg = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 12px;
`;

const MediaContainer = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    position: relative;
    padding:0px;
    
    @media (max-width: 768px) {
        max-height: 40%;
    }
`;

const MediaImage = styled.img`
    max-width: 100%;
    height: 100%;
    object-fit: cover;
`;
const MediaPdf = styled.embed`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const MediaVideo = styled.video`
    max-width: 100%;
    max-height: 100%;
`;

const AudioWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`;

const AudioThumbnail = styled.img`
    width: 53%;
    height: 53%;
    margin-bottom: 12px;
`;

const CommentSection = styled.div`
    width: 40%;
    display:flex;
    flex-direction:column;
    background-color: #fff;
    border-radius: 8px;
    border: 1px solid #ddd;
    
    @media (max-width: 768px) {
        width: 100%;
        max-height: 50%;
    }
`;

const Caption = styled.p`
    padding:10px;
    flex:1;
    font-size: 14px;
    margin: 8px 0;
    color: #333;
`;


const NavButton = styled.button`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.5);
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
`;

const NavLeftButton = styled(NavButton)`
    left: 20px;
`;

const NavRightButton = styled(NavButton)`
    right: 10px;
`;

const HashtagsContainer = styled.div`
    padding: 0 10px 10px 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
`;

const Hashtag = styled.span`
    color: #006D77;
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
    &:hover {
        text-decoration: underline;
    }
`;
const MobileUserDetails = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: block;
    width: 100%;
  }
`;

const DesktopUserDetails = styled.div`
  display: block;
  @media (max-width: 768px) {
    display: none;
  }
`;


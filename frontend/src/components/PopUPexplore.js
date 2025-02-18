import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import default_user from "../assets/default_user.jpg";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { FaHeart, FaRegComment, FaPaperPlane, FaBookmark } from "react-icons/fa";
import disk from "../assets/disk.jpg";

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
`;

const ModalContent = styled.div`
    background-color: white;
    display: flex;
    flex-direction: row;
    width: 50%;
    height: 60%;
    
    overflow: hidden;
    position: relative;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 24px;
    background: none;
    border: none;
    cursor: pointer;
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
`;

const MediaImage = styled.img`
    max-width: 100%;
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
    background-color: #fff;
    border-radius: 8px;
    border: 1px solid #ddd;
`;



const Caption = styled.p`
    font-size: 14px;
    margin: 8px 0;
    color: #333;
`;

const StatsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 12px 0;
    padding-bottom: 12px;
    border-bottom: 1px solid #ddd;
`;

const StatItem = styled.div`
    display: flex;
    align-items: center;
    font-size: 14px;
    margin-right: 16px;

    svg {
        margin-right: 6px;
        color: #555;
    }
`;

const CommentList = styled.div`
    margin-top: 12px;
`;

const Comment = styled.div`
    display: flex;
    align-items: flex-start;
    margin-bottom: 8px;
`;

const CommentText = styled.div`
    margin-left: 12px;
`;

const CommentUser = styled.span`
    font-weight: bold;
    font-size: 14px;
`;

const CommentTime = styled.p`
    font-size: 12px;
    color: #777;
    margin: 2px 0;
`;

const CommentInputContainer = styled.div`
    display: flex;
    align-items: center;
    margin-top: 16px;
   position: relative;
   bottom:0;
`;

const CommentInput = styled.input`
    flex: 1;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 20px;
    font-size: 14px;
    outline: none;
`;

const PostButton = styled.button`
    margin-left: 8px;
    background-color: #008080;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 12px;
    font-size: 14px;
    cursor: pointer;
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
    left: 10px;
`;

const NavRightButton = styled(NavButton)`
    right: 10px;
`;

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

    useEffect(() => {
        const fetchRandomPosts = async () => {
            try {
                const response = await axios.get("/api/explore/explore-page?random=true");
                if (Array.isArray(response.data)) {
                    setPosts(response.data);
                    const initialPost = response.data.find((p) => p._id === postId);
                    setCurrentPost(initialPost || response.data[0]);
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
        <ModalOverlay onClick={() => navigate(-1)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <CloseButton onClick={() => navigate(-1)}>&times;</CloseButton>
                <MediaContainer>
                    {currentPost.content_type === "Image" && (
                        <MediaImage src={currentPost.url} alt="Post" />
                    )}
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
            <UserDetails>
                <UserImg src={default_user} alt="User" />
                <div>
                    <p style={{ fontWeight: "bold", fontSize: "16px" }}>Username.design</p>
                    <p style={{ fontSize: "12px", color: "#777" }}>2 hours ago</p>
                </div>
            </UserDetails>
            <Caption>
                This is a detailed caption for the post. It can contain multiple lines of text and will wrap around
                when it reaches the end of the container. #design #ui #ux #wireframe
                <br />
                <br />
                Lorem ipsum follow for more
                <br />
                Hehe
            </Caption>
            <StatsContainer>
                <div style={{ display: "flex" }}>
                    <StatItem>
                        <FaHeart /> 1.2K
                    </StatItem>
                    <StatItem>
                        <FaRegComment /> 234
                    </StatItem>
                    <StatItem>
                        <FaPaperPlane /> 56
                    </StatItem>
                </div>
                <FaBookmark />
            </StatsContainer>
            <CommentList>
                {comments.map((comment, index) => (
                    <Comment key={index}>
                        <UserImg src={default_user} alt="User" />
                        <CommentText>
                            <CommentUser>{comment.username}</CommentUser> {comment.text}
                            <CommentTime>{comment.time}</CommentTime>
                        </CommentText>
                    </Comment>
                ))}
            </CommentList>
            <CommentInputContainer>
                <CommentInput placeholder="Add a comment..." />
                <PostButton>Post</PostButton>
            </CommentInputContainer>
        </CommentSection>
                <NavLeftButton onClick={() => handleNavigate("prev")}>&lt;</NavLeftButton>
                <NavRightButton onClick={() => handleNavigate("next")}>&gt;</NavRightButton>
            </ModalContent>
        </ModalOverlay>
    );
};

export default PopUPexplore;

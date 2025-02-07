import React, { useEffect, useState } from "react";
import { useParams, useNavigate,useLocation } from "react-router-dom";
import axios from "axios";
import "../style/popupModal.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const PopUPexplore = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [currentPost, setCurrentPost] = useState(null);
    const location = useLocation();

    const closeModal = () => {
        
        if (location.state?.background) {
            console.log("HIIIIIIIIIIIIIIIIII",location.state?.background)
            navigate(location.state.background.pathname, { replace: true });// ✅ Return to the previous Explore state
        } else {
            
            navigate("/explore-page"); // If no state, go to explore normally
        }
    };

  
    useEffect(() => {
        const fetchRandomPosts = async () => {
            try {
                const response = await axios.get("/api/explore/explore-page?random=true");
                if (Array.isArray(response.data)) {
                    setPosts(response.data);
                    const initialPost = response.data.find((p) => p._id === postId);
                    setCurrentPost(initialPost || response.data[0]); // Show selected or first random post
                }
            } catch (error) {
                console.error("Error fetching posts:", error.response?.data || error.message);
            }
        };
        
        fetchRandomPosts();
    }, []); // Run only once when component mounts

    const handleNavigate = (direction) => {
        if (!posts.length || !currentPost) return;
        
        const currentIndex = posts.findIndex((p) => p._id === currentPost._id);
        if (currentIndex !== -1) {
            const newIndex = direction === "prev" ? currentIndex - 1 : currentIndex + 1;
            if (newIndex >= 0 && newIndex < posts.length) {
                setCurrentPost(posts[newIndex]); // Update state without refetching
                navigate(`/explore-page/${posts[newIndex]._id}`, { replace: true });
            }
        }
    };

    if (!currentPost) return <p>Loading...</p>;

    return (
        <div className="modal-overlay" onClick={() => navigate("/")}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <span className="close-btn" onClick={closeModal}>&times;</span>

                {posts.length > 1 && (
                    <>
                        {posts.findIndex((p) => p._id === currentPost._id) > 0 && (
                            <button className="nav-button left" onClick={() => handleNavigate("prev")}>
                                <FaArrowLeft />
                            </button>
                        )}
                        {posts.findIndex((p) => p._id === currentPost._id) < posts.length - 1 && (
                            <button className="nav-button right" onClick={() => handleNavigate("next")}>
                                <FaArrowRight />
                            </button>
                        )}
                    </>
                )}

                <div className="modal-body">
                    <div className="media-container">
                        {currentPost.content_type === "image" && <img src={currentPost.url} alt="Post" className="modal-media" />}
                        {currentPost.content_type === "documentary" && <video src={currentPost.url} controls autoPlay className="modal-media" />}
                        {currentPost.content_type === "reel" && <video src={currentPost.url} controls autoPlay className="modal-media" />}
                        {currentPost.content_type === "pdf" && <embed src={currentPost.url} className="modal-pdf" title="PDF Viewer"/>}
                    </div>

                    <div className="post-details">
                        <div className="post-header">
                            <img src={currentPost.user?.profilePicture || "https://via.placeholder.com/50"} alt="User" className="user-avatar" />
                            <span className="username">{currentPost.user?.username || "Unknown User"}</span>
                        </div>

                        <p className="likes">{currentPost.likes} Likes</p>
                        <div className="comments">
                            {currentPost.comments?.map((comment, index) => (
                                <p key={index}>
                                    <strong>{comment.username}</strong> {comment.text}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopUPexplore;

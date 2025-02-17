import React, { useEffect, useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import axios from "axios";
import "../style/popupModal.css";
import default_user from "../assets/default_user.jpg";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import disk from "../assets/disk.jpg";
import '../App.css'

const PopUPexplore = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [currentPost, setCurrentPost] = useState(null);
    const {postId}=useParams()

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get("/api/explore/explore-page");
                if (Array.isArray(response.data)) {
                    setPosts(response.data);
                    const initialPost = response.data.find((p) => p._id === postId);
                    setCurrentPost(initialPost || response.data[0]);
                }
            } catch (error) {
                console.error("Error fetching posts:", error.response?.data || error.message);
            }
        };
        fetchPosts();
    }, [postId]);

    const handleNavigate = (direction) => {
        if (!posts.length || !currentPost) return;

        const currentIndex = posts.findIndex((p) => p._id === currentPost._id);
        if (currentIndex !== -1) {
            const newIndex = direction === "prev" ? currentIndex - 1 : currentIndex + 1;
            if (newIndex >= 0 && newIndex < posts.length) {
                setCurrentPost(posts[newIndex]);
                navigate(`/explore-page/${posts[newIndex]._id}`);
            }
        }
    };

    if (!currentPost) return <p>Loading...</p>;

    return (
        <div className="modal-overlay" onClick={() => navigate(-1)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn"  onClick={() => navigate(-1)}>&times;</button>

                {/* User Details */}
                <div className="user-details">
                    <img src={currentPost.userImage || default_user} alt="User" className="user-img" />
                    <div>
                        <p className="user-name">{currentPost.userName || "Unknown User"}</p>
                        <p className="post-date">{new Date(currentPost.createdAt).toDateString()}</p>
                    </div>
                </div>

                {/* Content Display */}
                <div className="media-container">
                    {currentPost.content_type === "Image" && (
                        <img src={currentPost.url} alt="Post" className="modal-image" />
                    )}
                    {["Documentary", "Reel"].includes(currentPost.content_type) && (
                        <video src={currentPost.url} controls className="modal-video" />
                    )}
                    {currentPost.content_type === "Pdf" && (
                        <embed src={currentPost.url} className="modal-pdf" />
                    )}
                    {currentPost.content_type === "Audio" && (
                        <div className="audio-wrapper">
                            <img src={disk} alt="Audio Disk" className="audio-thumbnail" />
                            <audio controls src={currentPost.url} className="audio-player"></audio>
                        </div>
                    )}
                </div>

                {/* Navigation Buttons */}
                <div className="navigation">
                    <button
                        className="nav-btn left"
                        onClick={() => handleNavigate("prev")}
                        disabled={posts.findIndex((p) => p._id === currentPost._id) === 0}
                    >
                        <FaArrowLeft />
                    </button>
                    <button
                        className="nav-btn right"
                        onClick={() => handleNavigate("next")}
                        disabled={posts.findIndex((p) => p._id === currentPost._id) === posts.length - 1}
                    >
                        <FaArrowRight />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PopUPexplore;

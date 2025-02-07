import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from "react-router-dom";
import '../style/explore.css';

const Explore = () => {
    const [posts, setPosts] = useState([]);
    const videoRefs = useRef({});
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('/api/explore/explore-page');
                if (Array.isArray(response.data)) {
                    setPosts(arrangePosts(response.data));
                    console.log(arrangePosts)
                } else {
                    console.error('Response data is not an array:', response.data);
                }
            } catch (error) {
                console.error('Error fetching posts:', error.response?.data || error.message);
            }
        };

        fetchPosts();
    }, []);

    const handleVideoPreview = (id) => {
        const video = videoRefs.current[id];
        if (video) {
            video.play();
            setTimeout(() => {
                video.pause();
                video.currentTime = 0;
            }, 5000);
        }
    };

    const renderPost = (post) => {
        switch (post.content_type) {
            case 'image':
                return <img src={post.url} alt="Post" className='explore-image' />;
            case 'reel':
                return (
                    <video
                        ref={(el) => (videoRefs.current[post._id] = el)}
                        src={post.url}
                        onMouseEnter={() => handleVideoPreview(post._id)}
                        className='explore-reel'
                        muted
                    />
                );
            case 'documentary':
                return (
                    <div className="documentary-wrapper">
                        <video src={post.url} className='explore-image' muted />
                        <span className="documentary-icon">🎥</span>
                    </div>
                );
            case 'pdf':
                return <iframe src={post.url} title="PDF Viewer" className='explore-pdf' />;
            default:
                return <p className="text-red-500">Unsupported file type</p>;
        }
    };

    const arrangePosts = (posts) => {
        let pdfs = posts.filter(post => post.content_type === 'pdf');
        let reels = posts.filter(post => post.content_type === 'reel');
        let otherPosts = posts.filter(post => !['pdf', 'reel'].includes(post.content_type));
    
        let arrangedPosts = [];
        let usedOtherIndexes = new Set(); // Track used otherPosts to prevent duplicates
    
        let pdfIndex = 0, reelIndex = 0, otherIndex = 0;
    
        while (arrangedPosts.length < 120) {
            // Add 4 other posts
            for (let i = 0; i < 4; i++) {
                if (otherIndex < otherPosts.length && !usedOtherIndexes.has(otherIndex)) {
                    arrangedPosts.push(otherPosts[otherIndex]);
                    usedOtherIndexes.add(otherIndex);
                    otherIndex++;
                }
            }
    
            // Add a PDF if available, else add 4 more otherPosts
            if (pdfIndex < pdfs.length) {
                arrangedPosts.push(pdfs[pdfIndex++]);
            } else {
                for (let i = 0; i < 4; i++) {
                    if (otherIndex < otherPosts.length && !usedOtherIndexes.has(otherIndex)) {
                        arrangedPosts.push(otherPosts[otherIndex]);
                        usedOtherIndexes.add(otherIndex);
                        otherIndex++;
                    }
                }
            }
    
            // Add another other post if available
            if (otherIndex < otherPosts.length && !usedOtherIndexes.has(otherIndex)) {
                arrangedPosts.push(otherPosts[otherIndex]);
                usedOtherIndexes.add(otherIndex);
                otherIndex++;
            }
    
            // Add a reel if available, else add 2 more otherPosts
            if (reelIndex < reels.length) {
                arrangedPosts.push(reels[reelIndex++]);
            } else {
                for (let i = 0; i < 2; i++) {
                    if (otherIndex < otherPosts.length && !usedOtherIndexes.has(otherIndex)) {
                        arrangedPosts.push(otherPosts[otherIndex]);
                        usedOtherIndexes.add(otherIndex);
                        otherIndex++;
                    }
                }
            }
    
            // Add 6 other posts
            for (let i = 0; i < 6; i++) {
                if (otherIndex < otherPosts.length && !usedOtherIndexes.has(otherIndex)) {
                    arrangedPosts.push(otherPosts[otherIndex]);
                    usedOtherIndexes.add(otherIndex);
                    otherIndex++;
                }
            }
    
            // Add another reel if available, else add 2 more otherPosts
            if (reelIndex < reels.length) {
                arrangedPosts.push(reels[reelIndex++]);
            } else {
                for (let i = 0; i < 2; i++) {
                    if (otherIndex < otherPosts.length && !usedOtherIndexes.has(otherIndex)) {
                        arrangedPosts.push(otherPosts[otherIndex]);
                        usedOtherIndexes.add(otherIndex);
                        otherIndex++;
                    }
                }
            }
    
            // Add 2 other posts
            for (let i = 0; i < 2; i++) {
                if (otherIndex < otherPosts.length && !usedOtherIndexes.has(otherIndex)) {
                    arrangedPosts.push(otherPosts[otherIndex]);
                    usedOtherIndexes.add(otherIndex);
                    otherIndex++;
                }
            }
    
            // Stop if no more posts are left to add
            if (pdfIndex >= pdfs.length && reelIndex >= reels.length && otherIndex >= otherPosts.length) {
                break;
            }
        }
    
        return arrangedPosts.slice(0, 120);
    };
    
    
    
    
    
    
    
    
    
    
    return (
        <div className="explore-grid">
            {posts.length > 0 ? (
                posts.map(post => (
                    <div
                        key={post._id}
                        className={`explore-item ${
                            post.content_type === 'image' ? 'explore-image' : ''} ${
                            post.content_type === 'reel' ? 'explore-reel' : ''} ${
                            post.content_type === 'documentary' ? 'explore-image' : ''} ${
                            post.content_type === 'pdf' ? 'explore-pdf' : ''}`}
                    >
                        <Link to={`/explore-page/${post._id}`} className='link'>
                            {post.url ? renderPost(post) : <p>Post content unavailable</p>}
                        </Link>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500">No posts available</p>
            )}
        </div>
    );
};

export default Explore;

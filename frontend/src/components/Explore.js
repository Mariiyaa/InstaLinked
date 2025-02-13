import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {  Link, useNavigate } from "react-router-dom";
import '../style/explore.css';
import AppNavbar from './AppNavbar'

const Explore = () => {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const videoRefs = useRef({});
    const navigate=useNavigate()
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('/api/explore/explore-page');
                if (Array.isArray(response.data)) {
                    const arranged = arrangePosts(response.data);
                    setPosts(arranged);
                    setFilteredPosts(arranged); 
                    
                } else {
                    console.error('Response data is not an array:', response.data);
                }
            } catch (error) {
                console.error('Error fetching posts:', error.response?.data || error.message);
            }
        };

        fetchPosts();
    }, []);
  // Filter posts when category changes
  useEffect(() => {
    if (selectedCategory) {
        // Only show posts that match the selected category
        setFilteredPosts(
            posts.filter(
                (post) =>
                    post.category && post.category.toLowerCase() === selectedCategory.toLowerCase()
            )
        );
    } else {
        // Show all posts when no category is selected
        setFilteredPosts(posts);
    }
}, [selectedCategory, posts]);
    

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
                return (
                    <div 
                        className="explore-pdf-wrapper"
                        onClick={() => navigate(`/explore-page/${post._id}`)}
                        style={{ position: 'relative', cursor: 'pointer' }}
                    >
                        {/* Disable editing tools & sidebar */}
                        <iframe 
                            src={`${post.url}#toolbar=0&navpanes=0&scrollbar=0`} 
                            title="PDF Viewer" 
                            className='explore-pdf' 
                        />
                        {/* Transparent Clickable Overlay */}
                        <div 
                            style={{
                                position: 'absolute',
                                top: 0,
                                border:'transparent',
                                left: 0,
                                width: '100%',
                                height: '100%',
                                background: 'transparent'
                            }}
                        ></div>
                    </div>
                );
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
        <>
        <AppNavbar />
        <div className="filter-buttons">
            {['Heritage', 'Music', 'Art', 'Story', 'Research'].map(category => (
                <button
                    key={category}
                    className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                >
                    {category}
                </button>
            ))}
        </div>
        <div className="explore-grid">
        
            {filteredPosts.length > 0 ? (
                filteredPosts.map(post => (
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
        </>
        
    );
};

export default Explore;

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from "react-router-dom";
import '../style/explore.css';
import AppNavbar from './AppNavbar';
import disk from '../assets/disk.jpg'

const Explore = () => {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const videoRefs = useRef({});
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('/api/explore/explore-page');
                if (Array.isArray(response.data)) {
                    const arranged = arrangePosts(response.data); // Store arranged posts
                    setPosts(arranged);
                    setFilteredPosts(arranged);
                } else {
                    console.error('Response data is not an array:', response.data);
                }
            } catch (error) {
                console.error('Error fetching posts:', error.response?.data || error.message);
            }
        }
fetchPosts()
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
            case 'Image':
                return <img src={post.url} alt="Post" className='explore-image' />;
            case 'Reel':
                return (
                    <video
                        ref={(el) => (videoRefs.current[post._id] = el)}
                        src={post.url}
                        onMouseEnter={() => handleVideoPreview(post._id)}
                        className='explore-reel'
                        muted
                    />
                );
            case 'Documentary':
                return (
                    <div className="documentary-wrapper">
                        <video src={post.url} className='explore-doc' muted />
                        <span className="documentary-icon">🎥</span>
                    </div>
                );
            case 'Pdf':
                return (
                    <div 
                        className="explore-pdf-wrapper"
                        style={{ position: 'relative', cursor: 'pointer' }}
                    >
                        <iframe 
                            src={`${post.url}#toolbar=0&navpanes=0&scrollbar=0`} 
                            title="PDF Viewer" 
                            className='explore-pdf' 
                        />
                    </div>
                    
                );
                case 'Audio':
                    return (
                        <div className="relative w-full max-w-md">
                            {/* Background Image */}
                            <img 
                                src={disk} 
                                alt="Audio thumbnail"
                                className="w-full h-48 object-cover rounded-lg"
                            />
                            
                            {/* Audio Player Overlay */}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
                                <audio 
                                    controls
                                    src={post.url}
                                    className="w-[90%]"
                                >
                                    Your browser does not support the audio element.
                                </audio>
                            </div>
                        </div>
                    );

            default:
                return <p className="text-red-500">Unsupported file type</p>;
        }
    };

    const arrangePosts = (posts) => {
        let pdfs = posts.filter(post => post.content_type === 'Pdf');
        let reels = posts.filter(post => post.content_type === 'Reel');
        let otherPosts = posts.filter(post => !['Pdf', 'Reel'].includes(post.content_type));
    
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
            <div>
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
                                    post.content_type === 'Image' ? 'explore-image' : ''} ${
                                    post.content_type === 'Reel' ? 'explore-reel' : ''} ${
                                    post.content_type === 'Documentary' ? 'explore-doc' : ''} ${
                                    post.content_type === 'Pdf' ? 'explore-pdf' : ''}`}
                            >
                                <div
                                   onClick={() => navigate(`/p/${post._id}`, { state: { background: location } })}
                                    className='link'
                                >
                                    {post.url ? renderPost(post) : <p>Post content unavailable</p>}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">No posts available</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default Explore;
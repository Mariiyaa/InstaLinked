import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FollowButton = ({ targetUserId, onFollowChange }) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [showUnfollow, setShowUnfollow] = useState(false);
    const [loggedInUserId, setLoggedInUserId] = useState(null);

    useEffect(() => {
        // Get logged-in user from sessionStorage
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setLoggedInUserId(user._id);
            // Check if the target user is in the following list
            setIsFollowing(user.following?.includes(targetUserId));
        }
    }, [targetUserId]);

    useEffect(() => {
        // Check initial follow status from the server
        const checkFollowStatus = async () => {
            if (!loggedInUserId) return;
            
            try {
                const response = await axios.get(`/api/follow/status/${targetUserId}`, {
                    params: { followerId: loggedInUserId },
                    withCredentials: true
                });
                setIsFollowing(response.data.isFollowing);
                
                // Update sessionStorage if server state differs
                const storedUser = JSON.parse(sessionStorage.getItem("user") || "{}");
                if (response.data.isFollowing !== storedUser.following?.includes(targetUserId)) {
                    const updatedFollowing = response.data.isFollowing
                        ? [...(storedUser.following || []), targetUserId]
                        : (storedUser.following || []).filter(id => id !== targetUserId);
                    
                    sessionStorage.setItem("user", JSON.stringify({
                        ...storedUser,
                        following: updatedFollowing
                    }));
                }
            } catch (error) {
                console.error('Error checking follow status:', error);
            }
        };

        checkFollowStatus();
    }, [targetUserId, loggedInUserId]);

    const handleFollow = async () => {
        if (!loggedInUserId) return;

        try {
            const response = await axios.post(`/api/follow/${targetUserId}`, {
                followerId: loggedInUserId
            }, {
                withCredentials: true
            });

            if (response.status === 200) {
                setIsFollowing(true);
                if (onFollowChange) onFollowChange(true);

                // Update sessionStorage
                const storedUser = JSON.parse(sessionStorage.getItem("user") || "{}");
                const updatedFollowing = [...(storedUser.following || []), targetUserId];
                sessionStorage.setItem("user", JSON.stringify({
                    ...storedUser,
                    following: updatedFollowing
                }));
            }
        } catch (error) {
            console.error('Error following user:', error);
        }
    };

    const handleUnfollow = async () => {
        if (!loggedInUserId) return;

        try {
            const response = await axios.delete(`/api/follow/${targetUserId}`, {
                data: { followerId: loggedInUserId },
                withCredentials: true
            });

            if (response.status === 200) {
                setIsFollowing(false);
                setShowUnfollow(false);
                if (onFollowChange) onFollowChange(false);

                // Update sessionStorage
                const storedUser = JSON.parse(sessionStorage.getItem("user") || "{}");
                const updatedFollowing = (storedUser.following || []).filter(id => id !== targetUserId);
                sessionStorage.setItem("user", JSON.stringify({
                    ...storedUser,
                    following: updatedFollowing
                }));
            }
        } catch (error) {
            console.error('Error unfollowing user:', error);
        }
    };

    const buttonStyle = {
        padding: '10px 15px',
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background-color 0.2s',
        ...(!isFollowing ? {
            backgroundColor: '#006d77',
            color: '#fff',
        } : {
            backgroundColor: '#f4f4f4',
            color: '#333',
            border: '1px solid #ddd'
        })
    };

    const unfollowStyle = {
        ...buttonStyle,
        backgroundColor: '#ff3b30',
        color: '#fff'
    };

    if (isFollowing) {
        return (
            <button
                style={showUnfollow ? unfollowStyle : buttonStyle}
                onMouseEnter={() => setShowUnfollow(true)}
                onMouseLeave={() => setShowUnfollow(false)}
                onClick={handleUnfollow}
            >
                {showUnfollow ? 'Unfollow' : 'Following'}
            </button>
        );
    }

    return (
        <button style={buttonStyle} onClick={handleFollow}>
            Follow
        </button>
    );
};

export default FollowButton;
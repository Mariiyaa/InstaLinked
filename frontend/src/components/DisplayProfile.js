import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function DisplayProfile() {
  const [video, setVideo] = useState(null);
  const [bio, setBio] = useState(null);
  const [link, setLink] = useState(null);
  const videoRef = useRef(null); // Reference to the video element

  useEffect(() => {
    // Fetch data from API
    const fetchLinks = async () => {
      try {
        const response = await axios.get('api/profile/display-profile'); // Replace with your API URL
        setLink(response.data.externalLinks);
        setVideo(response.data.profileImage);
        setBio(response.data.bio);
      } catch (err) {
        console.log(err);
      }
    };

    fetchLinks();
  }, []);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play(); // Play the video
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause(); // Pause the video
    }
  };

  return (
    <div>
      {video ? (
        <div>
          <video ref={videoRef} src={video} alt="video" height="200" controls={false} />
          {/* Custom controls */}
          <div>
            <button onClick={handlePlay}>Play</button>
            <button onClick={handlePause}>Pause</button>
          </div>
        </div>
      ) : (
        <p>Video not available</p>
      )}
      <h1>{bio}</h1>
      <a href={link}>{link}</a>
    </div>
  );
}

export default DisplayProfile;

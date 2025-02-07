import React, { useState } from "react";
import axios from "axios";

const CreateProfile = () => {
  const [userProfile, setUserProfile] = useState({
    fullname:"",
    profileImage: null,
    bio: "",
    externalLinks: [""],
  });
  const [message, setMessage] = useState("");

  const handleExternalLinkChange = (index, value) => {
    userProfile.externalLinks[index] = value; 
    setUserProfile({ ...userProfile });
  };

  const addExternalLink = () => {
    setUserProfile((prevState) => ({
      ...prevState,
      externalLinks: [...prevState.externalLinks, ""],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(userProfile);

    try {
      const formData = new FormData();
      formData.append("fullname", userProfile.fullname);
      formData.append("profileImage", userProfile.profileImage); // Append the file
      formData.append("bio", userProfile.bio); // Append the bio
      formData.append("externalLinks", JSON.stringify(userProfile.externalLinks)); // Append external links as a JSON string

      const response = await axios.post("api/profile/create-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(response.data.message);
    } catch (error) {
      setMessage("Error uploading profile.");
      console.log(error);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
      <h1>Upload Your Profile</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Profile Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setUserProfile({ ...userProfile, profileImage: e.target.files[0] })
            }
            required
          />
        </div>

        <div>
          <label>Full name:</label>
          <input
            type="text"
            onChange={(e) =>
              setUserProfile({ ...userProfile, fullname: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label>About me :</label>
          <textarea
            value={userProfile.bio}
            onChange={(e) =>
              setUserProfile({ ...userProfile, bio: e.target.value })
            }
            placeholder="Write about yourself..."
            required
          />
        </div>

        <div>
          <label>portfolio Links:</label>
          {userProfile.externalLinks.map((link, index) => (
            <div key={index}>
              <input
                type="url"
                value={link}
                onChange={(e) => handleExternalLinkChange(index, e.target.value)}
                placeholder="Link to your work"
              />
            </div>
          ))}
          <button type="button" onClick={addExternalLink}>
            Add More Links
          </button>
        </div>

        <button type="submit">Upload Profile</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateProfile;

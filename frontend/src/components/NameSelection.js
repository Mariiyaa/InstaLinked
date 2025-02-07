import { useState } from "react";
import { useNavigate,useLocation } from "react-router-dom";

const NameSelection = () => {
  const [name, setName] = useState("");
  const location = useLocation();
  const email = location.state?.email || localStorage.getItem('userEmail');


     const navigate = useNavigate();
  const handleSubmit = () => {
    navigate('/persona-selection',{ state:{email,name} });
  };

  return (
    <div className="container">
      <h2>What would you like to be known as?</h2>
      <input
        type="text"
        placeholder="Enter your name..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input-field"
      />
      <button onClick={handleSubmit} className="submit-btn">
        Submit
      </button>
    </div>
  );
};

export default NameSelection;

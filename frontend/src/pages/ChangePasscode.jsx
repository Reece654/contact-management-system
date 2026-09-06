import { useState} from "react";
import { useNavigate, Link } from "react-router-dom";

// form for user to change their passcode
function ChangePasscode() {
  const [oldPasscode, setOldPasscode] = useState("");
  const [newPasscode, setNewPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // confirms passcode is correct and then sends the new passcode to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // If it doesnt match it displays an error message
    if (newPasscode !== confirmPasscode) {
      setError("Passcodes do not match");
      return;
    }

    // sends the old and new passcode as json file to the backend to confirm the old passcode is correct
    // then changes it to the new one
    const response = await fetch("http://127.0.0.1:5000/api/auth/change", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({currentPasscode: oldPasscode, newPasscode }),
    });

    // checks with the backend to see if the passcode was changed successfully before taking the user back to contacts
    if (response.ok) {
      navigate("/contacts");
    } else {
      const data = await response.json();
      setError(data.message || "Failed to change passcode");
    } 
  };

  // re useble components for styling
  // change passcode form that has current passcode, new passcode and comfirmation passcode
  return (
    <div>
      {/* adds the back arrow in the header, takes the user back to the contact list */}
      <div className="page-header">
        <Link to="/contacts" className="back-arrow">‹</Link>
        <h1>Change Passcode</h1>
      </div>
      <div className="card">
        {/* adds the forms fields and sets the values */}
        <form onSubmit={handleSubmit}>
          {/* form field for Current passcode */}
          <label className="input-label">Current Passcode</label>
          <input
            className="input-field"
            type="password"
            value={oldPasscode}
            onChange={(e) => setOldPasscode(e.target.value)}
          />

          {/* form field for new passcode */}
          <label className="input-label">New Passcode</label>
          <input
            className="input-field"
            type="password"
            value={newPasscode}
            onChange={(e) => setNewPasscode(e.target.value)}
          />

          {/* form field for comfirmation passcode */}
          <label className="input-label">Confirm New Passcode</label>
          <input
            className="input-field"
            type="password"
            value={confirmPasscode}
            onChange={(e) => setConfirmPasscode(e.target.value)}
          />

          {/* shows an error if the passcodes dont match or the backend fails to save */}
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="btn-primary">Change Passcode</button>
        </form>
      </div>
    </div>
  );
}

// makes this component available to import in app.jsx
export default ChangePasscode;  

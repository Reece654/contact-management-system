import { useState} from "react";
import { useNavigate } from "react-router-dom";

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

  // change passcode form with fields for old passcode, new passcode and confirm new passcode
  return (
    <form onSubmit={handleSubmit}>
      <h1>Change Passcode</h1>
      <input
        type="password"
        value={oldPasscode}
        onChange={(e) => setOldPasscode(e.target.value)}
        placeholder="Current Passcode"
      />  
    <input
      type="password"
      value={newPasscode}
      onChange={(e) => setNewPasscode(e.target.value)}
      placeholder="New Passcode"
    />
    <input
      type="password"
      value={confirmPasscode}
      onChange={(e) => setConfirmPasscode(e.target.value)}
      placeholder="Confirm New Passcode"
    />
    {error && <p>{error}</p>}
    <button type="submit">Change Passcode</button>
  </form>
  );
}

// makes this component available to import in app.jsx
export default ChangePasscode;  

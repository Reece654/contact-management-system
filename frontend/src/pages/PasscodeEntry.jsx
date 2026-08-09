import { useState } from "react";
import { useNavigate } from "react-router-dom";

// simple passcode entry page, that checks the typed passcode against the backend
function PasscodeEntry() {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // sends the typed passcode to the backend and checks if its correct
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // sends the passcode to the verify the route and waits for a response
    const response = await fetch("http://127.0.0.1:5000/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode }),
    });

    // turns the response into a normal js object we can read
    const data = await response.json();

    // if the backend says success, go to the contact list page
    if (data.success) {
      navigate("/contacts");
    } else {
      setError(data.message || "Incorrect passcode");
    }
  };

  // the passcode input box and unlock button
  // shows an error message if one of these exists
  return (
    <form onSubmit={handleSubmit}>
      <h1>Enter Passcode</h1>
      <input
        type="password"
        value={passcode}
        onChange={(e) => setPasscode(e.target.value)}
        placeholder="Passcode"
      />
      <button type="submit">Unlock</button>
      {error && <p>{error}</p>}
    </form>
  );
}

// makes this component available to import in app.jsx
export default PasscodeEntry;
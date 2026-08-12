import { useState } from "react";
import { useNavigate } from "react-router-dom";

// form for user to create a new contact
function AddContact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // sends the new contact to the backend then takes the user back to the contact list
  const handleSubmit = async (e) => {
    e.preventDefault();

    // sends the new contact to the backend 
    const response = await fetch("http://127.0.0.1:5000/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, address }),
    });

    // checks with the backend to if the contact actually got added before navigating the user back to contacts
    if (response.ok) {
      navigate("/contacts");
    } else {
      const data = await response.json();
      setError(data.message || "Failed to save contact");
    }
  };

  // the add contact form with a section for all details
  return (
    <form onSubmit={handleSubmit}>
      <h1>Add Contact</h1>
      {/* user input details for name, email, phone and address in each section */}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone number"
      />
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Address"
      />
      {/* clicking save runs the const handleSubmit in the code above, then navigates the user back to contacts*/}
      {/* we dont have to redirect the user here since its handled in the function above*/}
      {/* shows an error if the backend doesnt save */}
      {error && <p>{error}</p>}
      <button type="submit">Save</button>
    </form>
  );
}

// makes this component available to import in app.jsx
export default AddContact;
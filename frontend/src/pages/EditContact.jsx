import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// update contacts details
function EditContact() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  // gets the current details of the contact to pre fill the form
  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/contacts/${id}`)
      // gets the response from the backend and turns it to json
      // inserts the current details into the form
      .then((res) => res.json())
      .then((data) => {
        setName(data.name);
        setEmail(data.email);
        setPhone(data.phone);
        setAddress(data.address);
      });
      // will run useeffect again if the user selects another contact changing the id
  }, [id]);

  // send the updated details to the backend then takes the user back to the contact list
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const response = await fetch(`http://127.0.0.1:5000/api/contacts/${id}`, {
      // uses put method to update the contact details in the backend
      method: "PUT",
      // makes the content type json 
      headers: { "Content-Type": "application/json" },
      // send the details to the backend
      body: JSON.stringify({ name, email, phone, address }),
    });

    if (response.ok) {
      navigate(`/contacts/${id}`);
    } else {
      const data = await response.json();
      setError(data.message || "Failed to update contact");
    }
  };

  // the edit contact form with a section for all details
  return (
    <form onSubmit={handleSubmit}>
      <h1>Edit Contact</h1>
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
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone"
      />
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Address"
      />
      {error && <p>{error}</p>}
      <button type="submit">Update Contact</button>
    </form>
  );
}

// makes this component available to import in app.jsx
export default EditContact;
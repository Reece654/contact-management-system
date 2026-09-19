import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

// I was able to resuse commponets from AddContacts.jsx

// gets the contacts initials if there is no profile picture to show
function getInitials(name) {
  if (!name) return "";
  const parts = name.trim().split(" ");
  const first = parts[0]?.[0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

// update contacts details
function EditContact() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  // holds the contacts file upload filename as read only
  const [profilePicture, setProfilePicture] = useState("")
  const [error, setError] = useState("");


  // gets the current details of the contact to pre fill the form
  useEffect(() => {
    fetch(`http://contact-management-backend-env.eba-3desc6qg.ap-southeast-6.elasticbeanstalk.com/api/contacts/${id}`)
      // gets the response from the backend and turns it to json
      // inserts the current details into the form
      .then((res) => res.json())
      .then((data) => {
        setName(data.name);
        setEmail(data.email);
        setPhone(data.phone);
        setAddress(data.address);
        setProfilePicture(data.profile_Picture);
      });
      // will run useeffect again if the user selects another contact changing the id
  }, [id]);

  // send the updated details to the backend then takes the user back to the contact list
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const response = await fetch(`http://contact-management-backend-env.eba-3desc6qg.ap-southeast-6.elasticbeanstalk.com/api/contacts/${id}`, {
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
    <div>
      {/* adds the back arrow in the header, takes the user back to the contact details page */}
      <div className="page-header">
        <Link to={`/contacts/${id}`} className="back-arrow">‹</Link>
        <h1>Edit Contact</h1>
      </div>
      <div className="card">
        {/* shows the current profile picture, read only, cant be changed on this page */}
        {profilePicture ? (
          <img
            className="detail-profile-pic"
            src={`http://contact-management-backend-env.eba-3desc6qg.ap-southeast-6.elasticbeanstalk.com/uploads/${profilePicture}`}
            alt={name}
          />
        ) : (
          <span className="detail-profile-pic">{getInitials(name)}</span>
        )}

        {/* adds the form fields and sets the values */}
        <form onSubmit={handleSubmit}>
          <label className="input-label">Name</label>
          <input
            className="input-field"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label className="input-label">Email</label>
          <input
            className="input-field"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="input-label">Phone</label>
          <input
            className="input-field"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <label className="input-label">Address</label>
          <input
            className="input-field"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          {/* clicking update runs the const handleSubmit in the code above, then navigates the user back to the contact details page */}
          {/* we dont have to redirect the user here since its handled in the function above*/}
          {/* shows an error if the backend doesnt save */}
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="btn-primary">Update Contact</button>
        </form>
      </div>
    </div>
  );
}

// makes this component available to import in app.jsx
export default EditContact;
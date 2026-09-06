import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// form for user to create a new contact
function AddContact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  // holds the file the user uploads
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // sends the new contact to the backend then takes the user back to the contact list
  const handleSubmit = async (e) => {
    // stops the page from refreshing when the form is sent successfully
    e.preventDefault();
    // clears old error messages
    setError("");

    // form data is a container which allows us to sen a file and text together, which you cant do with json
    // new FormData() is the inbuilt function that creates the container then we add the text and file to our variable formData using append()
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    // if the user uploaded a image file its added, otherwise the backend will use the default 
    if (profilePicture) {
      // attaches the image upload if user added one, or will use default image
      formData.append("profilePicture", profilePicture);
    }

    //sens the form data to the backend to create a new contact
    const response = await fetch("http://127.0.0.1:5000/api/contacts", {
      // POST is used to create the new contact
      method: "POST",
      body: formData,
    });

    // confirms user was added with the backend then takes user back to the contact list
    if (response.ok) {
      navigate("/contacts");
    } else {
      const data = await response.json();
      // shows an error message if the backend fails to save the new contact
      setError(data.message || "Failed to add contact");
      }
  };

  // the add contact form with a section for all details
  return (
    <div>
      {/* adds the back arrow in the header */}
      <div className="page-header">
        <Link to="/contacts" className="back-arrow">‹</Link>
        <h1>Add Contact</h1>
      </div>

      {/* adds the + button for profile picture upload */}
      <div className="card">
        {/* clicking the circle opens the file upload */}
        {/* adds the + profilr picture */}
        <label className="profile-pic-upload">
          <span className="profile-pic-upload-icon">+</span>
          <input
            type="file"
            /* sets the profile picture when a file is selected */
            onChange={(e) => setProfilePicture(e.target.files[0])}
            style={{ display: "none" }}
          />
        </label>
        <p className="profile-pic-text">Add Profile Picture</p>

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

          {/* clicking save runs the const handleSubmit in the code above, then navigates the user back to contacts*/}
          {/* we dont have to redirect the user here since its handled in the function above*/}
          {/* shows an error if the backend doesnt save */}
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="btn-primary">Save</button>
        </form>
      </div>
    </div>
  );
}

// makes this component available to import in app.jsx
export default AddContact;
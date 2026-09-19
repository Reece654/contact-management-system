import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

// gets the contacts initials if no image was uploaded
function getInitials(name) {
  if (!name) return "";
  const parts = name.trim().split(" ");
  const first = parts[0]?.[0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

// shows the contacts full details with the links to edit or delete it
function ContactDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);

  // loads the contact from the backend using the id in the url
  useEffect(() => {
    fetch(`http://contact-management-backend-env.eba-3desc6qg.ap-southeast-6.elasticbeanstalk.com/api/contacts/${id}`)
      .then((res) => res.json())
      .then((data) => setContact(data));
  }, [id]);

  // sends a delete request to the backend then takes the user back to the contact list
  const handleDelete = async () => {
    await fetch(`http://contact-management-backend-env.eba-3desc6qg.ap-southeast-6.elasticbeanstalk.com/api/contacts/${id}`, {
      method: "DELETE",
    });
    navigate("/contacts");
  };

  // shows a loading message while the contact is still being fetched
  if (!contact) {
    return <p>Loading...</p>;
  }

  // the contacts details and the edit and delete controls
  return (
    <div>
      <div className="page-header">
        <Link to="/contacts" className="back-arrow">‹</Link>
        <h1>Contact</h1>
      </div>
      <div className="card">
        {contact.profile_picture ? (
          <img
            className="detail-profile-pic"
            src={`http://contact-management-backend-env.eba-3desc6qg.ap-southeast-6.elasticbeanstalk.com/uploads/${contact.profile_picture}`}
            alt={contact.name}
          />
        ) : (
          <span className="detail-profile-pic">{getInitials(contact.name)}</span>
        )}
        <p className="detail-name">{contact.name}</p>

        <div className="detail-fields">
          <div className="detail-field">
            <p className="detail-label">Email</p>
            <p className="detail-value">{contact.email}</p>
          </div>
          <div className="detail-field">
            <p className="detail-label">Phone</p>
            <p className="detail-value">{contact.phone}</p>
          </div>
          <div className="detail-field">
            <p className="detail-label">Address</p>
            <p className="detail-value">{contact.address}</p>
          </div>
        </div>

        <div className="detail-actions">
          <Link to={`/contacts/${id}/edit`} className="btn-outline btn-outline-primary">Edit</Link>
          <button onClick={handleDelete} className="btn-outline btn-outline-danger">Delete</button>
        </div>
      </div>
    </div>
  );
}

// makes this component available to import in app.jsx
export default ContactDetail;
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

// shows the contacts full details with links to edit or delete it
function ContactDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);

  // loads the contact from the backend using the id in the url
  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/contacts/${id}`)
      .then((res) => res.json())
      .then((data) => setContact(data));
  }, [id]);

  // sends a delete request to the backend then goes back to the contact list
  const handleDelete = async () => {
    await fetch(`http://127.0.0.1:5000/api/contacts/${id}`, {
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
      <h1>{contact.name}</h1>
      <p>Email: {contact.email}</p>
      <p>Phone: {contact.phone}</p>
      <p>Address: {contact.address}</p>
      <Link to={`/contacts/${id}/edit`}>Edit</Link>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}

// makes this component available to import in app.jsx
export default ContactDetail;
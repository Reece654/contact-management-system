import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// shows every saved contact in a simple list
function ContactList() {
  const [contacts, setContacts] = useState([]);

  // loads all contacts from the backend when the page first opens
  useEffect(() => {
    fetch("http://contact-management-backend-env.eba-3desc6qg.ap-southeast-6.elasticbeanstalk.com/api/contacts")
      .then((res) => res.json())
      .then((data) => setContacts(data));
  }, []);

  // Takes the contact initials to display in profile picture if no upload
  const getInitials = (name) => {
    // if the name is empty it returns empty instead of crashing
    if (!name) return "";
    // splits the contact name into multiple parts first and last name usually
    const parts = name.trim().split(" ");
    // if the contacts name is only one word it returns the first letter
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    // grabs the first letter of both first and last name capitalizes them and returns them as one string
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  // displays the page title, add contact link and the list of contacts with a links to each persons details
  return (
    <div>
      <div className="page-header contact-list-header">
        <h1>Contacts</h1>
        <Link to="/contacts/add" className="add-button">+</Link>
      </div>
      <div className="card">
        <Link to="/settings/passcode" className="settings-link">Change Passcode</Link>
        <ul className="contact-list">
          {contacts.map((contact) => (
            <li key={contact.id} className="contact-list-item">
              <Link to={`/contacts/${contact.id}`} className="contact-link">
                {contact.profile_picture ? (
                  <img 
                  className="profile-pic"
                  src={`http://contact-management-backend-env.eba-3desc6qg.ap-southeast-6.elasticbeanstalk.com/uploads/${contact.profile_picture}`}
                  alt={contact.name}
                  />
                ) : (
                  <span className="profile-pic">{getInitials(contact.name)}</span>
                )}
                <span className="contact-info">
                  <span className="contact-name">{contact.name}</span>
                  <span className="contact-phone">{contact.phone}</span>
                </span>
                <span className="nav-arrow">&#8250;</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// makes this component available to import in app.jsx
export default ContactList;
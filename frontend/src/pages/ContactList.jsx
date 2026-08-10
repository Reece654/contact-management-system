import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// shows every saved contact in a simple list
function ContactList() {
  const [contacts, setContacts] = useState([]);

  // loads all contacts from the backend when the page first opens
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/contacts")
      .then((res) => res.json())
      .then((data) => setContacts(data));
  }, []);

  // displays the page title, add contact link and the list of contacts with a links to each persons details
  return (
    <div>
      <h1>Contacts</h1>
      <Link to="/contacts/add">Add Contact</Link>
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <Link to={`/contacts/${contact.id}`}>
              {contact.name} - {contact.phone}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// makes this component available to import in app.jsx
export default ContactList;
import { useEffect, useState } from 'react';
import { getContacts, deleteContact } from '../services/ContactService';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);

  const fetchContacts = () => {
    getContacts()
      .then(res => setContacts(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = (id) => {
    deleteContact(id)
      .then(() => fetchContacts())
      .catch(err => console.log(err));
  };

  return (
    <div>
      <h2>Contact List</h2>
      <ul>
        {contacts.map(contact => (
          <li key={contact.id}>
            {contact.name} - {contact.email} - {contact.phone}
            <button onClick={() => handleDelete(contact.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactList;

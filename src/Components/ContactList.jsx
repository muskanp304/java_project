import React from 'react';

const ContactList = ({ contacts, onDelete, onEdit }) => {
  if (contacts.length === 0) return <p>No contacts yet.</p>;

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Name</th><th>Phone</th><th>Email</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {contacts.map(contact => (
          <tr key={contact.id}>
            <td>{contact.name}</td>
            <td>{contact.phone}</td>
            <td>{contact.email}</td>
            <td>
              <button className="btn btn-sm btn-warning me-2" onClick={() => onEdit(contact)}>Edit</button>
              <button className="btn btn-sm btn-danger" onClick={() => onDelete(contact.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ContactList;

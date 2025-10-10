import React from 'react';

const getAvatarUrl = (name) => {
  if (!name) {
    console.log("No name provided, default avatar");
    return 'https://ui-avatars.com/api/?name=Unknown&size=128&length=2&rounded=true';
  }
  const encodedName = encodeURIComponent(name);
  const url = `https://ui-avatars.com/api/?name=${encodedName}&size=128&length=2&rounded=true`;
  console.log("Generated avatar URL:", url);
  return url;
};

const ContactList = ({ contacts, onDelete, onEdit }) => {
  if (contacts.length === 0) return <p>No contacts yet.</p>;

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Avatar</th>
          <th>Name</th>
          <th>Phone</th>
          <th>Email</th>
          <th>Group</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {contacts.map(contact => (
          <tr key={contact.id}>
            <td>
              <img
                src={contact.avatar || getAvatarUrl(contact.name)}
                alt={`${contact.name} avatar`}
                width={40}
                height={40}
                style={{ borderRadius: '50%' }}
              />
            </td>
            <td>{contact.name}</td>
            <td>{contact.phone}</td>
            <td>{contact.email}</td>
            <td>{contact.group}</td>
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

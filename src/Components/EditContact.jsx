import React, { useState, useEffect } from 'react';

const EditContact = ({ contact, onUpdate, onClose }) => {
  const [name, setName] = useState(contact.name || '');
  const [phone, setPhone] = useState(contact.phone || '');
  const [email, setEmail] = useState(contact.email || '');
  const [group, setGroup] = useState(contact.group || '');
  const [avatar, setAvatar] = useState(contact.avatar || '');

  const defaultAvatar = 'https://example.com/default-avatar.png';

  useEffect(() => {
    setName(contact.name || '');
    setPhone(contact.phone || '');
    setEmail(contact.email || '');
    setGroup(contact.group || '');
    setAvatar(contact.avatar || '');
  }, [contact]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone) {
      alert("Name and Phone are required");
      return;
    }
    onUpdate({ 
      id: contact.id, 
      name, 
      phone, 
      email, 
      group,
      avatar: avatar || defaultAvatar
    });
  };

  return (
    <div className="card p-3 mb-3">
      <h3>Edit Contact</h3>
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input className="form-control mb-2" type="text" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
        <input className="form-control mb-2" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <select className="form-select mb-2" value={group} onChange={e => setGroup(e.target.value)}>
          <option value="">None</option>
          <option value="Family">Family</option>
          <option value="Friends">Friends</option>
          <option value="Work">Work</option>
        </select>
        <input className="form-control mb-2" type="text" placeholder="Avatar URL (optional)" value={avatar} onChange={e => setAvatar(e.target.value)} />
        <button className="btn btn-primary me-2" type="submit">Update</button>
        <button className="btn btn-secondary" type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default EditContact;

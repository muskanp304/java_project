import React, { useState } from 'react';

const AddContact = ({ onAdd, onClose }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [group, setGroup] = useState('');
  const [avatar, setAvatar] = useState('');

const defaultAvatar = 'https://ui-avatars.com/api/?name=Unknown&size=128&length=2&rounded=true';

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedPhone) {
      alert("Name and Phone are required!");
      return;
    }

    if (trimmedName.length < 2) {
      alert("Name must be at least 2 characters.");
      return;
    }

    if (!/^\d{10,}$/.test(trimmedPhone)) {
      alert("Phone must be at least 10 digits and numbers only.");
      return;
    }

    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      alert("Please enter a valid email address.");
      return;
    }

    onAdd({ 
      name: trimmedName, 
      phone: trimmedPhone, 
      email: trimmedEmail, 
      group,
      avatar: avatar || defaultAvatar 
    });

    setName('');
    setPhone('');
    setEmail('');
    setGroup('');
    setAvatar('');
  };

  return (
    <div className="card p-3 mb-3">
      <h3>Add Contact</h3>
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
        <button className="btn btn-success me-2" type="submit">Add</button>
        <button className="btn btn-secondary" type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default AddContact;

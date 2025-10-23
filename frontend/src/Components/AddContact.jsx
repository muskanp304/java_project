import React, { useState } from 'react';

const AddContact = ({ onAdd, onClose }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone) {
      alert("Name and Phone are required");
      return;
    }
    onAdd({ name, phone, email });
  };

  return (
    <div className="card p-3 mb-3">
      <h3>Add Contact</h3>
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input className="form-control mb-2" type="text" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
        <input className="form-control mb-2" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <button className="btn btn-success me-2" type="submit">Add</button>
        <button className="btn btn-secondary" type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default AddContact;

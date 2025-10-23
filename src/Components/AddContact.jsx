import React, { useState } from 'react';

const AddContact = ({ onAdd, onClose }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [group, setGroup] = useState('');

  const handleSubmit = async (e) => {
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

    let location = "Unknown Location";
    if (navigator.geolocation) {
      await new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition((pos) => {
          location = `Lat:${pos.coords.latitude.toFixed(2)}, Lng:${pos.coords.longitude.toFixed(2)}`;
          resolve();
        }, () => resolve());
      });
    }

    const createdAt = new Date().toLocaleString();

    onAdd({
      name: trimmedName,
      phone: trimmedPhone,
      email: trimmedEmail,
      group,
      location,
      createdAt,
    });

    setName('');
    setPhone('');
    setEmail('');
    setGroup('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>➕ Add New Contact</h3>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <input 
            className="form-control mb-3" 
            type="text" 
            placeholder="Full Name *" 
            value={name} 
            onChange={e => setName(e.target.value)} 
          />
          <input 
            className="form-control mb-3" 
            type="text" 
            placeholder="Phone Number *" 
            value={phone} 
            onChange={e => setPhone(e.target.value)} 
          />
          <input 
            className="form-control mb-3" 
            type="email" 
            placeholder="Email (optional)" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
          />
          <select 
            className="form-select mb-3" 
            value={group} 
            onChange={e => setGroup(e.target.value)}
          >
            <option value="">Select Group (optional)</option>
            <option value="Family">👨‍👩‍👧 Family</option>
            <option value="Friends">👥 Friends</option>
            <option value="Work">💼 Work</option>
          </select>
          
          <div className="modal-actions">
            <button className="btn btn-success" type="submit">💾 Save Contact</button>
            <button className="btn btn-secondary" type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddContact;

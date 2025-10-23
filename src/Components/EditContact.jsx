import React, { useState, useEffect } from 'react';

const EditContact = ({ contact, onUpdate, onClose }) => {
  const [name, setName] = useState(contact.name || '');
  const [phone, setPhone] = useState(contact.phone || '');
  const [email, setEmail] = useState(contact.email || '');
  const [group, setGroup] = useState(contact.group || '');

  useEffect(() => {
    setName(contact.name || '');
    setPhone(contact.phone || '');
    setEmail(contact.email || '');
    setGroup(contact.group || '');
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
      location: contact.location,
      createdAt: contact.createdAt,
      history: contact.history,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>✏️ Edit Contact</h3>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <input 
            className="form-control mb-3" 
            type="text" 
            placeholder="Full Name" 
            value={name} 
            onChange={e => setName(e.target.value)} 
          />
          <input 
            className="form-control mb-3" 
            type="text" 
            placeholder="Phone Number" 
            value={phone} 
            onChange={e => setPhone(e.target.value)} 
          />
          <input 
            className="form-control mb-3" 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
          />
          <select 
            className="form-select mb-3" 
            value={group} 
            onChange={e => setGroup(e.target.value)}
          >
            <option value="">Select Group</option>
            <option value="Family">👨‍👩‍👧 Family</option>
            <option value="Friends">👥 Friends</option>
            <option value="Work">💼 Work</option>
          </select>
          
          <div className="info-box mb-3">
            <div><strong>📍 Location:</strong> {contact.location || '-'}</div>
            <div><strong>📅 Created:</strong> {contact.createdAt || '-'}</div>
          </div>
          
          <div className="modal-actions">
            <button className="btn btn-primary" type="submit">💾 Update Contact</button>
            <button className="btn btn-secondary" type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
      </div>
  );
}


export default EditContact;

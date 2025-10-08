import { useState } from 'react';
import { createContact } from '../services/ContactService';

const AddContact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    createContact(form)
      .then(() => {
        alert('Contact added!');
        setForm({ name: '', email: '', phone: '' });
      })
      .catch(err => console.log(err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
      <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
      <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" required/>
      <button type="submit">Add Contact</button>
    </form>
  );
};

export default AddContact;

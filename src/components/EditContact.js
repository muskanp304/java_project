import { useState, useEffect } from 'react';
import { getContacts, updateContact } from '../services/ContactService';
import { useParams, useNavigate } from 'react-router-dom';

const EditContact = () => {
  const { id } = useParams(); // Get contact ID from URL
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    // Fetch the contact details to edit
    getContacts()
      .then(res => {
        const contact = res.data.find(c => c.id === parseInt(id));
        if (contact) {
          setForm(contact);
        }
      })
      .catch(err => console.log(err));
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    updateContact(id, form)
      .then(() => {
        alert('Contact updated!');
        navigate('/'); // Redirect back to contact list page after update
      })
      .catch(err => console.log(err));
  };

  return (
    <div>
      <h2>Edit Contact</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={form.name} onChange={handleChange} required />
        <input type="email" name="email" value={form.email} onChange={handleChange} required />
        <input type="text" name="phone" value={form.phone} onChange={handleChange} />
        <button type="submit">Update Contact</button>
      </form>
    </div>
  );
};

export default EditContact;

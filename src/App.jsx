import React, { useState } from "react";
import ContactList from "./components/ContactList";  
import AddContact from "./components/AddContact";    
import EditContact from "./components/EditContact";  
import { v4 as uuidv4 } from "uuid";

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [editContact, setEditContact] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const contactsPerPage = 5;

  const addContact = (contact) => {
    setContacts([...contacts, { ...contact, id: uuidv4() }]);
    setShowAddModal(false);
  };

  const deleteContact = (id) => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };

  const updateContact = (updatedContact) => {
    setContacts(contacts.map(contact => (contact.id === updatedContact.id ? updatedContact : contact)));
    setShowEditModal(false);
  };

  const handleEdit = (contact) => {
    setEditContact(contact);
    setShowEditModal(true);
  };

  const sortedContacts = [...contacts].sort((a, b) =>
    sortOrder === 'asc'
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name)
  );

  const filteredContacts = sortedContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (contact.phone && contact.phone.includes(searchTerm))
  );

  // Pagination calculation
  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = filteredContacts.slice(indexOfFirstContact, indexOfLastContact);

  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-5">
      <h1>Contacts Manager</h1>
      <input
        type="text"
        placeholder="Search by name, email, or phone"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1); // Reset to first page on search
        }}
        className="form-control mb-3"
      />
      <button className="btn btn-primary mb-3" onClick={() => setShowAddModal(true)}>Add Contact</button>
      <ContactList contacts={currentContacts} onDelete={deleteContact} onEdit={handleEdit} />
      <div className="mb-3">
        <button onClick={() => setSortOrder('asc')} className="btn btn-outline-secondary me-2">Sort A-Z</button>
        <button onClick={() => setSortOrder('desc')} className="btn btn-outline-secondary">Sort Z-A</button>
      </div>

      {/* Pagination Buttons */}
      <div className="mb-3">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`btn me-2 ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {showAddModal && <AddContact onAdd={addContact} onClose={() => setShowAddModal(false)} />}
      {showEditModal && <EditContact contact={editContact} onUpdate={updateContact} onClose={() => setShowEditModal(false)} />}
    </div>
  );
};

export default App;

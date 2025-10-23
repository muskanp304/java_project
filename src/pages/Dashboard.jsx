import React, { useState } from "react";
import ContactList from "../components/ContactList";
import AddContact from "../components/AddContact";
import EditContact from "../components/EditContact";
import { v4 as uuidv4 } from "uuid";

const Dashboard = ({ user, onLogout }) => {
  const [contacts, setContacts] = useState([]);
  const [editContact, setEditContact] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [blockedContacts, setBlockedContacts] = useState([]);
  const [hiddenContacts, setHiddenContacts] = useState([]);
  const [showHidden, setShowHidden] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const contactsPerPage = 5;

  const addContact = (contact) => {
    // Check for duplicate phone number
    const phoneExists = contacts.some(c => c.phone === contact.phone);
    if (phoneExists) {
      alert("A contact with this phone number already exists!");
      return;
    }

    // Check for duplicate email (if email is provided)
    if (contact.email) {
      const emailExists = contacts.some(c => c.email && c.email.toLowerCase() === contact.email.toLowerCase());
      if (emailExists) {
        alert("A contact with this email already exists!");
        return;
      }
    }

    const newContact = {
      ...contact,
      id: uuidv4(),
      history: [{ type: "created", date: new Date().toLocaleString(), details: "Contact created" }],
    };
    setContacts([...contacts, newContact]);
    setShowAddModal(false);
  };

  const deleteContact = (id) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
    setBlockedContacts(blockedContacts.filter((bid) => bid !== id));
    setHiddenContacts(hiddenContacts.filter((hid) => hid !== id));
  };

  const updateContact = (updatedContact) => {
    setContacts(
      contacts.map((contact) => {
        if (contact.id === updatedContact.id) {
          const changes = [];
          if (contact.phone !== updatedContact.phone) {
            changes.push(`Phone changed from ${contact.phone} to ${updatedContact.phone}`);
          }
          if (contact.email !== updatedContact.email) {
            changes.push(`Email changed from ${contact.email || "none"} to ${updatedContact.email || "none"}`);
          }
          return {
            ...updatedContact,
            history: [
              ...(contact.history || []),
              { type: "edited", date: new Date().toLocaleString(), details: changes.join("; ") || "Contact updated" },
            ],
          };
        }
        return contact;
      })
    );
    setShowEditModal(false);
  };

  const handleEdit = (contact) => {
    setEditContact(contact);
    setShowEditModal(true);
  };

  const blockContact = (id) => {
    if (blockedContacts.includes(id)) {
      setBlockedContacts(blockedContacts.filter((bid) => bid !== id));
    } else {
      setBlockedContacts([...blockedContacts, id]);
    }
  };

  const hideContact = (id) => {
    if (hiddenContacts.includes(id)) {
      setHiddenContacts(hiddenContacts.filter((hid) => hid !== id));
    } else {
      setHiddenContacts([...hiddenContacts, id]);
    }
  };

  const sortedContacts = [...contacts].sort((a, b) =>
    sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  );

  const filteredContacts = sortedContacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contact.phone && contact.phone.includes(searchTerm))
  );

  const contactsToShow = showHidden
    ? filteredContacts.filter((contact) => hiddenContacts.includes(contact.id))
    : filteredContacts.filter((contact) => !hiddenContacts.includes(contact.id));

  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = contactsToShow.slice(indexOfFirstContact, indexOfLastContact);
  const totalPages = Math.ceil(contactsToShow.length / contactsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className={`container ${isDarkMode ? "theme-dark" : "theme-light"}`}>
      <div className="theme-toggle-wrapper">
        <label className="switch">
          <input type="checkbox" checked={isDarkMode} onChange={() => setIsDarkMode(!isDarkMode)} />
          <span className="slider" />
        </label>
      </div>

      <header className="app-header">
        <h1>Contacts Manager</h1>
        <button className="btn btn-danger btn-sm" onClick={onLogout}>Logout</button>
      </header>

      <div className="toolbar">
        <button
          className="btn btn-info"
          onClick={() => {
            setShowHidden(!showHidden);
            setCurrentPage(1);
          }}
        >
          {showHidden ? "Show Visible Contacts" : "Show Hidden Contacts"}
        </button>
      </div>

      <div className="search-add-row">
        <input
          type="text"
          placeholder="Search by name, email, or phone"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="form-control"
        />
        {!showHidden && (
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            Add Contact
          </button>
        )}
      </div>

      <div className="sort-pagination-row">
        <div className="pagination-buttons">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`btn ${currentPage === i + 1 ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="table-wrapper">
        <ContactList
          contacts={currentContacts}
          onDelete={deleteContact}
          onEdit={handleEdit}
          onBlock={blockContact}
          onHide={hideContact}
          blockedContacts={blockedContacts}
          hiddenContacts={hiddenContacts}
          showHidden={showHidden}
        />
      </div>

      {showAddModal && !showHidden && <AddContact onAdd={addContact} onClose={() => setShowAddModal(false)} />}
      {showEditModal && !showHidden && (
        <EditContact contact={editContact} onUpdate={updateContact} onClose={() => setShowEditModal(false)} />
      )}

      <div className="sort-buttons-fixed">
        <button onClick={() => setSortOrder("asc")} className="btn btn-outline-secondary">
          Sort A-Z
        </button>
        <button onClick={() => setSortOrder("desc")} className="btn btn-outline-secondary">
          Sort Z-A
        </button>
      </div>
    </div>
  );
};

export default Dashboard;

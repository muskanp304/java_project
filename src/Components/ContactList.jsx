import React, { useState, useEffect, useRef } from 'react';

const getAvatarUrl = (name) => {
  const firstLetter = name && name.trim().length > 0
    ? name.trim()[0].toUpperCase()
    : 'U';
  return `https://ui-avatars.com/api/?name=${firstLetter}&size=128&rounded=true&background=cccccc&color=222222`;
};

const ContactList = ({
  contacts,
  onDelete,
  onEdit,
  onBlock,
  onHide,
  blockedContacts = [],
  hiddenContacts = [],
}) => {
  const [expandedContactId, setExpandedContactId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const menuRefs = useRef({});

  const toggleExpand = (id) => {
    setExpandedContactId(expandedContactId === id ? null : id);
  };

  const shareContact = (contact) => {
    const json = JSON.stringify(contact, null, 2);
    navigator.clipboard.writeText(json)
      .then(() => alert('Contact details copied to clipboard!'))
      .catch(() => alert('Failed to copy contact details.'));
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        menuOpen &&
        menuRefs.current[menuOpen] &&
        !menuRefs.current[menuOpen].contains(e.target)
      ) {
        setMenuOpen(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  if (contacts.length === 0) return <p>No contacts yet.</p>;

  return (
    <div className="table-wrapper" style={{ marginBottom: "120px", overflow: "visible" }}>
      <table className="table" style={{ overflow: "visible" }}>
        <thead>
          <tr>
            <th>Avatar</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map(contact => {
            const isBlocked = blockedContacts.includes(contact.id);
            const isHidden = hiddenContacts.includes(contact.id);
            const isExpanded = expandedContactId === contact.id;

            return (
              <React.Fragment key={contact.id}>
                <tr style={{ opacity: isHidden ? 0.5 : 1, cursor: 'pointer', position: 'relative' }}>
                  <td onClick={() => toggleExpand(contact.id)}>
                    <img
                      src={getAvatarUrl(contact.name)}
                      alt={`${contact.name} avatar`}
                      width={40}
                      height={40}
                      style={{ borderRadius: '50%' }}
                    />
                  </td>
                  <td onClick={() => toggleExpand(contact.id)}>{contact.name}</td>
                  <td onClick={() => toggleExpand(contact.id)}>{contact.phone}</td>
                  <td>
                    {isBlocked ? (
                      <span style={{ color: 'red', fontWeight: 'bold' }}>Blocked</span>
                    ) : (
                      <span style={{ color: 'green' }}>Active</span>
                    )}
                  </td>
                  <td className="actions-cell" style={{ position: "relative" }}>
                    <div className="action-menu-wrapper" ref={el => menuRefs.current[contact.id] = el}>
                      <button
                        className="menu-dot-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpen(menuOpen === contact.id ? null : contact.id);
                        }}
                        aria-label="Show actions"
                      >
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                      </button>
                      {menuOpen === contact.id && (
                        <div className="action-dropdown-menu">
                          <button onClick={() => { setMenuOpen(null); onEdit(contact); }}>Edit</button>
                          <button onClick={() => { setMenuOpen(null); onDelete(contact.id); }}>Delete</button>
                          <button onClick={() => { setMenuOpen(null); onBlock(contact.id); }}>
                            {isBlocked ? 'Unblock' : 'Block'}
                          </button>
                          <button onClick={() => { setMenuOpen(null); onHide(contact.id); }}>
                            {isHidden ? 'Unhide' : 'Hide'}
                          </button>
                          <button onClick={() => { setMenuOpen(null); shareContact(contact); }}>Share</button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
                {isExpanded && (
                  <tr className="expanded-row">
                    <td colSpan={5}>
                      <div><b>Email:</b> {contact.email || "-"}</div>
                      <div><b>Group:</b> {contact.group || "-"}</div>
                      <div><b>Location:</b> {contact.location || "-"}</div>
                      <div><b>Created At:</b> {contact.createdAt || "-"}</div>
                      <div>
                        <b>History:</b>
                        <ul>
                          {(contact.history || []).map((h, idx) => (
                            <li key={idx}>{h.date} - {h.type.toUpperCase()}: {h.details}</li>
                          ))}
                        </ul>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ContactList;

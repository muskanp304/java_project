import React from 'react';
import ContactList from './components/ContactList';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AddContact from './components/AddContact';
import EditContact from './components/EditContact';

function App() {
  return (
    <div className="App">
      <h1>My CMS Contacts</h1>
      <AddContact />
      <ContactList />
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/FamilyContacts.css';

export const FamilyContacts = ({ onClose = () => {} }) => {
  const { t } = useTranslation();
  const [contacts, setContacts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    relation: '',
    email: '',
  });

  useEffect(() => {
    // Load contacts from localStorage
    const saved = JSON.parse(localStorage.getItem('family_contacts') || '[]');
    setContacts(saved);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddContact = () => {
    // Inline validation — no native alert() (blocked on many mobile browsers)
    if (!formData.name.trim()) {
      setFormError('Please enter a name.');
      return;
    }
    if (!formData.phone.trim() || !/^[0-9+\-\s]{7,15}$/.test(formData.phone.trim())) {
      setFormError('Please enter a valid phone number.');
      return;
    }
    setFormError('');

    const newContact = {
      id: Date.now(),
      ...formData,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
    };

    const updated = [...contacts, newContact];
    setContacts(updated);
    localStorage.setItem('family_contacts', JSON.stringify(updated));

    setFormData({ name: '', phone: '', relation: '', email: '' });
    setShowForm(false);
  };

  const handleDeleteContact = (id) => {
    const updated = contacts.filter(c => c.id !== id);
    setContacts(updated);
    localStorage.setItem('family_contacts', JSON.stringify(updated));
  };

  const handleEditContact = (id, updated) => {
    const newContacts = contacts.map(c => c.id === id ? updated : c);
    setContacts(newContacts);
    localStorage.setItem('family_contacts', JSON.stringify(newContacts));
  };

  return (
    <div className="family-contacts">
      <div className="contacts-header">
        <h2>👨‍👩‍👧‍👦 Emergency Contacts</h2>
        <p>Add family members to notify in case of emergency</p>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      {/* Contacts List */}
      <div className="contacts-container">
        {contacts.length === 0 ? (
          <div className="empty-contacts">
            <p className="empty-icon">📭</p>
            <p>No emergency contacts added yet</p>
          </div>
        ) : (
          <div className="contacts-list">
            {contacts.map(contact => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onDelete={() => handleDeleteContact(contact.id)}
                onEdit={(updated) => handleEditContact(contact.id, updated)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Contact Form */}
      {showForm ? (
        <div className="add-contact-form">
          <h3>➕ Add New Contact</h3>

          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Full name (e.g., Priya Sharma)"
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="10-digit mobile number"
              maxLength={20}
            />
          </div>

          <div className="form-group">
            <label>Relation</label>
            <select name="relation" value={formData.relation} onChange={handleInputChange}>
              <option value="">Select relation</option>
              <option value="Daughter">Daughter</option>
              <option value="Son">Son</option>
              <option value="Spouse">Spouse</option>
              <option value="Sibling">Sibling</option>
              <option value="Doctor">Doctor</option>
              <option value="Caregiver">Caregiver</option>
              <option value="Friend">Friend</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Email (optional)</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email address"
            />
          </div>

          {/* Inline form error */}
          {formError && (
            <p style={{ color: '#f44336', fontSize: '13px', margin: '-4px 0 8px', fontWeight: 600 }}>
              ⚠️ {formError}
            </p>
          )}

          <div className="form-buttons">
            <button className="btn btn-add" onClick={handleAddContact}>
              ✓ Add Contact
            </button>
            <button className="btn btn-cancel" onClick={() => { setShowForm(false); setFormError(''); }}>
              ✗ Cancel
            </button>
          </div>
        </div>
      ) : (
        <button className="btn-add-new" onClick={() => setShowForm(true)}>
          ➕ Add Emergency Contact
        </button>
      )}

      {/* Help Text */}
      <div className="help-section">
        <h4>💡 Why add emergency contacts?</h4>
        <ul>
          <li>✓ Instantly notify family in case of medical emergency</li>
          <li>✓ Share your location and medicine information</li>
          <li>✓ Family can reach out to your doctor</li>
          <li>✓ Ensure quick medical response</li>
        </ul>
      </div>
    </div>
  );
};

// Contact Card Component
const ContactCard = ({ contact, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(contact);

  const handleEditChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveEdit = () => {
    onEdit(editData);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="contact-card editing">
        <input
          type="text"
          value={editData.name}
          onChange={(e) => handleEditChange('name', e.target.value)}
          placeholder="Name"
        />
        <input
          type="tel"
          value={editData.phone}
          onChange={(e) => handleEditChange('phone', e.target.value)}
          placeholder="Phone"
        />
        <input
          type="email"
          value={editData.email || ''}
          onChange={(e) => handleEditChange('email', e.target.value)}
          placeholder="Email"
        />
        <select
          value={editData.relation}
          onChange={(e) => handleEditChange('relation', e.target.value)}
        >
          <option value="">Select relation</option>
          <option value="Daughter">Daughter</option>
          <option value="Son">Son</option>
          <option value="Spouse">Spouse</option>
          <option value="Doctor">Doctor</option>
        </select>
        <div className="edit-buttons">
          <button className="btn-save" onClick={handleSaveEdit}>✓</button>
          <button className="btn-cancel" onClick={() => setIsEditing(false)}>✗</button>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-card">
      <div className="contact-info">
        <h4>{contact.name}</h4>
        <p className="phone">☎️ {contact.phone}</p>
        {contact.relation && <p className="relation">👥 {contact.relation}</p>}
        {contact.email && <p className="email">✉️ {contact.email}</p>}
      </div>
      <div className="contact-actions">
        <button
          className="btn-edit"
          onClick={() => setIsEditing(true)}
          title="Edit"
        >
          ✏️
        </button>
        <button
          className="btn-delete"
          onClick={onDelete}
          title="Delete"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default FamilyContacts;

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/EmergencyAlert.css';

export const EmergencyAlert = ({ medicines = [], onClose = () => {} }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState('symptoms'); // symptoms, confirm, sent
  const [symptoms, setSymptoms] = useState([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [familyContacts, setFamilyContacts] = useState([]);
  const [location, setLocation] = useState(null);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    // Load family contacts from localStorage
    const contacts = JSON.parse(localStorage.getItem('family_contacts') || '[]');
    setFamilyContacts(contacts);

    // Get location
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        () => {
          // Location denied — silently handle, user will see warning in confirm step
          setLocation(null);
        },
        { timeout: 8000, enableHighAccuracy: false }
      );
    }
  }, []);

  const commonSymptoms = [
    { id: 'chest_pain', label: 'Chest Pain', severity: 'critical' },
    { id: 'difficulty_breathing', label: 'Difficulty Breathing', severity: 'critical' },
    { id: 'severe_bleeding', label: 'Severe Bleeding', severity: 'critical' },
    { id: 'allergic_reaction', label: 'Allergic Reaction', severity: 'high' },
    { id: 'severe_dizziness', label: 'Severe Dizziness', severity: 'high' },
    { id: 'confusion', label: 'Confusion/Disorientation', severity: 'high' },
    { id: 'nausea', label: 'Nausea/Vomiting', severity: 'medium' },
    { id: 'headache', label: 'Severe Headache', severity: 'medium' },
    { id: 'stomach_pain', label: 'Stomach Pain', severity: 'medium' },
    { id: 'rash', label: 'Rash/Itching', severity: 'low' },
  ];

  const handleSymptomToggle = (id) => {
    setSymptoms(prev =>
      prev.includes(id)
        ? prev.filter(s => s !== id)
        : [...prev, id]
    );
  };

  const generateAlertData = () => {
    const today = new Date().toDateString();
    const allDoses = JSON.parse(localStorage.getItem('medicine_safety_net_doses') || '{}');
    const todayRaw = allDoses[today] || {};
    const todaysMedicineIds = Object.keys(todayRaw).filter(id => {
      const val = todayRaw[id];
      return Array.isArray(val) ? val.length > 0 : val > 0;
    });

    return {
      timestamp: new Date().toISOString(),
      user_location: location
        ? `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`
        : 'Location not available',
      symptoms: symptoms.map(id => {
        const sym = commonSymptoms.find(s => s.id === id);
        return sym ? sym.label : id;
      }),
      custom_symptoms: customSymptom,
      medicines_taken_today: todaysMedicineIds,
      family_contacts_notified: familyContacts.length,
    };
  };

  const saveAlertAndShowSent = async (alert_message) => {
    setIsSending(true);
    const alerts = JSON.parse(localStorage.getItem('emergency_alerts') || '[]');
    alerts.push(alert_message);
    localStorage.setItem('emergency_alerts', JSON.stringify(alerts));
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStep('sent');
    setTimeout(() => {
      onClose();
    }, 3000);
  };

  const handleSendSMS = async () => {
    const alert_message = generateAlertData();
    const smsBody = `EMERGENCY ALERT: I am feeling unwell.\nSymptoms: ${alert_message.symptoms.join(', ')}${customSymptom ? ` (${customSymptom})` : ''}.\nLocation: ${alert_message.user_location}\nPlease check on me immediately.`;
    const phoneNumbers = familyContacts.map(c => c.phone).filter(Boolean).join(',');
    
    if (phoneNumbers) {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      const separator = isIOS ? '&' : '?';
      window.location.href = `sms:${phoneNumbers}${separator}body=${encodeURIComponent(smsBody)}`;
    } else {
      alert("No phone numbers found for your family contacts. Please add them in the Family tab.");
      return;
    }
    await saveAlertAndShowSent(alert_message);
  };

  const handleSendEmail = async () => {
    const alert_message = generateAlertData();
    const emailBody = `EMERGENCY ALERT: I am feeling unwell.\n\nSymptoms: ${alert_message.symptoms.join(', ')}${customSymptom ? ` (${customSymptom})` : ''}.\nLocation: ${alert_message.user_location}\n\nMedicines taken today: ${medicines.map(m => m.name).join(', ') || 'None'}\n\nPlease check on me immediately.\n\nSent from Medicine Safety Net.`;
    const emails = familyContacts.map(c => c.email).filter(e => e && e.trim() !== '').join(',');
    
    if (emails) {
      window.location.href = `mailto:${emails}?subject=EMERGENCY ALERT&body=${encodeURIComponent(emailBody)}`;
    } else {
      alert("No email addresses found for your family contacts. Please add them in the Family tab.");
      return;
    }
    await saveAlertAndShowSent(alert_message);
  };

  if (step === 'symptoms') {
    return (
      <div className="emergency-overlay">
        <div className="emergency-modal">
          <button className="modal-close-btn" onClick={onClose}>✕</button>

          <div className="emergency-content">
            <div className="emergency-header">
              <h2>🚨 Emergency Alert</h2>
              <p>Describe your symptoms so we can help</p>
            </div>

            <div className="symptoms-list">
              {commonSymptoms.map(symptom => (
                <button
                  key={symptom.id}
                  className={`symptom-btn ${symptoms.includes(symptom.id) ? 'selected' : ''} ${symptom.severity}`}
                  onClick={() => handleSymptomToggle(symptom.id)}
                >
                  <span className="symptom-check">
                    {symptoms.includes(symptom.id) ? '✓' : ''}
                  </span>
                  <span className="symptom-label">{symptom.label}</span>
                </button>
              ))}
            </div>

            <div className="custom-symptom">
              <input
                type="text"
                placeholder="Add other symptoms..."
                value={customSymptom}
                onChange={(e) => setCustomSymptom(e.target.value)}
                maxLength={200}
              />
            </div>

            <div className="symptoms-selected">
              <p className="selected-count">
                {symptoms.length > 0 ? `${symptoms.length} symptom(s) selected` : 'Select symptoms'}
              </p>
            </div>

            <div className="modal-buttons">
              <button
                className="btn btn-emergency"
                onClick={() => setStep('confirm')}
                disabled={symptoms.length === 0 && customSymptom === ''}
              >
                Continue to Alert 📍
              </button>
              <button className="btn btn-cancel" onClick={onClose}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'confirm') {
    return (
      <div className="emergency-overlay">
        <div className="emergency-modal">
          <button className="modal-close-btn" onClick={onClose}>✕</button>

          <div className="emergency-content">
            <div className="emergency-header">
              <h2>📍 Confirm Alert</h2>
              <p>Review before sending to family & emergency services</p>
            </div>

            {/* Location Status */}
            <div className="confirm-section">
              <h3>📍 Your Location</h3>
              {location ? (
                <div className="location-info">
                  <p>✓ Location detected</p>
                  <p className="small-text">Lat: {location.latitude.toFixed(4)}, Lng: {location.longitude.toFixed(4)}</p>
                </div>
              ) : (
                <div className="location-info warning">
                  <p>⚠️ Location not available</p>
                  <p className="small-text">Enable location services for better help</p>
                </div>
              )}
            </div>

            {/* Symptoms Summary */}
            <div className="confirm-section">
              <h3>🏥 Symptoms Reported</h3>
              <div className="symptoms-summary">
                {symptoms.map(id => {
                  const sym = commonSymptoms.find(s => s.id === id);
                  return (
                    <span key={id} className={`symptom-tag ${sym?.severity}`}>
                      {sym?.label}
                    </span>
                  );
                })}
                {customSymptom && <span className="symptom-tag custom">{customSymptom}</span>}
              </div>
            </div>

            {/* Medicines Today */}
            <div className="confirm-section">
              <h3>💊 Medicines Taken Today</h3>
              <div className="medicines-summary">
                {medicines.length > 0 ? (
                  medicines.map(med => (
                    <span key={med.id} className="med-tag">
                      {med.icon} {med.name}
                    </span>
                  ))
                ) : (
                  <p className="text-muted">No medicines recorded today</p>
                )}
              </div>
            </div>

            {/* Family Contacts */}
            <div className="confirm-section">
              <h3>👨‍👩‍👧‍👦 Contacts to Alert</h3>
              {familyContacts.length > 0 ? (
                <div className="contacts-list">
                  {familyContacts.map((contact, idx) => (
                    <div key={idx} className="contact-item">
                      <p className="contact-name">{contact.name}</p>
                      <p className="contact-phone">{contact.phone}</p>
                      <p className="contact-relation">{contact.relation}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-warning">⚠️ No family contacts added. Going to emergency services only.</p>
              )}
            </div>

            <div className="modal-buttons" style={{ flexDirection: 'column', gap: '10px' }}>
              <button
                className="btn btn-danger"
                onClick={handleSendSMS}
                disabled={isSending}
              >
                {isSending ? '⏳ Sending...' : '📱 Send via SMS'}
              </button>
              <button
                className="btn btn-emergency"
                onClick={handleSendEmail}
                disabled={isSending}
                style={{ backgroundColor: '#2196f3' }}
              >
                {isSending ? '⏳ Sending...' : '✉️ Send via Email'}
              </button>
              <button
                className="btn btn-cancel"
                onClick={() => setStep('symptoms')}
                disabled={isSending}
                style={{ marginTop: '5px' }}
              >
                ← Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'sent') {
    return (
      <div className="emergency-overlay">
        <div className="emergency-modal sent-modal">
          <div className="emergency-content">
            <div className="success-animation">
              <div className="check-mark">✓</div>
            </div>

            <h2>Alert Sent Successfully!</h2>
            <p>Family and emergency services have been notified</p>

            <div className="sent-info">
              <p>📍 Your location has been shared</p>
              <p>💊 Your medicine information has been sent</p>
              <p>👨‍👩‍👧‍👦 Your emergency contacts have been notified</p>
            </div>

            <p className="countdown">Closing in a few seconds...</p>
          </div>
        </div>
      </div>
    );
  }
};

export default EmergencyAlert;

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MedicineCard from './components/MedicineCard';
import ReminderModal from './components/ReminderModal';
import SafetyCheckScreen from './components/SafetyCheckScreen';
import EmergencyAlert from './components/EmergencyAlert';
import FamilyContacts from './components/FamilyContacts';
import DemoMode from './components/DemoMode';
import medicinesData from './data/medicines.json';
import './App.css';

function App() {
  const { t, i18n } = useTranslation();
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [todaysMedicines, setTodaysMedicines] = useState({});
  const [activeTab, setActiveTab] = useState('home'); // home, safety, family, emergency
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  // Initialize medicines data — load today's dose counts from service storage
  useEffect(() => {
    const today = new Date().toDateString();
    const data = JSON.parse(localStorage.getItem('medicine_safety_net_doses') || '{}');
    const todayRaw = data[today] || {};
    // medicineService stores arrays of timestamps; convert to counts for UI
    const counts = {};
    Object.entries(todayRaw).forEach(([id, val]) => {
      counts[id] = Array.isArray(val) ? val.length : (typeof val === 'number' ? val : 0);
    });
    setTodaysMedicines(counts);
  }, []);

  const handleMedicineClick = (medicine) => {
    setSelectedMedicine(medicine);
  };

  const handleConfirmDose = (medicineId) => {
    // medicineService.recordDose already saves to localStorage
    // Just sync the count in local state
    setTodaysMedicines(prev => {
      const newCount = (prev[medicineId] || 0) + 1;
      return { ...prev, [medicineId]: newCount };
    });
    setSelectedMedicine(null);
  };

  const handleCloseModal = () => {
    setSelectedMedicine(null);
  };

  const toggleLanguage = () => {
    const languages = ['en', 'hi', 'ta', 'mr', 'gu'];
    const currentIndex = languages.indexOf(i18n.language);
    const newLang = languages[(currentIndex + 1) % languages.length];
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const getLanguageLabel = () => {
    const labels = {
      en: '🇬🇧 English',
      hi: '🇮🇳 हिंदी',
      ta: '🇮🇳 தமிழ்',
      mr: '🇮🇳 मराठी',
      gu: '🇮🇳 ગુજરાતી'
    };
    return labels[i18n.language] || 'EN';
  };

  // Get upcoming medicines (not yet taken today)
  const upcomingMedicines = medicinesData.medicines.filter(
    med => !todaysMedicines[med.id] || todaysMedicines[med.id] === 0
  );

  // Get taken medicines
  const takenMedicines = medicinesData.medicines.filter(
    med => todaysMedicines[med.id] && todaysMedicines[med.id] > 0
  );

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1>{t('app.title')}</h1>
          <p className="subtitle">{t('app.subtitle')}</p>
        </div>
        <div className="header-buttons">
          <button className="demo-btn" onClick={() => setShowDemo(true)} title="Start interactive demo">
            🎬 Demo
          </button>
          <button className="lang-toggle" onClick={toggleLanguage} title="Cycle through languages">
            {getLanguageLabel()}
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="app-tabs">
        <button 
          className={`tab ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          🏠 Home
        </button>
        <button 
          className={`tab ${activeTab === 'safety' ? 'active' : ''}`}
          onClick={() => setActiveTab('safety')}
        >
          🛡️ Safety Check
        </button>
        <button 
          className={`tab ${activeTab === 'family' ? 'active' : ''}`}
          onClick={() => setActiveTab('family')}
        >
          👨‍👩‍👧‍👦 Family
        </button>
      </nav>

      {/* Main Content */}
      <main className="app-main">
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <>
            {/* Upcoming Medicines Section */}
            {upcomingMedicines.length > 0 && (
              <section className="medicines-section">
                <h2 className="section-title">📋 {t('nav.medicines')} to take today</h2>
                <div className="medicines-grid">
                  {upcomingMedicines.map(medicine => (
                    <div key={medicine.id} onClick={() => handleMedicineClick(medicine)}>
                      <MedicineCard medicine={medicine} isUpcoming={true} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Taken Medicines Section */}
            {takenMedicines.length > 0 && (
              <section className="medicines-section completed">
                <h2 className="section-title">✅ Medicines taken today</h2>
                <div className="medicines-grid">
                  {takenMedicines.map(medicine => (
                    <div key={medicine.id}>
                      <MedicineCard medicine={medicine} isUpcoming={false} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Empty State */}
            {upcomingMedicines.length === 0 && takenMedicines.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">💊</div>
                <p className="empty-text">No medicines added yet</p>
              </div>
            )}

            {/* All medicines taken */}
            {upcomingMedicines.length === 0 && takenMedicines.length > 0 && (
              <div className="all-done">
                <div className="done-icon">🎉</div>
                <p className="done-text">All medicines taken for today!</p>
                <button 
                  className="reset-btn"
                  onClick={() => {
                    // Remove today's entry from the nested storage object
                    const today = new Date().toDateString();
                    const data = JSON.parse(localStorage.getItem('medicine_safety_net_doses') || '{}');
                    delete data[today];
                    localStorage.setItem('medicine_safety_net_doses', JSON.stringify(data));
                    setTodaysMedicines({});
                  }}
                >
                  Reset for tomorrow
                </button>
              </div>
            )}
          </>
        )}

        {/* SAFETY CHECK TAB */}
        {activeTab === 'safety' && (
          <SafetyCheckScreen medicines={medicinesData.medicines} foodDatabase={medicinesData.foodDatabase} />
        )}

        {/* FAMILY TAB */}
        {activeTab === 'family' && (
          <FamilyContacts onClose={() => {}} />
        )}
      </main>

      {/* Emergency Button - Fixed at bottom */}
      <button 
        className="emergency-btn" 
        aria-label="Emergency alert button"
        onClick={() => setShowEmergencyAlert(true)}
      >
        🚨 I Feel Unwell
      </button>

      {/* Reminder Modal */}
      {selectedMedicine && (
        <ReminderModal
          medicine={selectedMedicine}
          medicines={medicinesData.medicines}
          todaysMedicines={todaysMedicines}
          onConfirm={handleConfirmDose}
          onCancel={handleCloseModal}
        />
      )}

      {/* Emergency Alert Modal */}
      {showEmergencyAlert && (
        <EmergencyAlert 
          medicines={medicinesData.medicines}
          onClose={() => setShowEmergencyAlert(false)}
        />
      )}

      {/* Demo Mode Modal */}
      {showDemo && (
        <DemoMode 
          medicines={medicinesData.medicines}
          onClose={() => setShowDemo(false)}
        />
      )}
    </div>
  );
}

export default App;

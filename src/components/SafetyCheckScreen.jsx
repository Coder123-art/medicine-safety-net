import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { interactionService } from '../services/medicineService';
import '../styles/SafetyCheckScreen.css';

export const SafetyCheckScreen = ({ medicines, foodDatabase = {} }) => {
  const { t } = useTranslation();
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [takenMedicines, setTakenMedicines] = useState([]);
  const [recentFoods, setRecentFoods] = useState([]);
  const [warnings, setWarnings] = useState([]);

  const commonFoods = [
    'milk', 'dairy', 'coffee', 'tea', 'spinach', 'broccoli', 'banana', 
    'orange', 'potato', 'tomato', 'grapefruit', 'meat', 'alcohol'
  ];

  const handleMedicineSelect = (medicine) => {
    setSelectedMedicine(medicine);
    performSafetyCheck(medicine);
  };

  const performSafetyCheck = (medicine) => {
    const warningsList = [];

    // Check drug interactions
    const drugWarnings = interactionService.checkDrugInteraction(
      medicine.id,
      takenMedicines,
      medicines
    );
    warningsList.push(...drugWarnings);

    // Check food interactions
    const foodWarnings = interactionService.checkFoodInteraction(
      medicine.id,
      recentFoods,
      medicines,
      foodDatabase
    );
    warningsList.push(...foodWarnings);

    setWarnings(warningsList);
  };

  const toggleFood = (food) => {
    setRecentFoods(prev => {
      const updated = prev.includes(food)
        ? prev.filter(f => f !== food)
        : [...prev, food];
      // Persist so ReminderModal can also read recently eaten foods
      localStorage.setItem('recent_foods', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleMedicine = (medicineId) => {
    setTakenMedicines(prev =>
      prev.includes(medicineId)
        ? prev.filter(m => m !== medicineId)
        : [...prev, medicineId]
    );
  };

  const hasConflicts = warnings.length > 0;

  return (
    <div className="safety-check-screen">
      {/* Title */}
      <div className="safety-header">
        <h2>🛡️ {t('safety.title')}</h2>
        <p>{t('safety.description')}</p>
      </div>

      <div className="safety-content">
        {/* Left: Medicine Selection */}
        <div className="safety-left">
          <h3>📋 Select Medicine</h3>
          <div className="medicine-selector">
            {medicines.map(med => (
              <button
                key={med.id}
                className={`med-select-btn ${selectedMedicine?.id === med.id ? 'active' : ''}`}
                onClick={() => handleMedicineSelect(med)}
              >
                <span className="med-icon">{med.icon}</span>
                <span className="med-select-name">{med.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Checks */}
        {selectedMedicine && (
          <div className="safety-right">
            <div className="selected-medicine-info">
              <h3>
                {selectedMedicine.icon} {selectedMedicine.name}
              </h3>
              <p className="hindi-label">{selectedMedicine.hindi}</p>
              <p className="dosage-label">{selectedMedicine.dosage}</p>
            </div>

            {/* Food Check */}
            <div className="check-section">
              <h4>🍎 Recent Food Items</h4>
              <div className="food-selector">
                {commonFoods.map(food => (
                  <button
                    key={food}
                    className={`food-btn ${recentFoods.includes(food) ? 'selected' : ''}`}
                  onClick={() => {
                      const updatedFoods = recentFoods.includes(food)
                        ? recentFoods.filter(f => f !== food)
                        : [...recentFoods, food];
                      toggleFood(food);
                      // Pass updated foods directly to avoid stale state
                      const w = [];
                      const dw = interactionService.checkDrugInteraction(selectedMedicine.id, takenMedicines, medicines);
                      const fw = interactionService.checkFoodInteraction(selectedMedicine.id, updatedFoods, medicines, foodDatabase);
                      w.push(...dw, ...fw);
                      setWarnings(w);
                    }}
                  >
                    {food}
                  </button>
                ))}
              </div>
            </div>

            {/* Medicine Conflicts Check */}
            <div className="check-section">
              <h4>💊 Other Medicines Taken</h4>
              <div className="medicine-selector-check">
                {medicines
                  .filter(m => m.id !== selectedMedicine.id)
                  .map(med => (
                    <button
                      key={med.id}
                      className={`med-check-btn ${takenMedicines.includes(med.id) ? 'selected' : ''}`}
                      onClick={() => {
                        const updatedMeds = takenMedicines.includes(med.id)
                          ? takenMedicines.filter(m => m !== med.id)
                          : [...takenMedicines, med.id];
                        toggleMedicine(med.id);
                        // Pass updated list directly to avoid stale state
                        const w = [];
                        const dw = interactionService.checkDrugInteraction(selectedMedicine.id, updatedMeds, medicines);
                        const fw = interactionService.checkFoodInteraction(selectedMedicine.id, recentFoods, medicines, foodDatabase);
                        w.push(...dw, ...fw);
                        setWarnings(w);
                      }}
                    >
                      <span>{med.icon}</span>
                      <span>{med.name}</span>
                    </button>
                  ))}
              </div>
            </div>

            {/* Warnings Display */}
            {warnings.length > 0 && (
              <div className={`warnings-section ${hasConflicts ? 'has-warnings' : ''}`}>
                <h4 className="warnings-title">
                  ⚠️ {hasConflicts ? 'Safety Issues Found' : 'All Clear'}
                </h4>
                <div className="warnings-list">
                  {warnings.map((warning, idx) => (
                    <div key={idx} className={`warning-item ${warning.severity}`}>
                      <div className="warning-icon">
                        {warning.severity === 'high' ? '❌' : '⚠️'}
                      </div>
                      <div className="warning-content">
                        <p className="warning-message">{warning.recommendation || warning.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Safe Message — only shown when a medicine is selected and no conflicts */}
            {warnings.length === 0 && (
              <div className="safe-message">
                <div className="safe-icon">✅</div>
                <p>Safe to take with your current food and medicines</p>
              </div>
            )}

            {/* Side Effects Info */}
            <div className="side-effects-section">
              <h4>📖 Expected Side Effects</h4>
              <div className="side-effects-content">
                <div className="side-effect-item">
                  <strong>Common:</strong>
                  <p>{selectedMedicine.sideEffects.common}</p>
                </div>
                <div className="side-effect-item">
                  <strong>Rare/Serious:</strong>
                  <p>{selectedMedicine.sideEffects.rare}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!selectedMedicine && (
          <div className="safety-empty">
            <div className="empty-icon">👈</div>
            <p>Select a medicine to check safety</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SafetyCheckScreen;

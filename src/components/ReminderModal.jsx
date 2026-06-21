import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { medicineService, notificationService, interactionService } from '../services/medicineService';
import '../styles/ReminderModal.css';

export const ReminderModal = ({ medicine, medicines, onConfirm, onCancel, todaysMedicines = {} }) => {
  const { t } = useTranslation();
  const [checks, setChecks] = useState({
    alreadyTaken: false,
    foodConflict: false,
    drugConflict: false,
  });
  const [allChecked, setAllChecked] = useState(false);
  const [warnings, setWarnings] = useState([]);

  useEffect(() => {
    performSafetyChecks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medicine.id]);

  const performSafetyChecks = () => {
    const warnings_list = [];

    // Check 1: Already taken today
    const alreadyTaken = medicineService.hasBeenTakenToday(medicine.id);
    setChecks(prev => ({ ...prev, alreadyTaken }));
    if (alreadyTaken) {
      const timesTaken = medicineService.getTimeTakenToday(medicine.id);
      // timesTaken is an array of ISO strings — format nicely
      const lastTakenRaw = timesTaken[timesTaken.length - 1];
      const lastTakenTime = lastTakenRaw
        ? new Date(lastTakenRaw).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        : 'earlier today';
      warnings_list.push({
        id: 'already_taken',
        severity: 'high',
        message: `⚠️ You already took ${medicine.name} today at ${lastTakenTime}`,
      });
    }

    // Check 2: Food conflicts — use foods stored in localStorage by user
    const storedFoods = JSON.parse(localStorage.getItem('recent_foods') || '[]');
    const recentFoods = storedFoods.length > 0 ? storedFoods : [];
    const foodWarnings = interactionService.checkFoodInteraction(
      medicine.id,
      recentFoods,
      medicines,
      {}
    );
    if (foodWarnings.length > 0) {
      foodWarnings.forEach(w => {
        warnings_list.push({
          id: `food_${w.food}`,
          severity: 'medium',
          message: `⚠️ ${w.recommendation}`,
        });
      });
    }

    // Check 3: Drug interactions
    const takenMedicines = Object.keys(todaysMedicines).filter(id => todaysMedicines[id] > 0);
    const drugWarnings = interactionService.checkDrugInteraction(
      medicine.id,
      takenMedicines,
      medicines
    );
    if (drugWarnings.length > 0) {
      drugWarnings.forEach(w => {
        warnings_list.push({
          id: `drug_${w.medicine}`,
          severity: 'high',
          message: `⚠️ DANGER: ${w.recommendation}`,
        });
      });
    }

    setWarnings(warnings_list);
    setChecks(prev => ({
      ...prev,
      foodConflict: foodWarnings.length > 0,
      drugConflict: drugWarnings.length > 0,
    }));
  };

  const handleConfirm = () => {
    notificationService.playAudio('reminder');

    // Record the dose via service (saves to localStorage)
    medicineService.recordDose(medicine.id);

    // Show notification
    notificationService.sendLocalNotification(
      `✓ ${medicine.name} recorded`,
      {
        body: `Taken at ${new Date().toLocaleTimeString()}`,
      }
    );

    onConfirm(medicine.id);
  };

  const criticalWarnings = warnings.filter(w => w.severity === 'high');
  const isSafe = criticalWarnings.length === 0;

  return (
    <div className="reminder-modal-overlay">
      <div className="reminder-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="medicine-icon-large">{medicine.icon}</div>
          <h2>{t('reminder.title')}</h2>
          <p className="medicine-name-modal">
            {medicine.name}
            <br />
            <span className="hindi">{medicine.hindi}</span>
          </p>
          <p className="medicine-dosage">{medicine.dosage}</p>
        </div>

        {/* Safety Check Section */}
        <div className="safety-checks">
          <h3>{t('safety.description')}</h3>

          {/* Check Items */}
          <div className="check-items">
            <div className={`check-item ${checks.alreadyTaken ? 'failed' : 'passed'}`}>
              <span className="check-icon">{checks.alreadyTaken ? '❌' : '✓'}</span>
              <span className="check-text">
                {checks.alreadyTaken ? 'Already taken today' : 'Not taken today'}
              </span>
            </div>

            <div className={`check-item ${checks.foodConflict ? 'warning' : 'passed'}`}>
              <span className="check-icon">{checks.foodConflict ? '⚠️' : '✓'}</span>
              <span className="check-text">
                {checks.foodConflict ? 'Food conflict detected' : 'No food conflict'}
              </span>
            </div>

            <div className={`check-item ${checks.drugConflict ? 'failed' : 'passed'}`}>
              <span className="check-icon">{checks.drugConflict ? '❌' : '✓'}</span>
              <span className="check-text">
                {checks.drugConflict ? 'Medicine conflict detected' : 'No medicine conflict'}
              </span>
            </div>
          </div>

          {/* Warnings Display */}
          {warnings.length > 0 && (
            <div className="warnings-container">
              {warnings.map(warning => (
                <div key={warning.id} className={`warning ${warning.severity}`}>
                  {warning.message}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Safety Status */}
        <div className={`safety-status ${isSafe ? 'safe' : 'unsafe'}`}>
          {isSafe ? (
            <>
              <span className="status-icon">✓</span>
              <span className="status-text">Safe to take</span>
            </>
          ) : (
            <>
              <span className="status-icon">⚠️</span>
              <span className="status-text">⚠️ WARNING: Critical Issues Found</span>
            </>
          )}
        </div>

        {/* Side Effects Info */}
        <div className="side-effects-preview">
          <h4>Common Side Effects:</h4>
          <p>{medicine.sideEffects.common}</p>
        </div>

        {/* Action Buttons */}
        <div className="modal-buttons">
          {isSafe ? (
            <>
              <button className="btn btn-confirm" onClick={handleConfirm}>
                {t('reminder.takeNow')} ✓
              </button>
              <button className="btn btn-cancel" onClick={onCancel}>
                {t('reminder.notNow')}
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-danger"
                onClick={onCancel}
                disabled={false}
              >
                Do NOT Take - Contact Doctor
              </button>
              <button className="btn btn-cancel" onClick={onCancel}>
                {t('common.cancel')}
              </button>
            </>
          )}
        </div>

        {/* Close Button */}
        <button className="modal-close" onClick={onCancel} aria-label="Close">
          ✕
        </button>
      </div>
    </div>
  );
};

export default ReminderModal;

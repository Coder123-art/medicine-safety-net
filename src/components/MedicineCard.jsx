import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/MedicineCard.css';

export const MedicineCard = ({ medicine, isUpcoming = false, onClick = () => {} }) => {
  const { t } = useTranslation();

  // Format time display — guard against empty timeSlots
  const nextTime = (medicine.timeSlots && medicine.timeSlots.length > 0)
    ? medicine.timeSlots[0]
    : '—:—';
  const [hours = '—', minutes = '—'] = nextTime !== '—:—' ? nextTime.split(':') : ['—', '—'];

  return (
    <div
      className={`medicine-card ${isUpcoming ? 'upcoming' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`${medicine.name}, ${nextTime}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Large Icon */}
      <div className="medicine-icon" aria-hidden="true">
        {medicine.icon}
      </div>

      {/* Medicine Name - Hindi + English */}
      <div className="medicine-name">
        <h2>{medicine.name}</h2>
        <p className="hindi-name">{medicine.hindi}</p>
      </div>

      {/* Time Display */}
      <div className="time-display">
        <div className="time-large">
          {hours}:{minutes}
        </div>
        <p className="dosage">{medicine.dosage}</p>
      </div>

      {/* Warnings if needed */}
      {medicine.foodConflicts && medicine.foodConflicts.length > 0 && (
        <div className="warning-section">
          <span className="warning-icon">⚠️</span>
          <p className="warning-text">{t('reminder.foodWarning')}</p>
        </div>
      )}

      {/* Button */}
      <button
        className="medicine-button"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        aria-label={`Take ${medicine.name}`}
      >
        {t('reminder.takeNow')}
      </button>
    </div>
  );
};

export default MedicineCard;

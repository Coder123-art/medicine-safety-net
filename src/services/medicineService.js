// Medicine Reminder Service - Tracks doses and prevents double-doses

const STORAGE_KEY = 'medicine_safety_net_doses';

export const medicineService = {
  // Load all doses taken today
  loadTodaysDoses: () => {
    const today = new Date().toDateString();
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return data[today] || {};
  },

  // Record that a medicine was taken
  recordDose: (medicineId, timestamp = new Date()) => {
    const today = new Date().toDateString();
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    
    if (!data[today]) {
      data[today] = {};
    }
    
    if (!data[today][medicineId]) {
      data[today][medicineId] = [];
    }
    
    data[today][medicineId].push(timestamp.toISOString());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  },

  // Check if medicine was already taken today
  hasBeenTakenToday: (medicineId) => {
    const doses = medicineService.loadTodaysDoses();
    return doses[medicineId] && doses[medicineId].length > 0;
  },

  // Get times medicine was taken today
  getTimeTakenToday: (medicineId) => {
    const doses = medicineService.loadTodaysDoses();
    return doses[medicineId] || [];
  },

  // Get next scheduled time for medicine
  getNextScheduledTime: (timeSlots) => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const futureSlots = timeSlots.filter(slot => slot > currentTime);
    return futureSlots.length > 0 ? futureSlots[0] : timeSlots[0];
  },

  // Clear all data (for testing/reset)
  clearAllData: () => {
    localStorage.removeItem(STORAGE_KEY);
  },

  // Get history of all doses
  getHistory: () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  },
};

// Notification Service - Alerts and reminders
export const notificationService = {
  requestPermission: async () => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        return true;
      }
      if (Notification.permission !== 'denied') {
        const result = await Notification.requestPermission();
        return result === 'granted';
      }
    }
    return false;
  },

  sendLocalNotification: (title, options = {}) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/medicine-icon.png',
        badge: '/badge.png',
        ...options,
      });
    }
  },

  playAudio: (soundName = 'reminder') => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return; // Not supported
      const audioContext = new AudioCtx();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.connect(gain);
      gain.connect(audioContext.destination);

      if (soundName === 'reminder') {
        oscillator.frequency.value = 800;
        gain.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      } else if (soundName === 'alert') {
        oscillator.frequency.value = 440;
        gain.gain.setValueAtTime(0.5, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.0);
      }

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
      // Close context after sound finishes to free resources
      oscillator.onended = () => audioContext.close();
    } catch (e) {
      // Silently fail \u2014 audio is non-critical
    }
  },
};

// Drug Interaction Service - Checks medicine safety
export const interactionService = {
  checkDrugInteraction: (medicineId, otherMedicineIds, medicines) => {
    const medicine = medicines.find(m => m.id === medicineId);
    if (!medicine) return [];

    return otherMedicineIds
      .filter(id => medicine.medicines_to_avoid.some(avoid => avoid.toLowerCase() === id.toLowerCase()))
      .map(id => {
        const conflictMed = medicines.find(m => m.id === id);
        return {
          medicine: conflictMed?.name || id,
          severity: 'high',
          recommendation: `Do not take ${medicine.name} with ${conflictMed?.name}. Wait at least 4 hours.`,
        };
      });
  },

  checkFoodInteraction: (medicineId, foodItems, medicines, foodDatabase) => {
    const medicine = medicines.find(m => m.id === medicineId);
    if (!medicine || !medicine.foodConflicts) return [];

    return foodItems
      .filter(food => {
        const lowerFood = food.toLowerCase();
        return medicine.foodConflicts.some(conflict => 
          foodDatabase[conflict]?.some(item => item.includes(lowerFood)) ||
          conflict.toLowerCase().includes(lowerFood)
        );
      })
      .map(food => ({
        food,
        medicine: medicine.name,
        severity: 'medium',
        recommendation: `Do not take ${medicine.name} with ${food}. Wait 2-4 hours apart.`,
      }));
  },

  checkTimeWindowValid: (medicineId, medicines) => {
    const medicine = medicines.find(m => m.id === medicineId);
    if (!medicine) return { valid: false, message: 'Medicine not found' };

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    // Allow 1 hour window before scheduled time
    const isWithinWindow = medicine.timeSlots.some(slot => {
      const [hour, minute] = slot.split(':').map(Number);
      const slotTime = new Date();
      slotTime.setHours(hour, minute, 0);
      
      const oneHourBefore = new Date(slotTime.getTime() - 60 * 60 * 1000);
      return now >= oneHourBefore && now <= slotTime;
    });

    return {
      valid: isWithinWindow,
      message: isWithinWindow ? 'Within time window' : 'Not time to take this medicine yet',
    };
  },
};

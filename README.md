# 💊 Medicine Safety Net

An **elderly-friendly Hindi/English medicine safety app** that prevents medication errors through real-time dose tracking, drug interaction checking, and emergency alerts.

🌐 **Live App**: [https://medicine-safety-net.web.app](https://medicine-safety-net.web.app)

---

## 🎯 What's Included

### ✅ Phase 1: Foundation (Complete)
- **React + Vite + Firebase** setup
- **54 common Indian medicines** database (Aspirin → Naproxen, covering Diabetes, BP, Cholesterol, Thyroid, Heart, Pain, Gout, Alzheimer's, Depression)
- **Medicine cards** with large, accessible design (64px icons)
- **5 languages** — Hindi, English, Tamil, Marathi, Gujarati (i18n)
- **Local storage** for offline functionality

### ✅ Phase 2: Safety Features (Complete)
- **Reminder system** — Tracks doses, prevents double-dosing
- **Drug interaction checker** — Detects dangerous medicine combinations
- **Food conflict detection** — 13+ common foods (milk, coffee, spinach, grapefruit, etc.)
- **Side effects guide** — Common and rare side effects explained
- **Emergency alerts** — 10 symptom types, location sharing, family contacts
- **Family contacts** — Manage emergency contacts (name, phone, relation, email)
- **Tab navigation** — Home, Safety Check, Family tabs

### ✅ Phase 3: Testing & Deployment (Complete)
- **Interactive demo tour** with 3 scenarios
- **Comprehensive testing checklist**
- **Offline support verified** (works without internet)
- **Mobile responsive** (tested on all screen sizes)
- **Deployed to Firebase Hosting** ✅

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open browser
# http://localhost:5173/

# Click 🎬 Demo button to start interactive tour
```

---

## 🏗️ Features Overview

### 1. **Home Tab** 🏠
- Medicine reminders with large cards
- Dose tracking and prevention of double-doses
- Auto-detection of already-taken medicines
- Visual separation: Upcoming vs Taken medicines

### 2. **Safety Check Tab** 🛡️
- Drug interaction checker (54 medicines × cross-interactions)
- Food conflict detection (13+ foods)
- Real-time RED/YELLOW warnings
- Side effects guide (common & rare)

### 3. **Family Tab** 👨‍👩‍👧‍👦
- Add/edit/delete emergency contacts
- Contact relations: Doctor, Caregiver, Family, Friend, etc.
- Auto-notification during emergencies
- Inline validation (no intrusive popups)

### 4. **Emergency Alert** 🚨
- 10 symptom types (Chest Pain → Rash)
- Severity-based classification (Critical / High / Medium / Low)
- Geolocation sharing
- Family contact notification
- Success confirmation with auto-close

### 5. **Language Support** 🌍
- Hindi (हिंदी)
- English
- Tamil (தமிழ்)
- Marathi (मराठी)
- Gujarati (ગુજરાતી)
- Toggle in header — preference saved across sessions

### 6. **Accessibility** ♿
- Large buttons (48px+ for elderly)
- High contrast colors (WCAG AA)
- Emoji-based icons + text labels
- Keyboard navigation (Tab + Enter)
- Mobile responsive (320px–1920px)

---

## 📱 Supported Devices

| Device | Resolution | Status |
|--------|-----------|--------|
| Mobile | 320–480px | ✅ Optimized |
| Tablet | 768–1024px | ✅ Full support |
| Desktop | 1920px+ | ✅ Full features |
| Wearables | Future | 🔜 Planned |

---

## 🧪 Testing Guide

### Run Interactive Demo 🎬
1. Click **🎬 Demo** button (header)
2. Follow 3 scenarios:
   - Scenario 1: Medicine reminders
   - Scenario 2: Drug interactions
   - Scenario 3: Emergency flow
3. View test results dashboard

### Manual Testing Checklist

- [ ] **Reminder**: Click medicine → "Take Medicine" → dose recorded
- [ ] **Double-dose**: Try taking same medicine twice → RED warning
- [ ] **Drug interaction**: Safety Check → Aspirin + Warfarin → RED ❌
- [ ] **Food conflict**: Safety Check → Aspirin + Milk → YELLOW ⚠️
- [ ] **Emergency**: Click 🚨 → Select symptoms → Send alert → Success ✅
- [ ] **Language**: Toggle EN/हिंदी/தமிழ் → All text changes
- [ ] **Mobile**: Resize to 480px → All features work
- [ ] **Offline**: Network offline → Data persists, app responsive

---

## 📊 Database

**54 Medicines included across 10 categories:**

| Category | Medicines |
|---|---|
| Diabetes | Metformin, Glibenclamide, Glipizide, Pioglitazone, Voglibose, Insulin NPH |
| Blood Pressure | Aspirin, Amlodipine, Lisinopril, Atenolol, Ramipril, Enalapril, Nifedipine, Diltiazem, Verapamil, Metoprolol |
| Cholesterol | Atorvastatin, Pravastatin, Lovastatin, Simvastatin, Rosuvastatin |
| Acid Reflux | Omeprazole, Cimetidine, Ranitidine, Pantoprazole, Lansoprazole, Esomeprazole |
| Thyroid | Levothyroxine, Thyroxine T4 |
| Heart | Amiodarone, Digoxin, Aspirin + Clopidogrel |
| Water Retention | Furosemide, Spironolactone, Hydrochlorothiazide |
| Gout | Allopurinol, Colchicine |
| Alzheimer's | Donepezil, Rivastigmine, Galantamine |
| Depression/Pain | Sertraline, Paroxetine, Fluoxetine, Citalopram, Amitriptyline, Tramadol, Paracetamol, Naproxen, Ibuprofen |
| Supplements | Vitamin D3, Calcium + Vitamin D, Vitamin B12 |
| Blood Thinners | Warfarin |

**13 Food Conflicts tracked:**
Milk, Dairy, Coffee, Tea, Spinach, Broccoli, Banana, Orange, Potato, Tomato, Grapefruit, Meat, Alcohol

---

## ⚙️ Technology Stack

| Component | Technology |
|-----------|-----------|
| Frontend | React 19 + Vite |
| Styling | CSS3 + Responsive Design |
| Language | react-i18next (5 Indian languages) |
| Storage | localStorage (offline-first) |
| Hosting | Firebase Hosting (Live ✅) |
| APIs | Geolocation, Web Notifications, Web Audio |

---

## 📂 Project Structure

```
src/
├── components/
│   ├── MedicineCard.jsx          (64px icons, accessible)
│   ├── ReminderModal.jsx         (Safety checks + dose recording)
│   ├── SafetyCheckScreen.jsx     (Drug + food interactions)
│   ├── EmergencyAlert.jsx        (3-step emergency flow)
│   ├── FamilyContacts.jsx        (Contact management)
│   └── DemoMode.jsx              (Interactive demo tour)
├── services/
│   ├── firebase.js               (Firebase config)
│   ├── i18n.js                   (5-language support)
│   └── medicineService.js        (Dose tracking + interactions)
├── data/
│   └── medicines.json            (54 medicines database)
├── styles/                       (CSS for each component)
├── App.jsx                       (Main app + tabs)
└── main.jsx                      (Entry + i18n init)
```

---

## 🎯 Key Features

### ✅ Double-Dose Prevention
- Tracks doses per day in localStorage
- Shows RED warning if already taken today
- Displays the exact time medicine was last taken

### ✅ Drug Interaction Checking
- 54 medicines cross-referenced for interactions
- Real-time RED warnings for critical interactions
- Example: Aspirin + Warfarin = DANGER

### ✅ Food Conflict Detection
- 13 common foods checked in real-time
- YELLOW warnings for conflicts
- Food selections shared between Safety Check and Reminder modal

### ✅ Emergency Alerts
- 10 symptom types with severity levels (Critical → Low)
- Geolocation with accuracy info
- Family contact notification
- Offline backup to localStorage

### ✅ Offline-First
- Works without internet
- localStorage persists all data
- PWA installable on Android/iOS
- Syncs when online

---

## 🚀 Deployment

### Live on Firebase Hosting
```
https://medicine-safety-net.web.app
https://medicine-safety-net.firebaseapp.com
```

### Run Locally
```bash
npm install
npm run dev
```

### Build for Production
```bash
npm run build
```

---

## 📞 Next Steps

### Future Enhancements
- [ ] Voice input: "I have chest pain"
- [ ] SMS/Email alerts via Firebase Cloud Functions
- [ ] Hospital EMR integration
- [ ] Refill reminders with push notifications
- [ ] Wearable device support
- [ ] Doctor dashboard
- [ ] AI side-effect analysis

---

## 📄 License

MIT License — Free for use

---

**Built with ❤️ for elderly healthcare in India**

*One prevented medication error = Could save a life*

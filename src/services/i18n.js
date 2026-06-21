import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      app: {
        title: 'Medicine Safety Net',
        subtitle: 'Your Health, Your Control',
      },
      reminder: {
        title: 'Time to take your medicine',
        takenToday: 'Already taken today',
        takeNow: 'Take Medicine',
        notNow: 'Remind Later',
        foodWarning: '⚠️ Do not take with milk',
        drugWarning: '⚠️ Dangerous with Aspirin',
      },
      safety: {
        title: 'Safety Check',
        description: 'Before taking this medicine:',
        alreadyTaken: '✓ Already taken today?',
        foodConflict: '✓ Did you eat incompatible food?',
        drugConflict: '✓ Did you take conflicting medicines?',
        sideEffect: '✓ Do you have these side effects?',
      },
      emergency: {
        title: 'I Feel Unwell',
        description: 'What symptoms are you experiencing?',
        contact: 'Alert Family & Doctor',
        share_location: 'Share Location',
      },
      sideEffects: {
        common: 'Common',
        rare: 'Rare/Serious',
        when_contact_doctor: 'When to contact doctor',
      },
      nav: {
        home: 'Home',
        medicines: 'My Medicines',
        family: 'Family',
        emergency: 'Emergency',
      },
      common: {
        yes: 'Yes',
        no: 'No',
        ok: 'OK',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        close: 'Close',
      },
    },
  },
  hi: {
    translation: {
      app: {
        title: 'मेडिसिन सेफ्टी नेट',
        subtitle: 'आपका स्वास्थ्य, आपका नियंत्रण',
      },
      reminder: {
        title: 'दवा लेने का समय',
        takenToday: 'आज पहले ले चुके हैं',
        takeNow: 'दवा लें',
        notNow: 'बाद में याद दिलाएं',
        foodWarning: '⚠️ दूध के साथ न लें',
        drugWarning: '⚠️ एस्पिरिन के साथ खतरनाक',
      },
      safety: {
        title: 'सुरक्षा जांच',
        description: 'दवा लेने से पहले:',
        alreadyTaken: '✓ आज पहले ले चुके हैं?',
        foodConflict: '✓ क्या आपने असंगत भोजन खाया?',
        drugConflict: '✓ क्या आपने टकराव वाली दवा ली?',
        sideEffect: '✓ क्या आपको ये दुष्प्रभाव हैं?',
      },
      emergency: {
        title: 'मुझे बीमार लग रहा है',
        description: 'आप क्या लक्षण महसूस कर रहे हैं?',
        contact: 'परिवार और डॉक्टर को सतर्क करें',
        share_location: 'स्थान साझा करें',
      },
      sideEffects: {
        common: 'आम',
        rare: 'दुर्लभ/गंभीर',
        when_contact_doctor: 'डॉक्टर से कब संपर्क करें',
      },
      nav: {
        home: 'होम',
        medicines: 'मेरी दवाएं',
        family: 'परिवार',
        emergency: 'आपातकाल',
      },
      common: {
        yes: 'हाँ',
        no: 'नहीं',
        ok: 'ठीक है',
        cancel: 'रद्द करें',
        save: 'सहेजें',
        delete: 'हटाएं',
        edit: 'संपादित करें',
        close: 'बंद करें',
      },
    },
  },
  ta: {
    translation: {
      app: {
        title: 'மருந்து பாதுகாப்பு வலை',
        subtitle: 'உங்கள் ஆரோக்கியம், உங்கள் கட்டுப்பாடு',
      },
      reminder: {
        title: 'மருந்து எடுக்க வேண்டிய நேரம்',
        takenToday: 'இன்று ஏற்கனவே எடுத்துவிட்டீர்கள்',
        takeNow: 'மருந்து எடுக்கவும்',
        notNow: 'பின்னர் நினைவுபடுத்துக',
        foodWarning: '⚠️ பாலுடன் எடுக்க வேண்டாம்',
        drugWarning: '⚠️ ஆஸ்பிரின் உடன் ஆபத்தானது',
      },
      safety: {
        title: 'பாதுகாப்பு சரிபார்ப்பு',
        description: 'மருந்து எடுப்பதற்கு முன்:',
        alreadyTaken: '✓ இன்று ஏற்கனவே எடுத்துவிட்டீர்களா?',
        foodConflict: '✓ பொருந்தாத உணவு சாப்பிட்டீர்களா?',
        drugConflict: '✓ மோதல் மருந்து எடுத்தீர்களா?',
        sideEffect: '✓ இந்த பக்க விளைவுகள் உள்ளனவா?',
      },
      emergency: {
        title: 'என்னை நல்லவர் இல்லை',
        description: 'நீங்கள் என்ன அறிகுறிகளை உணருகிறீர்கள்?',
        contact: 'குடும்பம் மற்றும் டாக்டருக்கு எச்சரிக்கவும்',
        share_location: 'இருப்பிடத்தைப் பகிரவும்',
      },
      sideEffects: {
        common: 'பொதுவாக',
        rare: 'அரிய/கடுமையான',
        when_contact_doctor: 'எப்போது டாக்டரைத் தொடர்புகொள்ளவேண்டும்',
      },
      nav: {
        home: 'வீடு',
        medicines: 'என் மருந்துகள்',
        family: 'குடும்பம்',
        emergency: 'জরুரி',
      },
      common: {
        yes: 'ஆம்',
        no: 'இல்லை',
        ok: 'சரி',
        cancel: 'ரத்துசெய்',
        save: 'சேமி',
        delete: 'நீக்கு',
        edit: 'திருத்து',
        close: 'மூடவும்',
      },
    },
  },
  mr: {
    translation: {
      app: {
        title: 'औषध सुरक्षा जाळी',
        subtitle: 'तुमचे आरोग्य, तुमचा नियंत्रण',
      },
      reminder: {
        title: 'औषध घेण्याची वेळ',
        takenToday: 'आज आधीच घेतले आहे',
        takeNow: 'औषध घ्या',
        notNow: 'नंतर सांगा',
        foodWarning: '⚠️ दूधासह घ्यू नका',
        drugWarning: '⚠️ अॅस्पिरिनसह धोकादायक',
      },
      safety: {
        title: 'सुरक्षा तपासणी',
        description: 'औषध घेण्यापूर्वी:',
        alreadyTaken: '✓ आज आधीच घेतले आहे?',
        foodConflict: '✓ तुम्ही असुसंगत अन्न खाले?',
        drugConflict: '✓ तुम्ही संघर्ष औषध घेतले?',
        sideEffect: '✓ तुम्हाला हे दुष्प्रभाव आहेत?',
      },
      emergency: {
        title: 'मला आरोग्य नाही आहे',
        description: 'तुम्हाला कोणते लक्षण आहेत?',
        contact: 'कुटुंब आणि डॉक्टरला सतर्क करा',
        share_location: 'स्थान शेअर करा',
      },
      sideEffects: {
        common: 'सामान्य',
        rare: 'दुर्मिळ/गंभीर',
        when_contact_doctor: 'डॉक्टरशी कधी संपर्क करायचा',
      },
      nav: {
        home: 'मुख्यपृष्ठ',
        medicines: 'माझी औषधे',
        family: 'कुटुंब',
        emergency: 'आपातकाल',
      },
      common: {
        yes: 'होय',
        no: 'नाही',
        ok: 'ठीक आहे',
        cancel: 'रद्द करा',
        save: 'जतन करा',
        delete: 'हटवा',
        edit: 'संपादित करा',
        close: 'बंद करा',
      },
    },
  },
  gu: {
    translation: {
      app: {
        title: 'દવા સલામતી નેટ',
        subtitle: 'તમારું આરોગ્ય, તમારો નિયંત્રણ',
      },
      reminder: {
        title: 'દવા લેવાનો સમય',
        takenToday: 'આજ પહેલેથી લીધી છે',
        takeNow: 'દવા લો',
        notNow: 'પછીથી યાદ અપાવો',
        foodWarning: '⚠️ દૂધ સાથે લશો નહીં',
        drugWarning: '⚠️ એસ્પિરીન સાથે જોખમી',
      },
      safety: {
        title: 'સલામતી તપાસ',
        description: 'દવા લેતા પહેલાં:',
        alreadyTaken: '✓ આજ પહેલેથી લીધી છે?',
        foodConflict: '✓ તમે અસંગત ખોરાક લીધો?',
        drugConflict: '✓ તમે સંઘર્ષ દવા લીધી?',
        sideEffect: '✓ તમને આ આડ અસરો છે?',
      },
      emergency: {
        title: 'મને સારું નથી લાગતું',
        description: 'તમે કયા લક્ષણો અનુભવો છો?',
        contact: 'કુટુંબ અને ડોક્ટરને સાવચેત કરો',
        share_location: 'સ્થાન શેર કરો',
      },
      sideEffects: {
        common: 'સામાન્ય',
        rare: 'દુર્લભ/ગંભીર',
        when_contact_doctor: 'ડોક્ટર સાથે ક્યારે સંપર્ક કરવો',
      },
      nav: {
        home: 'ઘર',
        medicines: 'મારી દવાઓ',
        family: 'કુટુંબ',
        emergency: 'કટોકટી',
      },
      common: {
        yes: 'હા',
        no: 'ના',
        ok: 'ઠીક',
        cancel: 'રદ્દ કરો',
        save: 'સંગ્રહ કરો',
        delete: 'કાઢો',
        edit: 'સંપાદિત કરો',
        close: 'બંધ કરો',
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('language') || 'hi',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

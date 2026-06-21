# 🏗️ Medicine Safety Net: Architecture & Technical Documentation

This document provides a high-level overview of the system architecture, component interactions, and data flow of the Medicine Safety Net application.

---

## 1. High-Level System Architecture

The application is designed as an **Offline-First Single Page Application (SPA)**. It relies heavily on client-side processing to ensure it remains functional without an active internet connection, storing critical safety data locally in the browser.

```mermaid
graph TD
    %% Users & Interface
    User((User))
    
    subgraph "Frontend Client (Browser)"
        UI[React UI Components]
        State[React Hooks / State]
        Logic[Medicine Service Logic]
        I18n[i18n Translation Service]
        
        subgraph "Local Storage (IndexedDB/LocalStorage)"
            LocalDB[(Browser Storage)]
        end
        
        subgraph "Static Data"
            MedicinesJSON[(medicines.json)]
        end
    end
    
    subgraph "Cloud Infrastructure (Firebase)"
        Hosting[Firebase Hosting CDN]
    end
    
    %% Connections
    User <-->|Interacts| UI
    UI <-->|Reads/Updates| State
    State <-->|Calls functions| Logic
    UI <-->|Translates text| I18n
    Logic <-->|Persists user data| LocalDB
    Logic <-->|Reads conflict rules| MedicinesJSON
    
    Hosting -.->|Serves static assets| UI
    
    %% Styling
    classDef client fill:#e3f2fd,stroke:#1976d2,stroke-width:2px,color:#333;
    classDef cloud fill:#fff3e0,stroke:#f57c00,stroke-width:2px,color:#333;
    classDef db fill:#e8f5e9,stroke:#388e3c,stroke-width:2px,color:#333;
    
    class UI,State,Logic,I18n client;
    class Hosting cloud;
    class LocalDB,MedicinesJSON db;
```

> [!NOTE] 
> Because the application handles critical health data, executing the conflict analysis locally ensures **zero latency** and **100% privacy** (medical data is never sent to a backend server).

---

## 2. Component Interaction & Data Flow

This diagram illustrates how data flows when a user interacts with the app (e.g., adding a medicine or running a safety check).

```mermaid
sequenceDiagram
    participant User
    participant App as App.jsx (Main Router)
    participant Component as UI Component (e.g., SafetyCheck)
    participant Service as medicineService.js
    participant DB as medicines.json
    participant Storage as Browser LocalStorage

    User->>Component: Selects Medicine A & B
    Component->>Service: checkInteractions(medA, medB)
    Service->>DB: Query conflict rules for medA & medB
    DB-->>Service: Return rule matrix
    Service-->>Component: Return Conflict Warning or Safe Status
    Component-->>User: Display Red Warning / Green Safe Alert
    
    User->>Component: Click "Add Contact"
    Component->>Service: saveFamilyContact(contactData)
    Service->>Storage: Persist to window.localStorage
    Storage-->>Service: Success
    Service-->>Component: Update State
    Component-->>User: UI Updates Successfully
```

---

## 3. Technical Stack Breakdown

### Frontend Framework
*   **Library:** React 18
*   **Build Tool:** Vite (chosen for sub-second Hot Module Replacement and highly optimized Rollup production builds).
*   **Styling:** Vanilla CSS3 with CSS Variables for dynamic theming (Dark Mode/Light Mode).

### Core Services (`src/services/`)
*   **`medicineService.js`**: The core business logic engine. It exposes pure functions for analyzing cross-reactions between drugs, checking food conflicts, and managing the `localStorage` state for reminders and emergency contacts.
*   **`i18n.js`**: A custom localization engine. It exports dictionaries for multiple Indian languages (English, Hindi, Marathi, Gujarati, Tamil) and manages language state switching globally across the UI.
*   **`firebase.js`**: Initializes the Firebase SDK. Currently used minimally for potential future backend extensions.

### Static Database (`src/data/`)
*   **`medicines.json`**: Acts as a static, NoSQL-style document database. 
    *   Contains an array of 54 common medicines.
    *   Each medicine object contains nested schemas for `interactions`, `food_conflicts`, `dosages`, and localized `side_effects`.

### Deployment Pipeline
*   **Platform:** Firebase Hosting
*   **Methodology:** Custom REST API orchestration script using Google Cloud IAM Service Accounts to sign OAuth 2.0 JWTs.
*   **Optimization:** Aggressive `zlib` GZIP compression at level 9, strict SHA-256 asset hashing for cache-busting, and strict HTTP `Cache-Control` headers on entry files (`index.html`).

---

## 4. UI Component Hierarchy

```mermaid
graph TD
    App[App.jsx] --> Header[Navigation / Language / Demo]
    App --> MainContext[Main Context Router]
    
    MainContext --> Home[Home Tab]
    MainContext --> Safety[Safety Check Tab]
    MainContext --> Family[Family Contacts Tab]
    
    Home --> MedCard[MedicineCard.jsx]
    MedCard --> Reminder[ReminderModal.jsx]
    
    Safety --> SafetyScreen[SafetyCheckScreen.jsx]
    
    Family --> FamilyScreen[FamilyContacts.jsx]
    
    App --> SOS[EmergencyAlert.jsx Floating Button]
    
    %% Styling
    classDef main fill:#ede7f6,stroke:#5e35b1,stroke-width:2px,color:#333;
    classDef tab fill:#e0f7fa,stroke:#00838f,stroke-width:2px,color:#333;
    classDef comp fill:#fce4ec,stroke:#c2185b,stroke-width:2px,color:#333;
    
    class App,Header,MainContext main;
    class Home,Safety,Family tab;
    class MedCard,Reminder,SafetyScreen,FamilyScreen,SOS comp;
```

---

## 5. Security & Privacy Posture

> [!IMPORTANT]
> The Medicine Safety Net is built on a "Privacy by Design" philosophy.

1.  **No Server-Side Tracking:** User actions, medical queries, and emergency contacts are processed exclusively within the user's local browser memory.
2.  **No Authentication Required:** Users can instantly access life-saving information without the friction of creating an account or handing over an email address.
3.  **Local Storage Sanitization:** Inputs for custom symptoms or emergency contacts are sanitized before rendering to prevent Cross-Site Scripting (XSS) attacks.

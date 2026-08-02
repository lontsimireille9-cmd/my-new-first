# Suivi Employés — Base du projet

Squelette fonctionnel : **React (Vite) + Node.js/Express + Firebase** (Auth + Firestore).
Basé sur ta conception (ENUMS, rôles, workflow métier) déjà présente dans tes documents.

## Ce qui est déjà en place

- **Auth** : login Firebase Auth côté frontend, vérification du token côté backend (`requireAuth`), rôles (`EMPLOYEE`, `MANAGER`, `ADMIN`, `SUPER_ADMIN`) stockés dans Firestore (`requireRole`).
- **Présence** : pointage arrivée/départ, calcul automatique du retard, historique, vue équipe pour manager/admin.
- **Tâches** : création (manager/admin), liste filtrée par rôle, changement de statut (`TODO → IN_PROGRESS → REVIEW → COMPLETED...`).
- **Frontend** : pages Login / Dashboard / Présence / Tâches, layout avec navigation, Tailwind configuré.

## Composants importés de bridge-connector-frontend

Adaptés à ce projet (mêmes idées, code réécrit pour coller aux ENUMS et rôles du projet) :
- **Kit UI** (`src/components/ui/`) : Button, Card, Input, Label, Textarea, Select, Checkbox, Badge, Spinner, Dialog, Alert, Avatar, Container, Title, Toast.
- **Tâches** (`src/components/tasks/TaskStatusHistory.jsx`) : historique des changements de statut, alimenté par `statusHistory` côté backend (ajouté automatiquement à chaque `PATCH /tasks/:id/status`).
- **Calendrier** (`src/components/calendar/TeamCalendar.jsx`) : vue mensuelle croisant présence et échéances de tâches.
- **Layouts/Navigation** (`src/components/layouts/`) : Sidebar repliable (desktop), header + navigation basse (mobile).

Palette : "Ardoise & Signal" (bleu nuit `primary`, vert sauge `secondary`, corail `accent`) — définie dans `tailwind.config.js`, choisie pour rester lisible et professionnelle sans copier ni le style d'origine du projet ni les défauts génériques IA.

## Ce qui n'est PAS encore fait (prochaines étapes possibles)

- Gestion entreprises/agences/départements (multi-tenant)
- Congés, notifications, messagerie, rapports PDF/Excel, IA, module productivité/score
- Tests automatisés

## Démarrage

Depuis la racine du projet, tu peux lancer les deux parties avec :
```bash
npm run backend:dev
npm run frontend:dev
```

### 1. Créer le projet Firebase
1. Va sur [console.firebase.google.com](https://console.firebase.google.com), crée un projet.
2. Active **Authentication** → méthode Email/Mot de passe.
3. Active **Firestore Database** (mode production).
4. Récupère la config web (Paramètres du projet → Général → "Vos applications" → Web) → remplis `frontend/.env` (copie de `.env.example`).
5. Génère une clé de compte de service (Paramètres du projet → Comptes de service → "Générer une nouvelle clé privée") → remplis `backend/.env` avec `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` (garde les `\n` tels quels, ils sont convertis automatiquement).

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env   # puis remplis-le
npm run dev             # démarre sur http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
npm install
cp .env.example .env   # puis remplis-le
npm run dev             # démarre sur http://localhost:5173
```

En local, `VITE_API_URL` peut rester vide: Vite redirige `/api` vers le backend via `frontend/vite.config.js`.
En production, renseigne `VITE_API_URL` avec l'URL du backend Render.

### 4. Préparer la base de données

Le schéma Firestore et le seed local sont décrits dans `docs/DATABASE.md`.

Après avoir rempli `backend/.env` avec une clé Firebase Admin valide :

```bash
cd backend
npm run seed:db
```

### 5. Créer ton premier utilisateur
Il n'y a pas encore d'écran d'inscription (à faire). En attendant, pour créer le premier admin :
1. Crée l'utilisateur dans Firebase Auth Console (Authentication → Users → Add user).
2. Copie son UID.
3. Appelle `POST /api/auth/register-profile` (avec Postman/curl) avec :
```json
{ "uid": "COPIE_UID_ICI", "name": "Ton Nom", "email": "toi@exemple.com", "role": "SUPER_ADMIN" }
```
4. Connecte-toi ensuite normalement via `/login`.

## Structure

```
backend/
  src/
    config/firebase.js       # init Firebase Admin
    middleware/auth.middleware.js
    controllers/             # logique métier
    routes/                  # définition des endpoints
    index.js                 # serveur Express
frontend/
  src/
    firebase/config.js       # init Firebase client
    context/AuthContext.jsx  # état d'auth global
    services/api.js          # appels API avec token
    pages/                   # Login, Dashboard, Attendance, Tasks
    components/              # Layout, ProtectedRoute
```

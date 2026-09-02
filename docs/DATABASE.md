# Base de données Firestore

## Collections

### `companies/{companyId}`

- `name`: nom de l'entreprise.
- `status`: `ACTIVE` ou `DISABLED`.
- `workdayStartHour`: heure de référence pour le retard.
- `createdAt`, `updatedAt`: dates ISO.

### `users/{uid}`

- `uid`: identifiant Firebase Auth.
- `name`: nom affiché.
- `email`: email de connexion.
- `role`: `EMPLOYEE`, `MANAGER`, `ADMIN`, `SUPER_ADMIN`.
- `companyId`: entreprise rattachée.
- `status`: `ACTIVE` ou `DISABLED`.
- `createdAt`, `updatedAt`: dates ISO.

### `attendance/{uid_YYYY-MM-DD}`

- `userId`: identifiant Firebase Auth.
- `companyId`: entreprise de l'utilisateur.
- `date`: date au format `YYYY-MM-DD`.
- `clockIn`, `clockOut`: dates ISO.
- `status`: `PRESENT`, `LATE`, `ABSENT`.
- `location`: localisation optionnelle.

### `matricules/{matricule}`

- `uid`: utilisateur Firebase Auth correspondant.
- `email`: email technique généré (matricule@companyId.matricule.local), utilisé en interne pour la connexion par matricule + code.
- `companyId`: entreprise.
- `createdAt`: date ISO.

### `tasks/{taskId}`

- `title`, `description`: contenu de la tâche.
- `priority`: `LOW`, `MEDIUM`, `HIGH`, `URGENT`.
- `status`: `TODO`, `IN_PROGRESS`, `REVIEW`, `COMPLETED`, `REJECTED`, `CANCELLED`.
- `assigneeId`: utilisateur assigné.
- `createdBy`: créateur.
- `companyId`: entreprise.
- `deadline`: date optionnelle au format `YYYY-MM-DD`.
- `sortOrder`: ordre d'affichage, utilisé pour réordonner les tâches côté super admin.
- `statusHistory`: historique des statuts.
- `completedAt`: date de validation si la tâche passe à `COMPLETED`.
- `createdAt`, `updatedAt`: dates ISO.

## Initialisation locale

1. Révoque toute clé Firebase Admin exposée, puis génère une nouvelle clé privée.
2. Remplis `backend/.env` avec `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`.
3. Depuis `backend`, lance :

```bash
npm run seed:db
```

Le script crée :

- une entreprise de démo ;
- trois utilisateurs Firebase Auth ;
- trois profils Firestore ;
- une tâche de démo.

Identifiants par défaut :

- `admin@demo.local`
- `manager@demo.local`
- `employee@demo.local`

Mot de passe par défaut : valeur de `SEED_DEFAULT_PASSWORD`.

## Parcours d'inscription

1. Un administrateur s'inscrit sur `/register` (email + mot de passe classiques) → profil créé avec `role: ADMIN`, `companyId: null`.
2. Il est redirigé vers `/setup-company` pour créer son entreprise → son profil passe en `role: SUPER_ADMIN` avec le `companyId` de l'entreprise créée.
3. Depuis `/employes`, il crée des accès employés : matricule + nom + code (min. 6 caractères). Le code fait office de mot de passe.
4. L'employé se connecte sur `/login` (onglet "Employé") avec son matricule + code — aucun email n'est demandé côté UI.

## Règles et indexes

Les règles Firestore bloquent tout accès direct client. L'application passe par le backend Express avec Firebase Admin.

Depuis la racine du projet, déploie règles et indexes avec :

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

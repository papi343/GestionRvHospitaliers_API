# 🏥 Hôpital RDV - API de Gestion de Rendez-Vous Médicaux

Bienvenue dans l'API Backend de **Hôpital RDV**, une application moderne développée avec **NestJS 11**, **Prisma 7** et **MariaDB/MySQL** pour la gestion complète de rendez-vous médicaux en milieu hospitalier.

---

## 🚀 Technologies Utilisées

- **Framework Backend :** [NestJS 11](https://nestjs.com/) (TypeScript)
- **ORM & Base de Données :** [Prisma 7](https://www.prisma.io/) avec le Driver Adapter `@prisma/adapter-mariadb`
- **Base de Données relationnelle :** MariaDB / MySQL
- **Gestion des Variables d'Environnement :** `@nestjs/config`

---

## 📊 Modèle de Données (Prisma Schema)

L'application gère l'ensemble du flux hospitalier grâce aux modèles suivants :

- **`User`** : Comptes utilisateurs (`PATIENT`, `DOCTOR`, `ADMIN`) avec authentification et emails uniques.
- **`Patient`** : Profils patients (nom, date de naissance, historique de RDV).
- **`Doctor`** : Profils médecins (nom, numéro de licence unique, spécialités, disponibilités).
- **`Specialty`** & **`DoctorSpecialty`** : Spécialités médicales et association N-N avec les médecins.
- **`Availability`** : Plages horaires de disponibilité des médecins (début/fin).
- **`Appointment`** : Rendez-vous réservés liant un patient, un médecin et une disponibilité (`PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`).
- **`MedicalRecord`** : Dossiers médicaux et diagnostics associés à chaque rendez-vous.
- **`Notification`** : Notifications internes destinées aux utilisateurs.

---

## 🛠️ Prérequis

- **Node.js** (v20 ou supérieur recommandé)
- **npm** (v10 ou supérieur)
- Un serveur **MariaDB** ou **MySQL** en cours d'exécution.

---

## ⚙️ Installation & Configuration

### 1. Cloner le projet et installer les dépendances

```bash
npm install
```

### 2. Configurer le fichier d'environnement (`.env`)

Créez un fichier `.env` à la racine du projet s'il n'existe pas déjà :

```env
DATABASE_URL="mysql://root:password@localhost:3306/hopital_rdv"
PORT=3000
```

### 3. Exécuter la migration et générer Prisma Client

```bash
# Générer le client Prisma v7
npx prisma generate

# Pousser le schéma vers la base de données (Développement)
npx prisma db push
```

---

## 🏃‍♂️ Lancement de l'Application

```bash
# Mode développement avec Rechargement Chaud (Watch Mode)
npm run start:dev

# Mode production (Build & Start)
npm run build
npm run start:prod
```

---

## 📂 Structure du Projet

```text
hopital-rdv/
├── prisma/
│   └── schema.prisma         # Schéma de la base de données
├── src/
│   ├── prisma/
│   │   ├── prisma.module.ts  # Module Prisma Global
│   │   └── prisma.service.ts # Service Prisma avec adaptateur MariaDB
│   ├── app.controller.ts
│   ├── app.module.ts        # Module racine NestJS
│   ├── app.service.ts
│   └── main.ts               # Point d'entrée de l'application
├── prisma.config.ts          # Configuration spécifique Prisma 7
├── package.json
└── README.md
```

---

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests E2E (End-to-End)
npm run test:e2e

# Couverture de code
npm run test:cov
```

---

## 📝 Licence

Ce projet est sous licence **UNLICENSED**.

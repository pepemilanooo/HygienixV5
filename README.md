# HYGIENIX V5 - Pest Control Management System

SaaS completo per la gestione di interventi di disinfestazione, derattizzazione e sanificazione.

## 🏗️ Architettura Monorepo

```
hygienix/
├── apps/
│   ├── api/          # Backend Node.js/Express/Prisma
│   ├── web/          # Frontend Next.js 15 PWA
│   ├── desktop/      # Desktop App Tauri (Rust+React)
│   └── mobile/       # Mobile App Expo (React Native)
├── prisma/           # Schema database condiviso
└── scripts/          # Script utilità
```

## 🚀 Quick Start

### 1. Database (PostgreSQL)

```bash
# Crea database PostgreSQL
createdb hygienix

# Oppure con Docker
docker run -d --name postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=hygienix -p 5432:5432 postgres:16
```

### 2. Installazione

```bash
# Clona il repository
cd hygienix

# Installa dipendenze root
npm install

# Installa dipendenze API
cd apps/api && npm install && cd ../..

# Installa dipendenze Web
cd apps/web && npm install && cd ../..

# Installa dipendenze Desktop
cd apps/desktop && npm install && cd ../..

# Installa dipendenze Mobile
cd apps/mobile && npm install && cd ../..
```

### 3. Configurazione

```bash
# Copia file environment
cp .env.example .env

# Modifica .env con i tuoi valori:
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hygienix"
# JWT_SECRET="tuo-secret-key"
# NEXT_PUBLIC_API_URL="http://localhost:3001"
```

### 4. Database Setup

```bash
# Genera Prisma Client
cd apps/api && npx prisma generate

# Push schema al database
npx prisma db push

# Seed dati demo
npx ts-node prisma/seed.ts
```

## 🖥️ Avvio Sviluppo

### Backend API
```bash
npm run dev:api
# API disponibile su http://localhost:3001
```

### Web App
```bash
npm run dev:web
# App disponibile su http://localhost:3000
```

### Desktop App
```bash
cd apps/desktop
npm run tauri dev
# Finestra desktop 1200x800
```

### Mobile App
```bash
cd apps/mobile
npx expo start
# Scansiona QR con Expo Go (iOS/Android)
# Oppure premi 'a' per Android emulator / 'i' per iOS simulator
```

## 🔑 Credenziali Demo

| Ruolo   | Email            | Password |
|---------|------------------|----------|
| Admin   | admin@test.it    | 123      |
| Tecnico | tecnico@test.it  | 123      |

## 📡 Test API (cURL)

```bash
# Health Check
curl http://localhost:3001/api/health

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.it","password":"123"}'

# Lista Clienti (richiede token)
curl http://localhost:3001/api/clienti \
  -H "Authorization: Bearer TUO_TOKEN"

# Dashboard KPI
curl http://localhost:3001/api/dashboard/kpi \
  -H "Authorization: Bearer TUO_TOKEN"
```

## 📱 Deploy

### Railway (Consigliato)

1. Crea account su [Railway.app](https://railway.app)
2. Collega repository GitHub
3. Aggiungi variabili d'ambiente in Railway Dashboard
4. Deploy automatico su ogni push

### Docker

```bash
# Build API
docker build -t hygienix-api ./apps/api

# Build Web
docker build -t hygienix-web ./apps/web

# Docker Compose (todo)
```

### Desktop Build (EXE)

```bash
cd apps/desktop
npm run tauri build
# Output in: src-tauri/target/release/bundle/
```

### Mobile Build (APK/IPA)

```bash
cd apps/mobile
npx expo prebuild
# Android
cd android && ./gradlew assembleRelease
# iOS: apri progetto in Xcode e build
```

## 📊 Stack Tecnologico

| Layer       | Tecnologia                          |
|-------------|-------------------------------------|
| Backend     | Node.js, Express, Prisma, PostgreSQL|
| Web         | Next.js 15, Tailwind, shadcn/ui     |
| Desktop     | Tauri (Rust), React                 |
| Mobile      | Expo, React Native                  |
| Auth        | JWT                                 |
| Maps        | Google Maps API                     |

## 🗂️ Schema Database

- **Utenti**: Admin, Tecnici, Responsabili
- **Clienti**: Anagrafica con geolocalizzazione
- **Sedi**: Ubicazioni con coordinate GPS
- **Zone**: Aree interne/esterne (Cartellino)
- **Trappole**: Tipologie, posizioni, stato
- **Interventi**: Programmazione, check-in/out GPS
- **Rilevazioni**: Dati catture, foto
- **Prodotti**: Inventario e compliance

## 🛡️ Sicurezza

- JWT Authentication
- Password hashing (bcrypt)
- CORS configurato
- Helmet headers
- SQL injection protection (Prisma)
- XSS protection

## 📄 Licenza

Proprietario - HYGIENIX V5

## 🤝 Supporto

Per supporto tecnico: support@hygienix.it

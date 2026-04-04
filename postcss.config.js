# PRISMO v2 — AI Insurance Platform for Gig Workers

Full-stack web app with auth, dynamic premiums, shift-overlap payouts, and admin controls.

---

## Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS + React Router v6
- **Backend:** FastAPI + SQLite (SQLAlchemy) + Uvicorn

---

## Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+

---

### Step 1: Clone / unzip the project

Open the `prismo_v2` folder in VS Code.

---

### Step 2: Backend Setup

Open a **new terminal** in VS Code (`Ctrl+`` ` ``):

```bash
cd backend
pip install -r requirements.txt
```

Optional (better security, recommended):
```bash
pip install passlib[bcrypt] python-jose[cryptography]
```

Create your env file:
```bash
# Windows
copy ..\\.env.example .env

# Mac/Linux
cp ../.env.example .env
```

Start the backend:
```bash
uvicorn main:app --reload --port 8000
```

Backend runs at: http://localhost:8000
API docs at: http://localhost:8000/docs

---

### Step 3: Frontend Setup

Open a **second terminal** in VS Code:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

---

### Step 4: Open in browser

Go to: **http://localhost:5173**

---

## Demo Login Credentials

### Worker Portal
| Name | Email | Password | Zone | Status |
|------|-------|----------|------|--------|
| Ravi Kumar | ravi@prismo.in | ravi123 | Kasavanahalli | Active |
| Himesh Sharma | himesh@prismo.in | himesh123 | Kasavanahalli | Payment Due |
| Priya Devi | priya@prismo.in | priya123 | HSR Layout | Active |
| Suresh Nair | suresh@prismo.in | suresh123 | Lakdikapul | **Frozen** |
| Arjun Reddy | arjun@prismo.in | arjun123 | Bellandur | Active |
| Meena S | meena@prismo.in | meena123 | Whitefield | Grace Period |

### Admin Portal
| Email | Password |
|-------|----------|
| admin@prismo.in | admin123 |

---

## Features

- **JWT Auth** — Login/signup, role-based routing
- **Dynamic Weekly Premium** — Based on 7-day zone risk avg, metro city, night shift
- **Shift-Overlap Payout** — `daily_income × disruption_factor × (overlap_hours / shift_hours)`
- **Zone-Specific Triggers** — Only workers in affected zone get payout eligibility
- **Manual Weekly Payment** — Pay now button, due dates, grace period, freeze logic
- **Admin Controls** — Freeze/unfreeze workers, mark paid, create disruption events
- **Same-Zone Comparison** — Ravi & Himesh in Kasavanahalli show different payouts
- **Multilingual** — English + Hindi toggle in navbar
- **Live Weather API** — Add `OPENWEATHER_API_KEY` to `.env` for live data

---

## Project Structure

```
prismo_v2/
├── backend/
│   ├── main.py           # FastAPI routes
│   ├── models.py         # SQLAlchemy models
│   ├── database.py       # DB init + seed
│   ├── risk_engine.py    # Premium + payout logic
│   ├── auth.py           # JWT + password hashing
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── App.jsx               # Routes + auth context
│       ├── pages/
│       │   ├── LoginPage.jsx
│       │   ├── SignupPage.jsx
│       │   ├── WorkerDashboard.jsx
│       │   ├── ClaimsPage.jsx
│       │   ├── PaymentPage.jsx
│       │   ├── PolicyPage.jsx
│       │   ├── AdminDashboard.jsx
│       │   └── AdminZoneAnalytics.jsx
│       ├── components/
│       │   ├── Navbar.jsx
│       │   └── UI.jsx
│       └── utils/
│           ├── api.js       # All API calls
│           ├── auth.js      # Token storage
│           └── i18n.js      # EN + HI translations
└── .env.example
```

---

## Demo Scenarios to Test

### 1. Same-zone, different payout (Kasavanahalli)
- Login as **Ravi** (shift 9AM–4PM) → Claims → see 1h overlap with rain event
- Login as **Himesh** (shift 3PM–9PM) → Claims → see 3h overlap = higher payout

### 2. Frozen account
- Login as **Suresh** — account is frozen, can't file claims
- Login as **admin** → Dashboard → Unfreeze Suresh → confirm in Suresh's dashboard

### 3. Admin event creation
- Login as admin → Zone Analytics → Create disruption event for Kasavanahalli
- Login as Ravi → Claims → new event appears with overlap calculation

### 4. Language toggle
- Click `हिं` in navbar to switch to Hindi

### 5. Premium breakdown
- Login as any worker → Policy → see full premium breakdown with multipliers

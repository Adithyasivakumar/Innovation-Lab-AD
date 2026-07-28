# AI & DS Innovation Lab Management Portal (KiTE)

Enterprise web application built for the **Artificial Intelligence and Data Science (AI & DS) Innovation Lab** at KGiSL Institute of Technology (KiTE). The application manages students, faculty mentors, lab project prototypes, and placement tracking across 3 active student batches with strict Role-Based Access Control (RBAC).

---

## 🌟 Tech Stack

- **Backend**: Python 3.12 (FastAPI), SQLAlchemy ORM, Pydantic V2, JWT Authentication with bcrypt hashing.
- **Frontend**: Next.js 16 (App Router), Tailwind CSS, Recharts (Analytics graphs), Lucide Icons.
- **Database**: PostgreSQL / SQLite indexed on `email`, `role`, `batch`, and `roll_number`.

---

## 🎓 Active Student Batches

1. **Batch 1: "SOI Placement Batch"** (Final Year - placement tracking, LPA salary packages, company tiers).
2. **Batch 2: "3rd Year AI & DS Batch"** (Core specialization, mini-projects, skill matrix).
3. **Batch 3: "2nd Year AI & DS Batch"** (Foundations, lab onboarding, attendance).

---

## 🚀 Quick Start Guide

### 1. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt # or install fastapi uvicorn sqlalchemy pydantic email-validator python-jose bcrypt python-multipart pandas openpyxl
python seed.py
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` to log in and access the portal.

---

## 🔐 Demo Credentials

- **Admin / Lab Head**: `admin@kite.ac.in` / `admin123`
- **Faculty**: `faculty1@kite.ac.in` / `faculty123`
- **Student**: `student@kite.ac.in` / `student123`

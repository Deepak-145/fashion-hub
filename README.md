# Singh Fashion — MERN E-Commerce

Full-stack MERN store with JWT auth, Razorpay payments, admin panel, cart, wishlist, reviews.

## Stack
React + Vite + Tailwind + Redux Toolkit + React Router • Node + Express + MongoDB + Mongoose + JWT + Razorpay + Cloudinary

## Quick Start

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
npm run dev            # http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev            # http://localhost:5173
```

Frontend reads API base from `VITE_API_URL` (defaults to `http://localhost:5000/api`).
Frontend reads Razorpay key from `VITE_RAZORPAY_KEY_ID`.

### 3. Create admin
Register a normal user, then in MongoDB set `role: "admin"` on that user document. Admin panel is at `/admin`.

### 4. Cloudinary (optional)
Image upload uses Cloudinary if `CLOUDINARY_*` env vars are set, otherwise falls back to a local `uploads/` folder served at `/uploads`.

## Folder Structure
```
backend/
  config/      # db, cloudinary, razorpay
  controllers/ # auth, product, cart, order, wishlist, review, admin
  middleware/  # auth, admin, error, upload
  models/      # User, Product, Order, Cart, Wishlist, Review, Category
  routes/      # REST API
  utils/       # helpers
  server.js
frontend/
  src/
    components/ pages/ redux/slices/ utils/
    App.jsx main.jsx
```

## Env (backend/.env)
```
PORT=5000
MONGO_URI=
JWT_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLIENT_URL=http://localhost:5173
```

## Sizes
Shirts: S, M, L, XL — Pants: 28, 30, 32, 34, 36, 38 — Combo: both. Stock is tracked per size.

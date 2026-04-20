# ShopZone — Full-Stack E-Commerce Platform

A complete, production-ready e-commerce app built with React, Node.js, Express, and MongoDB.

---

## Tech Stack

| Layer     | Technology                               |
|-----------|------------------------------------------|
| Frontend  | React 18, Tailwind CSS, React Router v6  |
| Backend   | Node.js, Express.js                      |
| Database  | MongoDB Atlas (Mongoose ODM)             |
| Auth      | JWT + bcrypt                             |
| Payment   | Stripe (simulated in demo mode)          |
| Deploy    | Vercel (frontend) + Render (backend)     |

---

## Folder Structure

```
ecommerce/
├── client/                   # React frontend
│   ├── src/
│   │   ├── api/              # Axios instance with auth interceptor
│   │   ├── components/       # Navbar, Footer, ProductCard, Guards
│   │   ├── context/          # AuthContext, CartContext
│   │   └── pages/
│   │       ├── admin/        # Dashboard, Products, Orders, Users
│   │       ├── HomePage.jsx
│   │       ├── ProductsPage.jsx
│   │       ├── ProductDetailPage.jsx
│   │       ├── CartPage.jsx
│   │       ├── CheckoutPage.jsx
│   │       ├── LoginPage.jsx
│   │       └── RegisterPage.jsx
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── server/                   # Express backend
    ├── models/               # User, Product, Order schemas
    ├── routes/               # auth, products, orders, admin, payment
    ├── middleware/           # JWT auth, admin guard
    ├── seed/                 # Sample data seeder
    └── server.js
```

---

## Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- Git

---

### Step 1 — Clone and Install

```bash
# Clone the repo
git clone <your-repo-url>
cd ecommerce

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

---

### Step 2 — Configure Backend Environment

```bash
cd server
cp .env.example .env
```

Edit `.env` and fill in:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/ecommerce
JWT_SECRET=your_very_long_random_secret_key_here
CLIENT_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_your_stripe_key   # optional for demo
```

**Get MongoDB URI:**
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) → Create free cluster
2. Database Access → Add user with password
3. Network Access → Allow 0.0.0.0/0
4. Clusters → Connect → Drivers → Copy connection string

---

### Step 3 — Seed the Database

```bash
cd server
npm run seed
```

Output:
```
✅ Database seeded!
Admin: admin@shop.com / admin123
User:  john@example.com / user123
```

---

### Step 4 — Run the App

Open two terminals:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# Server running on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# App running on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173)

---

## API Endpoints

### Auth
| Method | Endpoint           | Description       | Auth |
|--------|--------------------|-------------------|------|
| POST   | /api/auth/register | Register user     | —    |
| POST   | /api/auth/login    | Login             | —    |
| GET    | /api/auth/profile  | Get profile       | ✓    |
| PUT    | /api/auth/profile  | Update profile    | ✓    |

### Products
| Method | Endpoint                    | Description         | Auth  |
|--------|-----------------------------|---------------------|-------|
| GET    | /api/products               | List + filter       | —     |
| GET    | /api/products/featured      | Featured products   | —     |
| GET    | /api/products/categories    | All categories      | —     |
| GET    | /api/products/:id           | Product detail      | —     |
| POST   | /api/products/:id/review    | Add review          | ✓     |

### Orders
| Method | Endpoint               | Description     | Auth |
|--------|------------------------|-----------------|------|
| POST   | /api/orders            | Place order     | ✓    |
| GET    | /api/orders/myorders   | My orders       | ✓    |
| GET    | /api/orders/:id        | Order detail    | ✓    |
| PUT    | /api/orders/:id/pay    | Mark paid       | ✓    |

### Admin (requires admin role)
| Method | Endpoint                     | Description        |
|--------|------------------------------|--------------------|
| GET    | /api/admin/stats             | Dashboard stats    |
| GET/POST | /api/admin/products        | List / Create      |
| PUT/DELETE | /api/admin/products/:id  | Update / Delete    |
| GET    | /api/admin/orders            | All orders         |
| PUT    | /api/admin/orders/:id/status | Update status      |
| GET    | /api/admin/users             | All users          |
| PUT    | /api/admin/users/:id         | Update role        |
| DELETE | /api/admin/users/:id         | Delete user        |

---

## Deployment Guide

### Deploy Backend to Render (Free)

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo, select the `server` folder
4. Set:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add all environment variables from `.env`
6. Deploy → copy your Render URL (e.g. `https://shopzone-api.onrender.com`)

---

### Deploy Frontend to Vercel (Free)

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo, select the `client` folder
3. Add environment variable:
   ```
   VITE_API_URL=https://shopzone-api.onrender.com/api
   ```
4. Deploy → your site is live!

---

### Update CORS on Backend

After deploying frontend, update `.env` on Render:
```env
CLIENT_URL=https://your-app.vercel.app
```

---

## Features Summary

- ✅ User registration & login with JWT
- ✅ Product browsing with search, filters, pagination
- ✅ Product detail page with image gallery and reviews
- ✅ Shopping cart with localStorage persistence
- ✅ Checkout with shipping + payment (COD, Card, Wallet)
- ✅ Stripe payment intent (simulated in demo)
- ✅ Order history and tracking
- ✅ User profile management
- ✅ Admin dashboard with stats
- ✅ Admin product management (CRUD)
- ✅ Admin order management (status updates)
- ✅ Admin user management (roles)
- ✅ Responsive design (mobile + desktop)
- ✅ 12 sample products with seeder

---

## Demo Credentials

| Role  | Email               | Password  |
|-------|---------------------|-----------|
| Admin | admin@shop.com      | admin123  |
| User  | john@example.com    | user123   |

---

## Adding Stripe (Optional)

1. Create account at [stripe.com](https://stripe.com)
2. Get test keys from Dashboard → Developers → API Keys
3. Add to server `.env`: `STRIPE_SECRET_KEY=sk_test_...`
4. Add to client `.env`: `VITE_STRIPE_PUBLIC_KEY=pk_test_...`
5. Install in client: `npm install @stripe/react-stripe-js @stripe/stripe-js`
6. Use `<Elements>` provider in CheckoutPage for real card form

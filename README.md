# 🛍️ SabaiSale — Premium E-Commerce Platform

> Nepal's premium full-stack e-commerce platform built with React, Node.js, Express & MongoDB.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://mongodb.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38BDF8?logo=tailwindcss)](https://tailwindcss.com)

---

## ✨ Features

| Feature | Details |
|---------|---------|
| 🎨 Premium UI | Apple/Nike-inspired design, dark mode, smooth Framer Motion animations |
| 🔐 Auth | JWT, bcrypt, role-based (user / admin) |
| 🛒 Cart & Checkout | Zustand state, multi-step checkout, NPR pricing |
| ❤️ Wishlist | Toggle wishlist, persistent across sessions |
| ⭐ Reviews | Star ratings, per-product, one per user |
| 📱 Responsive | Mobile-first, fully responsive on all screen sizes |
| 🔍 Search & Filter | Full-text search, category, price range, sort |
| 📊 Admin Panel | Dashboard with analytics, full CRUD for products/orders/users |
| 📦 50+ Products | 4 categories, realistic seeded data |
| 🖼️ Image Upload | Cloudinary integration |
| 🚀 Deployment Ready | Vercel (frontend) + Render (backend) |

---

## 🗂️ Folder Structure

```
sabaisale/
├── client/                        # React + Vite frontend
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   └── common/            # Navbar, Footer, ProductCard, etc.
│   │   ├── pages/
│   │   │   ├── admin/             # Dashboard, Products, Orders, Users, etc.
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── About.jsx
│   │   │   └── ...
│   │   ├── utils/
│   │   │   ├── api.js             # All axios API calls
│   │   │   └── store.js           # Zustand stores (auth, cart, wishlist, theme)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── vercel.json
│
└── server/                        # Express backend
    ├── models/
    │   ├── User.js
    │   ├── Product.js
    │   └── index.js               # Category, Order, Review, Founder
    ├── routes/
    │   ├── auth.js
    │   ├── products.js
    │   ├── categories.js
    │   ├── orders.js
    │   ├── cart.js
    │   ├── reviews.js
    │   ├── wishlist.js
    │   ├── founders.js
    │   ├── admin.js
    │   └── upload.js
    ├── middleware/
    │   └── auth.js
    ├── utils/
    │   └── seeder.js
    ├── index.js
    ├── render.yaml
    └── package.json
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)
- Git

### Step 1 — Clone & Install

```bash
git clone <your-repo-url>
cd sabaisale

# Install all dependencies at once
npm run install:all
```

### Step 2 — Configure Environment

```bash
cd server
cp ../.env.example .env
```

Edit `server/.env`:

```env
PORT=5000
NODE_ENV=development

# MongoDB Atlas — get from mongodb.com/atlas
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/sabaisale

# JWT Secret — use any long random string
JWT_SECRET=your_super_secret_key_minimum_32_chars_long

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173

# Cloudinary — get from cloudinary.com (free tier)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Admin Credentials
ADMIN_EMAIL=admin@sabaisale.com
ADMIN_PASSWORD=Jeevan@Sabaisale
```

### Step 3 — Seed the Database

```bash
cd server
npm run seed
```

Output:
```
✅ Connected to MongoDB
🗑️  Cleared existing data
✅ Created 4 categories
✅ Admin created: admin@sabaisale.com
✅ Created 51 products
✅ Created 2 founders
🎉 Database seeded successfully!
```

### Step 4 — Run the App

```bash
# From root directory — runs both frontend and backend
npm run dev
```

Or separately:
```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🔑 Demo Credentials

| Role  | Email | Password |
|-------|-------|----------|
| **Admin** | admin@sabaisale.com | Jeevan@Sabaisale |
| **User** | (register any account) | — |

**Admin Login:** Username is `Jeevandon`, admin email is `admin@sabaisale.com`

---

## 📡 API Reference

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register | — |
| POST | /api/auth/login | Login | — |
| GET | /api/auth/me | Get profile | ✓ |
| PUT | /api/auth/profile | Update profile | ✓ |
| PUT | /api/auth/change-password | Change password | ✓ |

### Products
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/products | List (filter, search, sort, paginate) | — |
| GET | /api/products/featured | Featured products | — |
| GET | /api/products/:id | Product detail | — |
| POST | /api/products | Create product | Admin |
| PUT | /api/products/:id | Update product | Admin |
| DELETE | /api/products/:id | Soft-delete | Admin |

### Categories
| GET/POST | /api/categories | List / Create | —/Admin |
| PUT/DELETE | /api/categories/:id | Update / Delete | Admin |

### Orders
| POST | /api/orders | Place order | ✓ |
| GET | /api/orders/my | My orders | ✓ |
| GET | /api/orders/:id | Order detail | ✓ |
| PUT | /api/orders/:id/status | Update status | Admin |

### Reviews
| GET | /api/reviews/product/:id | Product reviews | — |
| POST | /api/reviews | Add review | ✓ |
| PUT/DELETE | /api/reviews/:id | Edit/Delete | ✓ |

### Admin
| GET | /api/admin/dashboard | Analytics stats | Admin |
| GET | /api/admin/users | All users | Admin |
| PUT/DELETE | /api/admin/users/:id | Edit/Delete user | Admin |

---

## 🚀 Deployment

### Deploy Backend → Render

1. Push code to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your repo → select `server/` as root
4. Settings:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Node version:** 18
5. Add all environment variables from `.env`
6. Click **Deploy**
7. Copy your Render URL: `https://sabaisale-api.onrender.com`

### Deploy Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo → set **Root Directory** to `client`
3. Add environment variable:
   ```
   VITE_API_URL=https://sabaisale-api.onrender.com/api
   ```
4. Click **Deploy**
5. Your site: `https://sabaisale.vercel.app`

### Update CORS

After deploying frontend, update backend `.env` on Render:
```env
CLIENT_URL=https://sabaisale.vercel.app
```

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| State Management | Zustand |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Authentication | JWT, bcryptjs |
| Image Uploads | Cloudinary |
| Validation | express-validator |
| Deploy: Frontend | Vercel |
| Deploy: Backend | Render |

---

## 📸 Screenshots

> After running the app, you'll see:
> - **Homepage**: Hero slider, categories grid, featured products, testimonials
> - **Products**: Grid with filters sidebar, search, sort, pagination
> - **Product Detail**: Image gallery, reviews, related products
> - **Admin Panel**: Dark sidebar, dashboard analytics, full CRUD tables
> - **Dark Mode**: Full dark mode toggle everywhere

---

## 🛠️ Customization

### Change colors
Edit `client/tailwind.config.js` → `colors.primary` to change the orange theme.

### Add payment gateway
1. Create account at [eSewa](https://developer.esewa.com.np/) or [Khalti](https://docs.khalti.com/)
2. Add API keys to `.env`
3. Create payment routes in `server/routes/payment.js`
4. Add payment confirmation step in `client/src/pages/Checkout.jsx`

### Add more categories
Run the seeder again after editing `server/utils/seeder.js`.

---

## 📄 License

MIT — Built with ❤️ in Nepal by **Jeevan Don** & **Sabai Lama**

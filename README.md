# SabaiSale — Premium Full-Stack E-Commerce Platform

A complete, production-ready e-commerce app built with **React + Vite**, **Node.js/Express**, and **MongoDB**.

---

## ✨ Features

- ✅ User registration & login with JWT
- ✅ Product browsing with search, filters & pagination
- ✅ Product detail page with image gallery and reviews
- ✅ Shopping cart with localStorage persistence
- ✅ Multi-step checkout (Shipping → Payment → Review)
- ✅ Stripe payment integration (demo mode included)
- ✅ Order history and status tracking
- ✅ User profile management
- ✅ Admin dashboard with live stats
- ✅ Admin: Product, Order & User CRUD
- ✅ Responsive design (mobile + desktop)
- ✅ 12 sample products via database seeder

---

## 🗂️ Folder Structure

```
sabaisale/
├── client/                        # React + Vite frontend
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js           # Axios instance with auth interceptor
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Footer.jsx
│   │   │   ├── AdminRoute.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── ScrollToTop.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── AdminLayout.jsx
│   │   │   │   ├── AdminOrders.jsx
│   │   │   │   ├── AdminProducts.jsx
│   │   │   │   └── AdminUsers.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── OrderDetailPage.jsx
│   │   │   ├── OrderHistoryPage.jsx
│   │   │   ├── OrderPages.jsx
│   │   │   ├── OrderSuccessPage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── ProductsPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── server/                        # Node.js + Express backend
    ├── middleware/
    │   └── authMiddleware.js      # JWT protect + admin guard
    ├── models/
    │   ├── Order.js
    │   ├── Product.js
    │   └── User.js
    ├── routes/
    │   ├── adminRoutes.js
    │   ├── authRoutes.js
    │   ├── orderRoutes.js
    │   ├── paymentRoutes.js
    │   └── productRoutes.js
    ├── seed/
    │   └── seedData.js            # Sample data seeder
    ├── .env                       # Your local env file (gitignored)
    ├── .env.example               # Template — copy this
    ├── package.json
    └── server.js
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 18 + |
| npm | 9 + |
| MongoDB Atlas | Free tier works |
| Git | Any recent |

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/your-username/sabaisale.git
cd sabaisale
```

---

### Step 2 — Set Up the Backend

```bash
cd server
npm install
```

Copy the environment template and fill in your values:

```bash
cp .env.example .env
```

Open `.env` and set the following (see the `.env.example` section below for details):

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/sabaisale
JWT_SECRET=your_super_long_random_secret_at_least_32_chars
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_your_stripe_key_optional
```

#### How to get your MongoDB URI

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) → create a **free** cluster
2. **Database Access** → Add a database user (username + password)
3. **Network Access** → Add IP `0.0.0.0/0` (allow from anywhere)
4. **Clusters** → Connect → Drivers → copy the connection string
5. Replace `<password>` in the URI with your database user's password

---

### Step 3 — Seed the Database

```bash
cd server
npm run seed
```

Expected output:
```
Connected to MongoDB
Cleared existing data
Seeded 12 products

✅ Database seeded successfully!
Admin: admin@sabaisale.com / admin123
User:  john@example.com    / user123
```

---

### Step 4 — Set Up the Frontend

```bash
cd ../client
npm install
```

Create the client environment file:

```bash
# client/.env
VITE_API_URL=http://localhost:5000/api
```

> **Note:** If you're using the Vite proxy (default `vite.config.js`), you don't need `VITE_API_URL` for local development — requests to `/api` are automatically forwarded to port 5000.

---

### Step 5 — Run the App

Open **two terminals** from the project root:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# ✅ MongoDB connected
# ✅ Server running on port 5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# ✅ Local: http://localhost:5173
```

Then open [http://localhost:5173](http://localhost:5173) in your browser. 🎉

---

## 🔑 Demo Credentials

| Role  | Email                   | Password  |
|-------|-------------------------|-----------|
| Admin | admin@sabaisale.com     | admin123  |
| User  | john@example.com        | user123   |

---

## 🛠️ Available Scripts

### Server (`/server`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with nodemon (auto-restart) |
| `npm start` | Start in production mode |
| `npm run seed` | Seed the database with sample data |

### Client (`/client`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

---

## 📡 API Reference

### Auth Routes — `/api/auth`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | ❌ |
| POST | `/login` | Login & get token | ❌ |
| GET | `/profile` | Get logged-in user | ✅ |
| PUT | `/profile` | Update profile | ✅ |

### Product Routes — `/api/products`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | List with filters, search, pagination | ❌ |
| GET | `/featured` | Featured products | ❌ |
| GET | `/categories` | All categories | ❌ |
| GET | `/:id` | Product detail | ❌ |
| POST | `/:id/review` | Submit review | ✅ |

### Order Routes — `/api/orders`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Place new order | ✅ |
| GET | `/myorders` | My order history | ✅ |
| GET | `/:id` | Order detail | ✅ |
| PUT | `/:id/pay` | Mark order as paid | ✅ |

### Admin Routes — `/api/admin` (Admin only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stats` | Dashboard stats |
| GET / POST | `/products` | List / Create products |
| PUT / DELETE | `/products/:id` | Update / Delete product |
| GET | `/orders` | All orders |
| PUT | `/orders/:id/status` | Update order status |
| GET | `/users` | All users |
| PUT | `/users/:id` | Update user role |
| DELETE | `/users/:id` | Delete user |

---

## 🌐 Deployment Guide

### Deploy Backend → [Render](https://render.com) (Free)

1. Push your project to GitHub
2. Go to **Render** → New → **Web Service**
3. Connect your repo, set **Root Directory** to `server`
4. Settings:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add **Environment Variables** (same as your `.env`):
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLIENT_URL` → your Vercel URL (add after deploying frontend)
6. Deploy — copy your Render URL (e.g. `https://sabaisale-api.onrender.com`)

---

### Deploy Frontend → [Vercel](https://vercel.com) (Free)

1. Go to **Vercel** → New Project → import your GitHub repo
2. Set **Root Directory** to `client`
3. Add Environment Variable:
   ```
   VITE_API_URL=https://sabaisale-api.onrender.com/api
   ```
4. Deploy — your site is live!

---

### Final Step — Update CORS

Go back to your Render backend → Environment → update:
```env
CLIENT_URL=https://your-app.vercel.app
```

Redeploy the backend. Done! ✅

---

## 💳 Stripe Integration (Optional)

The app ships with a simulated card payment. To enable real Stripe:

1. Create account at [stripe.com](https://stripe.com)
2. Dashboard → Developers → API Keys → copy **Test** keys
3. Add to server `.env`:
   ```env
   STRIPE_SECRET_KEY=sk_test_...
   ```
4. Add to client `.env`:
   ```env
   VITE_STRIPE_PUBLIC_KEY=pk_test_...
   ```
5. Wrap your `CheckoutPage` with `<Elements>` from `@stripe/react-stripe-js` for a real card form

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| Auth | JWT + bcrypt |
| Payment | Stripe (demo mode included) |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 🔧 Tailwind CSS Setup (Already Configured)

The project uses Tailwind v3. Key config files:

**`client/tailwind.config.js`**
```js
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#f97316', light: '#fed7aa', dark: '#ea580c' },
      },
    },
  },
  plugins: [],
}
```

**`client/postcss.config.js`**
```js
export default { plugins: { tailwindcss: {}, autoprefixer: {} } }
```

**`client/src/index.css`** — imports Tailwind and defines reusable component classes (`btn-primary`, `input-field`, `card`, `badge`).

---

## 🐛 Common Issues

| Problem | Fix |
|---------|-----|
| `MongooseServerSelectionError` | Check your `MONGO_URI` and whitelist your IP in Atlas |
| `401 Unauthorized` on all routes | Check `JWT_SECRET` matches between `.env` and token generation |
| CORS error in browser | Ensure `CLIENT_URL` in server `.env` matches your frontend URL exactly |
| Vite proxy not working | Make sure backend is running on port 5000 |
| `npm run seed` fails | Verify `MONGO_URI` is set in `server/.env` |

---

## 📄 License

MIT — free to use for personal and commercial projects.
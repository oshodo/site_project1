# 🛍️ SabaiSale — Production eCommerce Platform

A full-stack MERN eCommerce platform built for Nepal with admin dashboard, Cloudinary image uploads, order tracking, JWT authentication, and more.

---

## 🚀 Quick Start (3 Steps)

### Step 1 — Install dependencies
```bash
npm run install:all
```

### Step 2 — Configure environment variables

**Server** → Edit `server/.env` (already created):
```
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/sabaisale
JWT_SECRET=your_random_secret_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Client** → Edit `client/.env`:
```
VITE_API_URL=http://localhost:5000/api
```

### Step 3 — Seed the database + run
```bash
npm run seed     # Creates admin user, categories, and 8 sample products
npm run dev      # Starts both backend (5000) and frontend (5173)
```

**Admin Login:**
- URL: http://localhost:5173/admin
- Email: `admin@sabaisale.com`
- Password: `Admin@Sabaisale123`

---

## 📁 Project Structure

```
sabaisale/
├── package.json               ← Root scripts (concurrently)
│
├── server/
│   ├── .env                   ← ⚠️ Fill with your credentials
│   ├── index.js               ← Express app entry point
│   ├── config/
│   │   └── cloudinary.js      ← Cloudinary + Multer config
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── adminController.js
│   │   └── uploadController.js
│   ├── middleware/
│   │   └── auth.js            ← protect() + adminOnly() JWT middleware
│   ├── models/
│   │   ├── User.js            ← role: user | admin
│   │   ├── Product.js         ← images[], reviews[], stock
│   │   ├── Order.js           ← status history, VAT, shipping
│   │   └── Category.js
│   ├── routes/
│   │   ├── auth.js            ← /api/auth/*
│   │   ├── products.js        ← /api/products/*
│   │   ├── orders.js          ← /api/orders/*
│   │   ├── admin.js           ← /api/admin/* (admin only)
│   │   ├── upload.js          ← /api/upload (Cloudinary)
│   │   ├── categories.js
│   │   ├── reviews.js
│   │   ├── wishlist.js
│   │   └── cart.js
│   └── utils/
│       └── seeder.js          ← Run with: npm run seed
│
└── client/
    ├── .env                   ← VITE_API_URL
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx            ← All routes including admin
        ├── index.css          ← Tailwind + custom classes
        ├── utils/
        │   ├── api.js         ← All Axios API calls
        │   └── store.js       ← Zustand: auth, cart, wishlist, theme
        ├── components/
        │   └── common/
        │       ├── Navbar.jsx
        │       ├── Footer.jsx
        │       ├── ProductCard.jsx
        │       ├── ImageUpload.jsx    ← Cloudinary drag & drop
        │       └── ProtectedRoute.jsx ← Route guards
        └── pages/
            ├── Home.jsx
            ├── Products.jsx
            ├── ProductDetail.jsx
            ├── Cart.jsx
            ├── Checkout.jsx
            ├── Login.jsx
            ├── Register.jsx
            ├── Profile.jsx
            ├── MyOrders.jsx
            └── admin/
                ├── AdminLayout.jsx    ← Sidebar layout
                ├── AdminDashboard.jsx ← Analytics overview
                ├── AdminProducts.jsx  ← Add/Edit/Delete + upload
                ├── AdminCategories.jsx
                ├── AdminOrders.jsx    ← Status update modal
                └── AdminUsers.jsx     ← Promote/deactivate/delete
```

---

## 🔐 API Reference

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET  | `/api/auth/me` | User |
| PUT  | `/api/auth/profile` | User |
| PUT  | `/api/auth/change-password` | User |

### Products
| Method | Endpoint | Access |
|--------|----------|--------|
| GET  | `/api/products` | Public |
| GET  | `/api/products/:id` | Public |
| POST | `/api/products` | Admin |
| PUT  | `/api/products/:id` | Admin |
| DELETE | `/api/products/:id` | Admin |
| POST | `/api/products/:id/reviews` | User |

### Orders
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/orders` | User |
| GET  | `/api/orders/my` | User |
| GET  | `/api/orders/:id` | User/Admin |
| GET  | `/api/orders` | Admin |
| PUT  | `/api/orders/:id/status` | Admin |

### Upload (Cloudinary)
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/upload` | Admin |
| POST | `/api/upload/multiple` | Admin |
| DELETE | `/api/upload/:publicId` | Admin |

### Admin
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/admin/dashboard` | Admin |
| GET | `/api/admin/users` | Admin |
| PUT | `/api/admin/users/:id` | Admin |
| DELETE | `/api/admin/users/:id` | Admin |

---

## ⚙️ External Services Setup

### MongoDB Atlas (Free)
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free cluster → Connect → Get connection string
3. Replace `MONGO_URI` in `server/.env`

### Cloudinary (Free)
1. Go to [cloudinary.com](https://cloudinary.com) → Sign up
2. Dashboard → Copy Cloud Name, API Key, API Secret
3. Replace the 3 `CLOUDINARY_*` vars in `server/.env`

---

## 🎯 Features

- ✅ JWT Role-based Auth (user / admin)
- ✅ Admin Dashboard with analytics
- ✅ Product CRUD with Cloudinary image upload
- ✅ Order system: Pending → Processing → Shipped → Delivered
- ✅ Order status history timeline
- ✅ Server-side price validation (tamper-proof)
- ✅ Stock management (auto-decrement on order, restore on cancel)
- ✅ 13% VAT + free shipping logic
- ✅ Full-text product search
- ✅ Dark mode
- ✅ Cart (Zustand + persisted)
- ✅ Wishlist sync
- ✅ Product reviews (one per user)
- ✅ Rate limiting + Helmet security
- ✅ Responsive mobile UI

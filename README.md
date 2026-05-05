# 🛍️ SabaiSale — Complete Setup & Deployment Guide

---

## 🔧 STEP 1 — Install Node.js

1. Go to https://nodejs.org
2. Download **LTS version** (e.g. 20.x)
3. Install it — keep clicking Next
4. Open Terminal (Mac) or Command Prompt (Windows) and verify:
   ```
   node -v
   npm -v
   ```
   Both should print a version number.

---

## 🍃 STEP 2 — Set up MongoDB Atlas (Free Database)

1. Go to https://mongodb.com/atlas and click **"Try Free"**
2. Sign up with your Google account
3. Choose **FREE M0 tier** → pick any region → Create Cluster
4. In left sidebar → **"Database Access"** → Add New Database User
   - Username: `sabaisaleuser`
   - Password: click "Autogenerate" → **copy the password**
   - Role: "Atlas Admin" → Add User
5. In left sidebar → **"Network Access"** → Add IP Address → **"Allow Access from Anywhere"** → Confirm
6. In left sidebar → **"Database"** → click **"Connect"** on your cluster
7. Choose **"Connect your application"** → Driver: Node.js
8. Copy the connection string — it looks like:
   ```
   mongodb+srv://sabaisaleuser:PASSWORD@cluster0.xxxxx.mongodb.net/
   ```
9. Replace `<password>` with your actual password
10. Add `sabaisale` before `?`:
    ```
    mongodb+srv://sabaisaleuser:PASSWORD@cluster0.xxxxx.mongodb.net/sabaisale?retryWrites=true&w=majority
    ```
    **Save this — you need it in Step 5.**

---

## ☁️ STEP 3 — Set up Cloudinary (Free Image Hosting)

1. Go to https://cloudinary.com → **"Sign Up For Free"**
2. Sign up with your Google account
3. After login, you land on the Dashboard
4. You will see these 3 values — **copy all three:**
   - **Cloud Name** (e.g. `dxyz12345`)
   - **API Key** (e.g. `123456789012345`)
   - **API Secret** (e.g. `abcdefghijklmnopqrstuvwxyz12`)
5. **Save these — you need them in Step 5.**

---

## 🔑 STEP 4 — Set up Google OAuth (for Sign In with Google)

1. Go to https://console.cloud.google.com
2. Sign in with `jeevan808078018@gmail.com`
3. At the top, click **"Select a project"** → **"New Project"**
   - Name: `SabaiSale`
   - Click **Create**
4. In the left menu → **"APIs & Services"** → **"OAuth consent screen"**
   - User Type: **External** → Create
   - App name: `SabaiSale`
   - User support email: `jeevan808078018@gmail.com`
   - Developer contact: `jeevan808078018@gmail.com`
   - Click **"Save and Continue"** (skip Scopes, skip Test Users)
   - Click **"Back to Dashboard"**
5. In left menu → **"Credentials"** → **"+ Create Credentials"** → **"OAuth 2.0 Client IDs"**
   - Application type: **Web application**
   - Name: `SabaiSale Web`
   - **Authorized JavaScript origins:** add `http://localhost:5173`
   - **Authorized redirect URIs:** add `http://localhost:5000/api/auth/google/callback`
   - Click **Create**
6. A popup shows your credentials — **copy both:**
   - **Client ID** (ends in `.apps.googleusercontent.com`)
   - **Client Secret**
7. **Save these — you need them in Step 5.**

---

## ⚙️ STEP 5 — Configure Environment Variables

Open the file `server/.env` in any text editor (Notepad, VS Code, etc.) and fill in all the values:

```
MONGO_URI=mongodb+srv://sabaisaleuser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/sabaisale?retryWrites=true&w=majority

JWT_SECRET=SabaiSaleSecretKey2024ChangeMeNow

PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

ADMIN_EMAIL=admin@sabaisale.com
ADMIN_PASSWORD=Admin@Sabaisale123
```

Save the file.

---

## 📦 STEP 6 — Install All Dependencies

Open Terminal / Command Prompt **inside the `sabaisale` folder** and run:

```bash
npm run install:all
```

This installs packages for root, server, and client. Takes 1-2 minutes.

---

## 🌱 STEP 7 — Seed the Database

```bash
npm run seed
```

This creates:
- ✅ Admin account for `jeevan808078018@gmail.com` (Google login)
- ✅ Backup admin: `admin@sabaisale.com` / `Admin@Sabaisale123`
- ✅ 5 product categories
- ✅ 10 sample products

---

## 🚀 STEP 8 — Run the App

```bash
npm run dev
```

This starts both servers simultaneously:
- **Backend:** http://localhost:5000
- **Frontend:** http://localhost:5173

Open your browser at **http://localhost:5173**

---

## 🔐 STEP 9 — Login as Admin

1. Go to http://localhost:5173/login
2. Click **"Continue with Google"**
3. Sign in with `jeevan808078018@gmail.com`
4. You will automatically land on the **Admin Panel** at `/admin`

---

## ⚙️ What You Can Do in Admin Panel

| Feature | Location |
|---------|----------|
| View analytics & revenue | Dashboard |
| Add new product with images | Products → Add Product |
| Edit any product | Products → Edit |
| Delete product | Products → Delete |
| Add/edit categories | Categories |
| View all orders | Orders |
| Update order status | Orders → View → Update Status |
| Promote user to admin | Users → Promote |
| Deactivate user | Users → Deactivate |
| Delete user | Users → Delete |

---

## 🌐 STEP 10 — Deploy Online (Render + Vercel)

### Deploy Backend on Render (Free)

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
   Then create a new repo at https://github.com and push.

2. Go to https://render.com → Sign up with GitHub
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repo
5. Settings:
   - Name: `sabaisale-api`
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Click **"Advanced"** → Add Environment Variables (paste all from server/.env)
7. Click **"Create Web Service"**
8. Wait ~3 minutes → Copy your Render URL e.g. `https://sabaisale-api.onrender.com`

### Deploy Frontend on Vercel (Free)

1. Go to https://vercel.com → Sign up with GitHub
2. Click **"New Project"** → Import your repo
3. Settings:
   - Framework: Vite
   - Root Directory: `client`
4. Add Environment Variable:
   - `VITE_API_URL` = `https://sabaisale-api.onrender.com/api`
5. Click **Deploy**
6. Wait ~2 minutes → your site is live!

### Update Google OAuth for Production

Go back to Google Cloud Console → Credentials → your OAuth client:
- Add your Vercel URL to **Authorized JavaScript origins**
- Add `https://sabaisale-api.onrender.com/api/auth/google/callback` to **Authorized redirect URIs**

Also update in Render environment variables:
- `CLIENT_URL` = your Vercel URL
- `GOOGLE_CALLBACK_URL` = `https://sabaisale-api.onrender.com/api/auth/google/callback`

---

## 🐛 Bugs Fixed in This Version

| # | Bug | Fix |
|---|-----|-----|
| 1 | `seeder.js` dotenv path was wrong (CWD-relative) | Used `path.resolve(__dirname)` |
| 2 | Order stock restoration checked `order.status` AFTER it was mutated | Saved `previousStatus` before mutation |
| 3 | Zustand `total()` / `itemCount()` were functions inside store, not reactive selectors | Extracted as `selectCartTotal`, `selectCartItemCount` |
| 4 | Garbage directories from bad `mkdir` command | Removed |
| 5 | Cart could show stale totals | Now uses proper Zustand selectors |


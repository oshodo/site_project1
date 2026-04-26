# 🚀 SabaiSale Deployment Guide

## STEP 1 — Google OAuth Setup

1. Go to https://console.cloud.google.com
2. Create new project: "SabaiSale"
3. APIs & Services → Enable "Google+ API" or "Google Identity"
4. Credentials → Create OAuth 2.0 Client ID
   - Application type: Web application
   - Authorized redirect URIs:
     - `https://sabaisales.onrender.com/api/auth/google/callback`
     - `http://localhost:5000/api/auth/google/callback` (for local dev)
5. Copy: Client ID + Client Secret

---

## STEP 2 — GitHub Push

```bash
cd Desktop/Sabaisale
git init
git add .
git commit -m "SabaiSale complete with Google OAuth"
git remote add origin https://github.com/YOUR_USERNAME/sabaisale.git
git branch -M main
git push -u origin main
```

---

## STEP 3 — Render (Backend)

1. render.com → New Web Service → Connect GitHub
2. Select `sabaisale` repo
3. Settings:
   - Root Directory: `server`
   - Build: `npm install`
   - Start: `npm start`

4. Environment Variables (add all):
```
NODE_ENV          = production
PORT              = 10000
MONGO_URI         = mongodb+srv://Jeevan:Jeevan1197@cluster0.ydmbmtd.mongodb.net/sabaisale?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET        = sabaisale_super_secret_jwt_key_2024_jeevandon_production
CLIENT_URL        = https://sabaisale.vercel.app
GOOGLE_CLIENT_ID  = (from Google Console)
GOOGLE_CLIENT_SECRET = (from Google Console)
GOOGLE_CALLBACK_URL = https://sabaisales.onrender.com/api/auth/google/callback
CLOUDINARY_CLOUD_NAME = (optional)
CLOUDINARY_API_KEY    = (optional)
CLOUDINARY_API_SECRET = (optional)
```

5. Deploy → wait 3-5 min → copy URL

---

## STEP 4 — Vercel (Frontend)

1. vercel.com → New Project → Import GitHub repo
2. Settings:
   - Root Directory: `client`
   - Framework: Vite
   - Build: `npm run build`
   - Output: `dist`

3. Environment Variables:
```
VITE_API_URL = https://sabaisales.onrender.com/api
VITE_GOOGLE_CLIENT_ID = (from Google Console)
```

4. Deploy → get URL → update Render's CLIENT_URL

---

## STEP 5 — Add Products

Run in PowerShell after deploy:
```powershell
.\add-products.ps1
```

---

## Final URLs
- Frontend: https://sabaisale.vercel.app
- Backend:  https://sabaisales.onrender.com
- Admin:    https://sabaisale.vercel.app/admin

## Admin Login
- Email: admin@sabaisale.com
- Password: Jeevan@Sabaisale

## Coupons
- SABAI10 = 10% off
- JEEVAN20 = 20% off
- NEPAL15 = 15% off
- WELCOME50 = 50% off

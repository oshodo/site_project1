const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Passport config
require('./config/passport');
const passport = require('passport');

const app = express();

// ─── Security ─────────────────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: false }));

const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'https://sabaisale.vercel.app',
];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 500 }));

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(session({
  secret: process.env.JWT_SECRET || 'sabaisale_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 },
}));
app.use(passport.initialize());
app.use(passport.session());
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/products',   require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/orders',     require('./routes/orders'));
app.use('/api/cart',       require('./routes/cart'));
app.use('/api/reviews',    require('./routes/reviews'));
app.use('/api/wishlist',   require('./routes/wishlist'));
app.use('/api/founders',   require('./routes/founders'));
app.use('/api/admin',      require('./routes/admin'));
app.use('/api/upload',     require('./routes/upload'));

// ─── Health ───────────────────────────────────────────────────────────────────
app.get('/', (req, res) => res.json({ message: '🛍️ SabaiSale API running!', status: 'ok' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
  })
  .catch(err => { console.error('❌ DB Error:', err.message); process.exit(1); });

module.exports = app;

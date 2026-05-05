// ============================================================
// server/config/passport.js  —  Google OAuth 2.0 Strategy
// ============================================================
const passport      = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User           = require('../models/User');

// ADMIN_EMAIL list — anyone in this list gets role=admin on first login
const ADMIN_EMAILS = [
  'jeevan808078018@gmail.com',
  // add more admin emails here if needed
];

passport.use(
  new GoogleStrategy(
    {
      clientID:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:  process.env.GOOGLE_CALLBACK_URL ||
                    'http://localhost:5000/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email  = profile.emails[0].value.toLowerCase();
        const avatar = profile.photos[0]?.value || '';
        const name   = profile.displayName;

        // Is this a privileged email?
        const isAdminEmail = ADMIN_EMAILS.includes(email);

        // 1. Find by googleId first (returning user)
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // Upgrade to admin if email matches and they're not already admin
          if (isAdminEmail && user.role !== 'admin') {
            user.role = 'admin';
          }
          user.lastLogin = new Date();
          user.avatar    = avatar;
          await user.save({ validateBeforeSave: false });
          return done(null, user);
        }

        // 2. Find by email (account exists but no googleId yet)
        user = await User.findOne({ email });
        if (user) {
          user.googleId  = profile.id;
          user.avatar    = avatar;
          user.lastLogin = new Date();
          if (isAdminEmail && user.role !== 'admin') user.role = 'admin';
          await user.save({ validateBeforeSave: false });
          return done(null, user);
        }

        // 3. New user — create account
        user = await User.create({
          name,
          email,
          googleId:  profile.id,
          avatar,
          role:      isAdminEmail ? 'admin' : 'user',
          lastLogin: new Date(),
        });

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Not using sessions — we use JWT, so these are no-ops
passport.serializeUser((user, done)   => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

module.exports = passport;

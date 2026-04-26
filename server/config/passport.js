const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
  clientID:     process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL:  process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.emails[0].value });
    if (user) {
      if (!user.avatar) { user.avatar = profile.photos[0]?.value; await user.save({ validateBeforeSave: false }); }
      return done(null, user);
    }
    user = await User.create({
      name: profile.displayName,
      email: profile.emails[0].value,
      avatar: profile.photos[0]?.value || '',
      password: `google_oauth_${profile.id}_${Date.now()}`,
      isActive: true,
    });
    done(null, user);
  } catch (err) { done(err, null); }
}));

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try { const user = await User.findById(id); done(null, user); }
  catch (err) { done(err, null); }
});

module.exports = passport;

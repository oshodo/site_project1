const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true, maxlength: 50 },
  username: { type: String, unique: true, sparse: true, trim: true, lowercase: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true,
              match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email'] },
  password: { type: String, required: true, minlength: 6, select: false },
  googleId: { type: String, sparse: true },
  avatar:   { type: String, default: '' },
  role:     { type: String, enum: ['user', 'admin'], default: 'user' },
  phone:    { type: String, default: '' },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  cart: [{
    product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1, min: 1 },
  }],
  recentlyViewed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
}, { timestamps: true });

// Hash password — skip if it's a Google OAuth password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  if (this.password.startsWith('google_oauth_')) return next(); // skip hashing
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);

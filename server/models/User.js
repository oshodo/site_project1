// server/models/User.js
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type:      String,
      required:  [true, 'Name is required'],
      trim:      true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type:      String,
      required:  [true, 'Email is required'],
      unique:    true,
      lowercase: true,
      match:     [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type:      String,
      minlength: [6, 'Password must be at least 6 characters'],
      select:    false,
    },
    googleId: { type: String, default: null },
    avatar:   { type: String, default: '' },
    role: {
      type:    String,
      enum:    ['user', 'admin'],
      default: 'user',
    },
    phone:   { type: String, default: '' },
    address: {
      street: { type: String, default: '' },
      city:   { type: String, default: '' },
      state:  { type: String, default: '' },
      zip:    { type: String, default: '' },
    },
    wishlist:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    isActive:  { type: Boolean, default: true },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt    = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);

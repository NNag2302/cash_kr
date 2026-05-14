import mongoose from 'mongoose';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: 100,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    default: null,
  },
  referralCode: {
    type: String,
    unique: true,
    default: () => crypto.randomBytes(4).toString('hex').toUpperCase(),
  },
  referredBy: {
    type: String,
    default: null,
  },
  addresses: [{
    label: { type: String, default: 'Home' }, // Home, Office, etc.
    name: String,
    phone: String,
    pincode: String,
    address: String,
    landmark: String,
    city: String,
    state: String,
    isDefault: { type: Boolean, default: false },
  }],
  paymentMethods: [{
    type: { type: String, enum: ['bank', 'upi'] },
    accountName: String,
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    upiId: String,
    isDefault: { type: Boolean, default: false },
  }],
}, {
  timestamps: true,
});


const User = mongoose.model('User', userSchema);
export default User;

import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  storage: { type: String, required: true },
  basePrice: { type: Number, required: true },
}, { _id: false });

const deviceSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['mobile', 'tablet', 'laptop', 'mac'],
    required: true,
    index: true,
  },
  brand: {
    type: String,
    required: true,
    index: true,
  },
  modelName: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  imageUrl: {
    type: String,
    default: '',
  },
  variants: [variantSchema],
  conditionMultipliers: {
    likenew: { type: Number, default: 1.0 },
    good: { type: Number, default: 0.85 },
    fair: { type: Number, default: 0.72 },
    poor: { type: Number, default: 0.55 },
  },
  screenMultipliers: {
    noScratch: { type: Number, default: 1.0 },
    minorScratch: { type: Number, default: 0.95 },
    crackedWorks: { type: Number, default: 0.75 },
    crackedBroken: { type: Number, default: 0.50 },
  },
  functionalDeductions: {
    batteryLow: { type: Number, default: 2000 },
    cameraIssue: { type: Number, default: 3000 },
    speakerIssue: { type: Number, default: 1500 },
    faceIdIssue: { type: Number, default: 4000 },
    chargingIssue: { type: Number, default: 1000 },
  },
  accessoriesBonus: {
    fullKit: { type: Number, default: 500 },
    boxOnly: { type: Number, default: 200 },
    none: { type: Number, default: 0 },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

deviceSchema.index({ brand: 1, category: 1 });

const Device = mongoose.model('Device', deviceSchema);
export default Device;

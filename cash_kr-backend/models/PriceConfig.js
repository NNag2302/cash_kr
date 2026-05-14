import mongoose from 'mongoose';

const priceConfigSchema = new mongoose.Schema({
  deviceSlug: {
    type: String,
    required: true,
    unique: true,
  },
  variants: [{
    storage: String,
    basePrice: Number,
  }],
  conditionMultipliers: {
    likenew: Number,
    good: Number,
    fair: Number,
    poor: Number,
  },
  screenMultipliers: {
    noScratch: Number,
    minorScratch: Number,
    crackedWorks: Number,
    crackedBroken: Number,
  },
  functionalDeductions: {
    batteryLow: Number,
    cameraIssue: Number,
    speakerIssue: Number,
    faceIdIssue: Number,
    chargingIssue: Number,
  },
  accessoriesBonus: {
    fullKit: Number,
    boxOnly: Number,
    none: Number,
  },
  lastUpdatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const PriceConfig = mongoose.model('PriceConfig', priceConfigSchema);
export default PriceConfig;

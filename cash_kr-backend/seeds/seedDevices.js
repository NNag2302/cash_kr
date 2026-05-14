import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import Device from '../models/Device.js';

const devices = [
  {
    category: 'mobile', brand: 'Apple', modelName: 'iPhone 16 Pro Max',
    slug: 'apple-iphone-16-pro-max', imageUrl: '',
    variants: [
      { storage: '256GB', basePrice: 89000 },
      { storage: '512GB', basePrice: 94000 },
      { storage: '1TB', basePrice: 102000 },
    ],
    conditionMultipliers: { likenew: 1.0, good: 0.85, fair: 0.72, poor: 0.55 },
    screenMultipliers: { noScratch: 1.0, minorScratch: 0.95, crackedWorks: 0.75, crackedBroken: 0.50 },
    functionalDeductions: { batteryLow: 2000, cameraIssue: 3000, speakerIssue: 1500, faceIdIssue: 4000, chargingIssue: 1000 },
    accessoriesBonus: { fullKit: 500, boxOnly: 200, none: 0 },
  },
  {
    category: 'mobile', brand: 'Apple', modelName: 'iPhone 16 Pro',
    slug: 'apple-iphone-16-pro', imageUrl: '',
    variants: [{ storage: '128GB', basePrice: 72000 }, { storage: '256GB', basePrice: 78000 }, { storage: '512GB', basePrice: 84000 }],
    conditionMultipliers: { likenew: 1.0, good: 0.85, fair: 0.72, poor: 0.55 },
    screenMultipliers: { noScratch: 1.0, minorScratch: 0.95, crackedWorks: 0.75, crackedBroken: 0.50 },
    functionalDeductions: { batteryLow: 2000, cameraIssue: 3000, speakerIssue: 1500, faceIdIssue: 4000, chargingIssue: 1000 },
    accessoriesBonus: { fullKit: 500, boxOnly: 200, none: 0 },
  },
  {
    category: 'mobile', brand: 'Apple', modelName: 'iPhone 16 Plus',
    slug: 'apple-iphone-16-plus', imageUrl: '',
    variants: [{ storage: '128GB', basePrice: 58000 }, { storage: '256GB', basePrice: 64000 }],
    conditionMultipliers: { likenew: 1.0, good: 0.85, fair: 0.72, poor: 0.55 },
    screenMultipliers: { noScratch: 1.0, minorScratch: 0.95, crackedWorks: 0.75, crackedBroken: 0.50 },
    functionalDeductions: { batteryLow: 2000, cameraIssue: 3000, speakerIssue: 1500, faceIdIssue: 4000, chargingIssue: 1000 },
    accessoriesBonus: { fullKit: 500, boxOnly: 200, none: 0 },
  },
  {
    category: 'mobile', brand: 'Apple', modelName: 'iPhone 16',
    slug: 'apple-iphone-16', imageUrl: '',
    variants: [{ storage: '128GB', basePrice: 49000 }, { storage: '256GB', basePrice: 55000 }],
    conditionMultipliers: { likenew: 1.0, good: 0.85, fair: 0.72, poor: 0.55 },
    screenMultipliers: { noScratch: 1.0, minorScratch: 0.95, crackedWorks: 0.75, crackedBroken: 0.50 },
    functionalDeductions: { batteryLow: 2000, cameraIssue: 3000, speakerIssue: 1500, faceIdIssue: 4000, chargingIssue: 1000 },
    accessoriesBonus: { fullKit: 500, boxOnly: 200, none: 0 },
  },
  {
    category: 'mobile', brand: 'Apple', modelName: 'iPhone 15 Pro Max',
    slug: 'apple-iphone-15-pro-max', imageUrl: '',
    variants: [{ storage: '256GB', basePrice: 68000 }, { storage: '512GB', basePrice: 74000 }, { storage: '1TB', basePrice: 82000 }],
    conditionMultipliers: { likenew: 1.0, good: 0.85, fair: 0.72, poor: 0.55 },
    screenMultipliers: { noScratch: 1.0, minorScratch: 0.95, crackedWorks: 0.75, crackedBroken: 0.50 },
    functionalDeductions: { batteryLow: 2000, cameraIssue: 3000, speakerIssue: 1500, faceIdIssue: 4000, chargingIssue: 1000 },
    accessoriesBonus: { fullKit: 500, boxOnly: 200, none: 0 },
  },
  {
    category: 'mobile', brand: 'Apple', modelName: 'iPhone 15 Pro',
    slug: 'apple-iphone-15-pro', imageUrl: '',
    variants: [{ storage: '128GB', basePrice: 55000 }, { storage: '256GB', basePrice: 60000 }],
    conditionMultipliers: { likenew: 1.0, good: 0.85, fair: 0.72, poor: 0.55 },
    screenMultipliers: { noScratch: 1.0, minorScratch: 0.95, crackedWorks: 0.75, crackedBroken: 0.50 },
    functionalDeductions: { batteryLow: 2000, cameraIssue: 3000, speakerIssue: 1500, faceIdIssue: 4000, chargingIssue: 1000 },
    accessoriesBonus: { fullKit: 500, boxOnly: 200, none: 0 },
  },
  {
    category: 'mobile', brand: 'Apple', modelName: 'iPhone 15',
    slug: 'apple-iphone-15', imageUrl: '',
    variants: [{ storage: '128GB', basePrice: 40000 }, { storage: '256GB', basePrice: 45000 }],
    conditionMultipliers: { likenew: 1.0, good: 0.85, fair: 0.72, poor: 0.55 },
    screenMultipliers: { noScratch: 1.0, minorScratch: 0.95, crackedWorks: 0.75, crackedBroken: 0.50 },
    functionalDeductions: { batteryLow: 1500, cameraIssue: 2500, speakerIssue: 1000, faceIdIssue: 3000, chargingIssue: 800 },
    accessoriesBonus: { fullKit: 500, boxOnly: 200, none: 0 },
  },
  {
    category: 'mobile', brand: 'Apple', modelName: 'iPhone 14 Pro Max',
    slug: 'apple-iphone-14-pro-max', imageUrl: '',
    variants: [{ storage: '128GB', basePrice: 52000 }, { storage: '256GB', basePrice: 56000 }],
    conditionMultipliers: { likenew: 1.0, good: 0.85, fair: 0.72, poor: 0.55 },
    screenMultipliers: { noScratch: 1.0, minorScratch: 0.95, crackedWorks: 0.75, crackedBroken: 0.50 },
    functionalDeductions: { batteryLow: 1500, cameraIssue: 2500, speakerIssue: 1000, faceIdIssue: 3000, chargingIssue: 800 },
    accessoriesBonus: { fullKit: 500, boxOnly: 200, none: 0 },
  },
  {
    category: 'mobile', brand: 'Apple', modelName: 'iPhone 14',
    slug: 'apple-iphone-14', imageUrl: '',
    variants: [{ storage: '128GB', basePrice: 32000 }, { storage: '256GB', basePrice: 36000 }],
    conditionMultipliers: { likenew: 1.0, good: 0.85, fair: 0.72, poor: 0.55 },
    screenMultipliers: { noScratch: 1.0, minorScratch: 0.95, crackedWorks: 0.75, crackedBroken: 0.50 },
    functionalDeductions: { batteryLow: 1500, cameraIssue: 2000, speakerIssue: 1000, faceIdIssue: 3000, chargingIssue: 800 },
    accessoriesBonus: { fullKit: 400, boxOnly: 150, none: 0 },
  },
  {
    category: 'mobile', brand: 'Apple', modelName: 'iPhone 13',
    slug: 'apple-iphone-13', imageUrl: '',
    variants: [{ storage: '128GB', basePrice: 26000 }, { storage: '256GB', basePrice: 30000 }],
    conditionMultipliers: { likenew: 1.0, good: 0.85, fair: 0.72, poor: 0.55 },
    screenMultipliers: { noScratch: 1.0, minorScratch: 0.95, crackedWorks: 0.75, crackedBroken: 0.50 },
    functionalDeductions: { batteryLow: 1000, cameraIssue: 2000, speakerIssue: 800, faceIdIssue: 2500, chargingIssue: 600 },
    accessoriesBonus: { fullKit: 300, boxOnly: 100, none: 0 },
  },
  {
    category: 'mobile', brand: 'Apple', modelName: 'iPhone 12',
    slug: 'apple-iphone-12', imageUrl: '',
    variants: [{ storage: '64GB', basePrice: 18000 }, { storage: '128GB', basePrice: 21000 }],
    conditionMultipliers: { likenew: 1.0, good: 0.85, fair: 0.72, poor: 0.55 },
    screenMultipliers: { noScratch: 1.0, minorScratch: 0.95, crackedWorks: 0.75, crackedBroken: 0.50 },
    functionalDeductions: { batteryLow: 800, cameraIssue: 1500, speakerIssue: 600, faceIdIssue: 2000, chargingIssue: 500 },
    accessoriesBonus: { fullKit: 300, boxOnly: 100, none: 0 },
  },
  // Samsung
  {
    category: 'mobile', brand: 'Samsung', modelName: 'Galaxy S24 Ultra',
    slug: 'samsung-galaxy-s24-ultra', imageUrl: '',
    variants: [{ storage: '256GB', basePrice: 72000 }, { storage: '512GB', basePrice: 80000 }],
    conditionMultipliers: { likenew: 1.0, good: 0.85, fair: 0.70, poor: 0.52 },
    screenMultipliers: { noScratch: 1.0, minorScratch: 0.95, crackedWorks: 0.72, crackedBroken: 0.48 },
    functionalDeductions: { batteryLow: 2000, cameraIssue: 3000, speakerIssue: 1500, faceIdIssue: 3000, chargingIssue: 1000 },
    accessoriesBonus: { fullKit: 500, boxOnly: 200, none: 0 },
  },
  {
    category: 'mobile', brand: 'Samsung', modelName: 'Galaxy S24+',
    slug: 'samsung-galaxy-s24-plus', imageUrl: '',
    variants: [{ storage: '256GB', basePrice: 52000 }],
    conditionMultipliers: { likenew: 1.0, good: 0.85, fair: 0.70, poor: 0.52 },
    screenMultipliers: { noScratch: 1.0, minorScratch: 0.95, crackedWorks: 0.72, crackedBroken: 0.48 },
    functionalDeductions: { batteryLow: 1500, cameraIssue: 2500, speakerIssue: 1200, faceIdIssue: 2500, chargingIssue: 800 },
    accessoriesBonus: { fullKit: 400, boxOnly: 150, none: 0 },
  },
  // OnePlus
  {
    category: 'mobile', brand: 'OnePlus', modelName: 'OnePlus 12',
    slug: 'oneplus-12', imageUrl: '',
    variants: [{ storage: '256GB', basePrice: 38000 }, { storage: '512GB', basePrice: 42000 }],
    conditionMultipliers: { likenew: 1.0, good: 0.85, fair: 0.70, poor: 0.50 },
    screenMultipliers: { noScratch: 1.0, minorScratch: 0.95, crackedWorks: 0.70, crackedBroken: 0.45 },
    functionalDeductions: { batteryLow: 1500, cameraIssue: 2000, speakerIssue: 1000, faceIdIssue: 2000, chargingIssue: 800 },
    accessoriesBonus: { fullKit: 400, boxOnly: 150, none: 0 },
  },
  // Google
  {
    category: 'mobile', brand: 'Google', modelName: 'Pixel 9 Pro',
    slug: 'google-pixel-9-pro', imageUrl: '',
    variants: [{ storage: '128GB', basePrice: 45000 }, { storage: '256GB', basePrice: 50000 }],
    conditionMultipliers: { likenew: 1.0, good: 0.85, fair: 0.70, poor: 0.50 },
    screenMultipliers: { noScratch: 1.0, minorScratch: 0.95, crackedWorks: 0.72, crackedBroken: 0.48 },
    functionalDeductions: { batteryLow: 1500, cameraIssue: 2500, speakerIssue: 1000, faceIdIssue: 2500, chargingIssue: 800 },
    accessoriesBonus: { fullKit: 400, boxOnly: 150, none: 0 },
  },
  // Xiaomi
  {
    category: 'mobile', brand: 'Xiaomi', modelName: 'Xiaomi 14 Ultra',
    slug: 'xiaomi-14-ultra', imageUrl: '',
    variants: [{ storage: '256GB', basePrice: 35000 }, { storage: '512GB', basePrice: 40000 }],
    conditionMultipliers: { likenew: 1.0, good: 0.82, fair: 0.68, poor: 0.48 },
    screenMultipliers: { noScratch: 1.0, minorScratch: 0.95, crackedWorks: 0.70, crackedBroken: 0.45 },
    functionalDeductions: { batteryLow: 1200, cameraIssue: 2000, speakerIssue: 800, faceIdIssue: 2000, chargingIssue: 600 },
    accessoriesBonus: { fullKit: 300, boxOnly: 100, none: 0 },
  },
  // Other brands with 1 device each
  {
    category: 'mobile', brand: 'Realme', modelName: 'Realme GT 5 Pro',
    slug: 'realme-gt-5-pro', imageUrl: '',
    variants: [{ storage: '128GB', basePrice: 18000 }, { storage: '256GB', basePrice: 22000 }],
    conditionMultipliers: { likenew: 1.0, good: 0.82, fair: 0.65, poor: 0.45 },
    screenMultipliers: { noScratch: 1.0, minorScratch: 0.95, crackedWorks: 0.68, crackedBroken: 0.42 },
    functionalDeductions: { batteryLow: 1000, cameraIssue: 1500, speakerIssue: 600, faceIdIssue: 1500, chargingIssue: 500 },
    accessoriesBonus: { fullKit: 300, boxOnly: 100, none: 0 },
  },
  {
    category: 'mobile', brand: 'Vivo', modelName: 'Vivo X200 Pro',
    slug: 'vivo-x200-pro', imageUrl: '',
    variants: [{ storage: '256GB', basePrice: 32000 }],
    conditionMultipliers: { likenew: 1.0, good: 0.82, fair: 0.68, poor: 0.48 },
    screenMultipliers: { noScratch: 1.0, minorScratch: 0.95, crackedWorks: 0.70, crackedBroken: 0.45 },
    functionalDeductions: { batteryLow: 1200, cameraIssue: 2000, speakerIssue: 800, faceIdIssue: 2000, chargingIssue: 600 },
    accessoriesBonus: { fullKit: 300, boxOnly: 100, none: 0 },
  },
  {
    category: 'mobile', brand: 'OPPO', modelName: 'OPPO Find X7 Ultra',
    slug: 'oppo-find-x7-ultra', imageUrl: '',
    variants: [{ storage: '256GB', basePrice: 34000 }],
    conditionMultipliers: { likenew: 1.0, good: 0.82, fair: 0.68, poor: 0.48 },
    screenMultipliers: { noScratch: 1.0, minorScratch: 0.95, crackedWorks: 0.70, crackedBroken: 0.45 },
    functionalDeductions: { batteryLow: 1200, cameraIssue: 2000, speakerIssue: 800, faceIdIssue: 2000, chargingIssue: 600 },
    accessoriesBonus: { fullKit: 300, boxOnly: 100, none: 0 },
  },
  {
    category: 'mobile', brand: 'Motorola', modelName: 'Motorola Edge 50 Ultra',
    slug: 'motorola-edge-50-ultra', imageUrl: '',
    variants: [{ storage: '256GB', basePrice: 28000 }],
    conditionMultipliers: { likenew: 1.0, good: 0.82, fair: 0.68, poor: 0.48 },
    screenMultipliers: { noScratch: 1.0, minorScratch: 0.95, crackedWorks: 0.70, crackedBroken: 0.45 },
    functionalDeductions: { batteryLow: 1000, cameraIssue: 1500, speakerIssue: 600, faceIdIssue: 1500, chargingIssue: 500 },
    accessoriesBonus: { fullKit: 300, boxOnly: 100, none: 0 },
  },
  {
    category: 'mobile', brand: 'Nothing', modelName: 'Nothing Phone (2a) Plus',
    slug: 'nothing-phone-2a-plus', imageUrl: '',
    variants: [{ storage: '128GB', basePrice: 16000 }, { storage: '256GB', basePrice: 19000 }],
    conditionMultipliers: { likenew: 1.0, good: 0.82, fair: 0.65, poor: 0.45 },
    screenMultipliers: { noScratch: 1.0, minorScratch: 0.95, crackedWorks: 0.68, crackedBroken: 0.42 },
    functionalDeductions: { batteryLow: 800, cameraIssue: 1200, speakerIssue: 500, faceIdIssue: 1200, chargingIssue: 400 },
    accessoriesBonus: { fullKit: 200, boxOnly: 100, none: 0 },
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    await Device.deleteMany({});
    console.log('Cleared existing devices');
    await Device.insertMany(devices);
    console.log(`✅ Seeded ${devices.length} devices successfully`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();

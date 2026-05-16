import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Device from "../models/Device.js";

/**
 * CASHKR PRICING MODEL - HOW IT WORKS
 * =====================================
 * Final Price = (basePrice × conditionMultiplier × screenMultiplier)
 *             - batteryDeduction
 *             - functionalDeductions (sum of all issues)
 *             + accessoriesBonus
 *
 * QUESTIONS ASKED (in order):
 *  1. Storage Variant        → sets basePrice
 *  2. Physical Condition     → conditionMultiplier (likenew / good / fair / poor)
 *  3. Screen Condition       → screenMultiplier (noScratch / minorScratch / crackedWorks / crackedBroken)
 *  4. Battery Health         → fixed deduction (above80 / above60 / below60)
 *  5. Functional Issues      → fixed deductions (batteryLow / cameraIssue / speakerIssue / biometricIssue / chargingIssue)
 *  6. Accessories            → bonus (fullKit / boxOnly / none)
 *
 * NOTE: batteryLow in functionalDeductions = battery drains fast / swollen (separate from batteryHealth % question)
 *       biometricIssue covers Face ID (Apple) or fingerprint/face (Android)
 */

// ─── SHARED MULTIPLIER PRESETS ──────────────────────────────────────────────

const appleConditionMultipliers = {
  likenew: 1.0, // Like New – no visible marks, original condition
  good: 0.85, // Good – minor signs of use, fully functional
  fair: 0.72, // Fair – visible scratches/scuffs, fully functional
  poor: 0.55, // Poor – heavy wear, may have dents or broken parts
};

const appleScreenMultipliers = {
  noScratch: 1.0, // Perfect screen, no scratches
  minorScratch: 0.95, // Minor hairline scratches, visible under light
  crackedWorks: 0.75, // Cracked but touch works fine
  crackedBroken: 0.5, // Cracked and touch partially/fully broken
};

const samsungConditionMultipliers = {
  likenew: 1.0,
  good: 0.85,
  fair: 0.7,
  poor: 0.52,
};

const samsungScreenMultipliers = {
  noScratch: 1.0,
  minorScratch: 0.95,
  crackedWorks: 0.72,
  crackedBroken: 0.48,
};

const androidMidConditionMultipliers = {
  likenew: 1.0,
  good: 0.85,
  fair: 0.7,
  poor: 0.5,
};

const androidMidScreenMultipliers = {
  noScratch: 1.0,
  minorScratch: 0.95,
  crackedWorks: 0.7,
  crackedBroken: 0.45,
};

const androidBudgetConditionMultipliers = {
  likenew: 1.0,
  good: 0.82,
  fair: 0.65,
  poor: 0.45,
};

const androidBudgetScreenMultipliers = {
  noScratch: 1.0,
  minorScratch: 0.95,
  crackedWorks: 0.68,
  crackedBroken: 0.42,
};

// ─── BATTERY HEALTH DEDUCTIONS (separate from functional battery issue) ──────
// Applied as flat ₹ deduction after condition/screen multipliers
// above80 = good health (≥80%), above60 = moderate (60-79%), below60 = poor (<60%)
const appleBatteryDeductions = { above80: 0, above60: 1500, below60: 3500 };
const samsungBatteryDeductions = { above80: 0, above60: 1200, below60: 3000 };
const androidMidBatteryDeductions = {
  above80: 0,
  above60: 1000,
  below60: 2500,
};
const androidBudgetBatteryDeductions = {
  above80: 0,
  above60: 800,
  below60: 2000,
};

// ─── DEVICE DATA ─────────────────────────────────────────────────────────────

const devices = [
  // ══════════════════════════════════════════════════════
  //  APPLE — iPhone 17 Series (2025, latest)
  // ══════════════════════════════════════════════════════

  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 17 Pro Max",
    slug: "apple-iphone-17-pro-max",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-17-pro-max.jpg",
    variants: [
      { storage: "256GB", basePrice: 100000 },
      { storage: "512GB", basePrice: 108000 },
      { storage: "1TB", basePrice: 118000 },
    ],
    conditionMultipliers: appleConditionMultipliers,
    screenMultipliers: appleScreenMultipliers,
    batteryDeductions: appleBatteryDeductions,
    functionalDeductions: {
      batteryLow: 2500,
      cameraIssue: 4000,
      speakerIssue: 2000,
      biometricIssue: 5000,
      chargingIssue: 1500,
    },
    accessoriesBonus: { fullKit: 600, boxOnly: 250, none: 0 },
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 17 Pro",
    slug: "apple-iphone-17-pro",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-17-pro.jpg",
    variants: [
      { storage: "256GB", basePrice: 88000 },
      { storage: "512GB", basePrice: 96000 },
      { storage: "1TB", basePrice: 106000 },
    ],
    conditionMultipliers: appleConditionMultipliers,
    screenMultipliers: appleScreenMultipliers,
    batteryDeductions: appleBatteryDeductions,
    functionalDeductions: {
      batteryLow: 2500,
      cameraIssue: 4000,
      speakerIssue: 2000,
      biometricIssue: 5000,
      chargingIssue: 1500,
    },
    accessoriesBonus: { fullKit: 600, boxOnly: 250, none: 0 },
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 17",
    slug: "apple-iphone-17",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-17.jpg",
    variants: [
      { storage: "128GB", basePrice: 72000 },
      { storage: "256GB", basePrice: 78000 },
      { storage: "512GB", basePrice: 86000 },
    ],
    conditionMultipliers: appleConditionMultipliers,
    screenMultipliers: appleScreenMultipliers,
    batteryDeductions: appleBatteryDeductions,
    functionalDeductions: {
      batteryLow: 2000,
      cameraIssue: 3500,
      speakerIssue: 1800,
      biometricIssue: 4500,
      chargingIssue: 1200,
    },
    accessoriesBonus: { fullKit: 600, boxOnly: 250, none: 0 },
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 17e",
    slug: "apple-iphone-17e",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-17e.jpg",
    variants: [
      { storage: "128GB", basePrice: 52000 },
      { storage: "256GB", basePrice: 58000 },
    ],
    conditionMultipliers: appleConditionMultipliers,
    screenMultipliers: appleScreenMultipliers,
    batteryDeductions: appleBatteryDeductions,
    functionalDeductions: {
      batteryLow: 2000,
      cameraIssue: 3000,
      speakerIssue: 1500,
      biometricIssue: 4000,
      chargingIssue: 1200,
    },
    accessoriesBonus: { fullKit: 500, boxOnly: 200, none: 0 },
  },

  // ══════════════════════════════════════════════════════
  //  APPLE — iPhone 16 Series
  // ══════════════════════════════════════════════════════

  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 16 Pro Max",
    slug: "apple-iphone-16-pro-max",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16-pro-max.jpg",
    variants: [
      { storage: "256GB", basePrice: 89000 },
      { storage: "512GB", basePrice: 94000 },
      { storage: "1TB", basePrice: 102000 },
    ],
    conditionMultipliers: appleConditionMultipliers,
    screenMultipliers: appleScreenMultipliers,
    batteryDeductions: appleBatteryDeductions,
    functionalDeductions: {
      batteryLow: 2000,
      cameraIssue: 3500,
      speakerIssue: 1800,
      biometricIssue: 4500,
      chargingIssue: 1200,
    },
    accessoriesBonus: { fullKit: 500, boxOnly: 200, none: 0 },
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 16 Pro",
    slug: "apple-iphone-16-pro",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16-pro.jpg",
    variants: [
      { storage: "128GB", basePrice: 72000 },
      { storage: "256GB", basePrice: 78000 },
      { storage: "512GB", basePrice: 84000 },
    ],
    conditionMultipliers: appleConditionMultipliers,
    screenMultipliers: appleScreenMultipliers,
    batteryDeductions: appleBatteryDeductions,
    functionalDeductions: {
      batteryLow: 2000,
      cameraIssue: 3000,
      speakerIssue: 1500,
      biometricIssue: 4000,
      chargingIssue: 1000,
    },
    accessoriesBonus: { fullKit: 500, boxOnly: 200, none: 0 },
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 16 Plus",
    slug: "apple-iphone-16-plus",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16-plus.jpg",
    variants: [
      { storage: "128GB", basePrice: 58000 },
      { storage: "256GB", basePrice: 64000 },
    ],
    conditionMultipliers: appleConditionMultipliers,
    screenMultipliers: appleScreenMultipliers,
    batteryDeductions: appleBatteryDeductions,
    functionalDeductions: {
      batteryLow: 2000,
      cameraIssue: 3000,
      speakerIssue: 1500,
      biometricIssue: 4000,
      chargingIssue: 1000,
    },
    accessoriesBonus: { fullKit: 500, boxOnly: 200, none: 0 },
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 16",
    slug: "apple-iphone-16",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16.jpg",
    variants: [
      { storage: "128GB", basePrice: 49000 },
      { storage: "256GB", basePrice: 55000 },
    ],
    conditionMultipliers: appleConditionMultipliers,
    screenMultipliers: appleScreenMultipliers,
    batteryDeductions: appleBatteryDeductions,
    functionalDeductions: {
      batteryLow: 2000,
      cameraIssue: 3000,
      speakerIssue: 1500,
      biometricIssue: 4000,
      chargingIssue: 1000,
    },
    accessoriesBonus: { fullKit: 500, boxOnly: 200, none: 0 },
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 16e",
    slug: "apple-iphone-16e",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16e.jpg",
    variants: [
      { storage: "128GB", basePrice: 38000 },
      { storage: "256GB", basePrice: 43000 },
    ],
    conditionMultipliers: appleConditionMultipliers,
    screenMultipliers: appleScreenMultipliers,
    batteryDeductions: appleBatteryDeductions,
    functionalDeductions: {
      batteryLow: 1500,
      cameraIssue: 2500,
      speakerIssue: 1200,
      biometricIssue: 3500,
      chargingIssue: 900,
    },
    accessoriesBonus: { fullKit: 400, boxOnly: 200, none: 0 },
  },

  // ══════════════════════════════════════════════════════
  //  APPLE — iPhone Air
  // ══════════════════════════════════════════════════════

  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone Air",
    slug: "apple-iphone-air",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-air.jpg",
    variants: [
      { storage: "128GB", basePrice: 62000 },
      { storage: "256GB", basePrice: 68000 },
      { storage: "512GB", basePrice: 76000 },
    ],
    conditionMultipliers: appleConditionMultipliers,
    screenMultipliers: appleScreenMultipliers,
    batteryDeductions: appleBatteryDeductions,
    functionalDeductions: {
      batteryLow: 2000,
      cameraIssue: 3000,
      speakerIssue: 1500,
      biometricIssue: 4000,
      chargingIssue: 1000,
    },
    accessoriesBonus: { fullKit: 500, boxOnly: 200, none: 0 },
  },

  // ══════════════════════════════════════════════════════
  //  APPLE — iPhone 15 Series
  // ══════════════════════════════════════════════════════

  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 15 Pro Max",
    slug: "apple-iphone-15-pro-max",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15-pro-max.jpg",
    variants: [
      { storage: "256GB", basePrice: 68000 },
      { storage: "512GB", basePrice: 74000 },
      { storage: "1TB", basePrice: 82000 },
    ],
    conditionMultipliers: appleConditionMultipliers,
    screenMultipliers: appleScreenMultipliers,
    batteryDeductions: appleBatteryDeductions,
    functionalDeductions: {
      batteryLow: 2000,
      cameraIssue: 3000,
      speakerIssue: 1500,
      biometricIssue: 4000,
      chargingIssue: 1000,
    },
    accessoriesBonus: { fullKit: 500, boxOnly: 200, none: 0 },
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 15 Pro",
    slug: "apple-iphone-15-pro",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15-pro.jpg",
    variants: [
      { storage: "128GB", basePrice: 55000 },
      { storage: "256GB", basePrice: 60000 },
      { storage: "512GB", basePrice: 66000 },
      { storage: "1TB", basePrice: 74000 },
    ],
    conditionMultipliers: appleConditionMultipliers,
    screenMultipliers: appleScreenMultipliers,
    batteryDeductions: appleBatteryDeductions,
    functionalDeductions: {
      batteryLow: 2000,
      cameraIssue: 3000,
      speakerIssue: 1500,
      biometricIssue: 4000,
      chargingIssue: 1000,
    },
    accessoriesBonus: { fullKit: 500, boxOnly: 200, none: 0 },
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 15 Plus",
    slug: "apple-iphone-15-plus",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15-plus-.jpg",
    variants: [
      { storage: "128GB", basePrice: 42000 },
      { storage: "256GB", basePrice: 47000 },
      { storage: "512GB", basePrice: 54000 },
    ],
    conditionMultipliers: appleConditionMultipliers,
    screenMultipliers: appleScreenMultipliers,
    batteryDeductions: appleBatteryDeductions,
    functionalDeductions: {
      batteryLow: 1500,
      cameraIssue: 2500,
      speakerIssue: 1200,
      biometricIssue: 3500,
      chargingIssue: 900,
    },
    accessoriesBonus: { fullKit: 500, boxOnly: 200, none: 0 },
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 15",
    slug: "apple-iphone-15",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15.jpg",
    variants: [
      { storage: "128GB", basePrice: 40000 },
      { storage: "256GB", basePrice: 45000 },
      { storage: "512GB", basePrice: 52000 },
    ],
    conditionMultipliers: appleConditionMultipliers,
    screenMultipliers: appleScreenMultipliers,
    batteryDeductions: appleBatteryDeductions,
    functionalDeductions: {
      batteryLow: 1500,
      cameraIssue: 2500,
      speakerIssue: 1000,
      biometricIssue: 3000,
      chargingIssue: 800,
    },
    accessoriesBonus: { fullKit: 500, boxOnly: 200, none: 0 },
  },

  // ══════════════════════════════════════════════════════
  //  APPLE — iPhone 14 Series
  // ══════════════════════════════════════════════════════

  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 14 Pro Max",
    slug: "apple-iphone-14-pro-max",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14-pro-max-.jpg",
    variants: [
      { storage: "128GB", basePrice: 52000 },
      { storage: "256GB", basePrice: 56000 },
      { storage: "512GB", basePrice: 62000 },
      { storage: "1TB", basePrice: 70000 },
    ],
    conditionMultipliers: appleConditionMultipliers,
    screenMultipliers: appleScreenMultipliers,
    batteryDeductions: appleBatteryDeductions,
    functionalDeductions: {
      batteryLow: 1500,
      cameraIssue: 2500,
      speakerIssue: 1000,
      biometricIssue: 3000,
      chargingIssue: 800,
    },
    accessoriesBonus: { fullKit: 500, boxOnly: 200, none: 0 },
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 14 Pro",
    slug: "apple-iphone-14-pro",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14-pro.jpg",
    variants: [
      { storage: "128GB", basePrice: 42000 },
      { storage: "256GB", basePrice: 47000 },
      { storage: "512GB", basePrice: 53000 },
      { storage: "1TB", basePrice: 60000 },
    ],
    conditionMultipliers: appleConditionMultipliers,
    screenMultipliers: appleScreenMultipliers,
    batteryDeductions: appleBatteryDeductions,
    functionalDeductions: {
      batteryLow: 1500,
      cameraIssue: 2500,
      speakerIssue: 1000,
      biometricIssue: 3000,
      chargingIssue: 800,
    },
    accessoriesBonus: { fullKit: 500, boxOnly: 200, none: 0 },
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 14 Plus",
    slug: "apple-iphone-14-plus",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14-plus.jpg",
    variants: [
      { storage: "128GB", basePrice: 34000 },
      { storage: "256GB", basePrice: 38000 },
      { storage: "512GB", basePrice: 44000 },
    ],
    conditionMultipliers: appleConditionMultipliers,
    screenMultipliers: appleScreenMultipliers,
    batteryDeductions: appleBatteryDeductions,
    functionalDeductions: {
      batteryLow: 1500,
      cameraIssue: 2000,
      speakerIssue: 1000,
      biometricIssue: 3000,
      chargingIssue: 800,
    },
    accessoriesBonus: { fullKit: 400, boxOnly: 150, none: 0 },
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 14",
    slug: "apple-iphone-14",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14.jpg",
    variants: [
      { storage: "128GB", basePrice: 32000 },
      { storage: "256GB", basePrice: 36000 },
      { storage: "512GB", basePrice: 42000 },
    ],
    conditionMultipliers: appleConditionMultipliers,
    screenMultipliers: appleScreenMultipliers,
    batteryDeductions: appleBatteryDeductions,
    functionalDeductions: {
      batteryLow: 1500,
      cameraIssue: 2000,
      speakerIssue: 1000,
      biometricIssue: 3000,
      chargingIssue: 800,
    },
    accessoriesBonus: { fullKit: 400, boxOnly: 150, none: 0 },
  },

  // ══════════════════════════════════════════════════════
  //  APPLE — iPhone 13 Series
  // ══════════════════════════════════════════════════════

  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 13 Pro Max",
    slug: "apple-iphone-13-pro-max",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-13-pro-max.jpg",
    variants: [
      { storage: "128GB", basePrice: 38000 },
      { storage: "256GB", basePrice: 42000 },
      { storage: "512GB", basePrice: 48000 },
      { storage: "1TB", basePrice: 55000 },
    ],
    conditionMultipliers: appleConditionMultipliers,
    screenMultipliers: appleScreenMultipliers,
    batteryDeductions: appleBatteryDeductions,
    functionalDeductions: {
      batteryLow: 1000,
      cameraIssue: 2000,
      speakerIssue: 800,
      biometricIssue: 2500,
      chargingIssue: 600,
    },
    accessoriesBonus: { fullKit: 300, boxOnly: 100, none: 0 },
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 13 Pro",
    slug: "apple-iphone-13-pro",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-13-pro.jpg",
    variants: [
      { storage: "128GB", basePrice: 32000 },
      { storage: "256GB", basePrice: 36000 },
      { storage: "512GB", basePrice: 42000 },
      { storage: "1TB", basePrice: 48000 },
    ],
    conditionMultipliers: appleConditionMultipliers,
    screenMultipliers: appleScreenMultipliers,
    batteryDeductions: appleBatteryDeductions,
    functionalDeductions: {
      batteryLow: 1000,
      cameraIssue: 2000,
      speakerIssue: 800,
      biometricIssue: 2500,
      chargingIssue: 600,
    },
    accessoriesBonus: { fullKit: 300, boxOnly: 100, none: 0 },
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 13",
    slug: "apple-iphone-13",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-13.jpg",
    variants: [
      { storage: "128GB", basePrice: 26000 },
      { storage: "256GB", basePrice: 30000 },
      { storage: "512GB", basePrice: 35000 },
    ],
    conditionMultipliers: appleConditionMultipliers,
    screenMultipliers: appleScreenMultipliers,
    batteryDeductions: appleBatteryDeductions,
    functionalDeductions: {
      batteryLow: 1000,
      cameraIssue: 2000,
      speakerIssue: 800,
      biometricIssue: 2500,
      chargingIssue: 600,
    },
    accessoriesBonus: { fullKit: 300, boxOnly: 100, none: 0 },
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 13 Mini",
    slug: "apple-iphone-13-mini",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-13-mini.jpg",
    variants: [
      { storage: "128GB", basePrice: 22000 },
      { storage: "256GB", basePrice: 26000 },
      { storage: "512GB", basePrice: 31000 },
    ],
    conditionMultipliers: appleConditionMultipliers,
    screenMultipliers: appleScreenMultipliers,
    batteryDeductions: appleBatteryDeductions,
    functionalDeductions: {
      batteryLow: 1000,
      cameraIssue: 2000,
      speakerIssue: 800,
      biometricIssue: 2500,
      chargingIssue: 600,
    },
    accessoriesBonus: { fullKit: 300, boxOnly: 100, none: 0 },
  },

  // ══════════════════════════════════════════════════════
  //  APPLE — iPhone 12 Series
  // ══════════════════════════════════════════════════════

  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 12 Pro Max",
    slug: "apple-iphone-12-pro-max",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-12-pro-max-.jpg",
    variants: [
      { storage: "128GB", basePrice: 24000 },
      { storage: "256GB", basePrice: 27000 },
      { storage: "512GB", basePrice: 32000 },
    ],
    conditionMultipliers: appleConditionMultipliers,
    screenMultipliers: appleScreenMultipliers,
    batteryDeductions: appleBatteryDeductions,
    functionalDeductions: {
      batteryLow: 800,
      cameraIssue: 1500,
      speakerIssue: 600,
      biometricIssue: 2000,
      chargingIssue: 500,
    },
    accessoriesBonus: { fullKit: 300, boxOnly: 100, none: 0 },
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 12 Pro",
    slug: "apple-iphone-12-pro",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-12-pro-.jpg",
    variants: [
      { storage: "128GB", basePrice: 20000 },
      { storage: "256GB", basePrice: 23000 },
      { storage: "512GB", basePrice: 27000 },
    ],
    conditionMultipliers: appleConditionMultipliers,
    screenMultipliers: appleScreenMultipliers,
    batteryDeductions: appleBatteryDeductions,
    functionalDeductions: {
      batteryLow: 800,
      cameraIssue: 1500,
      speakerIssue: 600,
      biometricIssue: 2000,
      chargingIssue: 500,
    },
    accessoriesBonus: { fullKit: 300, boxOnly: 100, none: 0 },
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 12",
    slug: "apple-iphone-12",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-12.jpg",
    variants: [
      { storage: "64GB", basePrice: 16000 },
      { storage: "128GB", basePrice: 18000 },
      { storage: "256GB", basePrice: 21000 },
    ],
    conditionMultipliers: appleConditionMultipliers,
    screenMultipliers: appleScreenMultipliers,
    batteryDeductions: appleBatteryDeductions,
    functionalDeductions: {
      batteryLow: 800,
      cameraIssue: 1500,
      speakerIssue: 600,
      biometricIssue: 2000,
      chargingIssue: 500,
    },
    accessoriesBonus: { fullKit: 300, boxOnly: 100, none: 0 },
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 12 Mini",
    slug: "apple-iphone-12-mini",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-12-mini.jpg",
    variants: [
      { storage: "64GB", basePrice: 13000 },
      { storage: "128GB", basePrice: 15000 },
      { storage: "256GB", basePrice: 18000 },
    ],
    conditionMultipliers: appleConditionMultipliers,
    screenMultipliers: appleScreenMultipliers,
    batteryDeductions: appleBatteryDeductions,
    functionalDeductions: {
      batteryLow: 800,
      cameraIssue: 1500,
      speakerIssue: 600,
      biometricIssue: 2000,
      chargingIssue: 500,
    },
    accessoriesBonus: { fullKit: 300, boxOnly: 100, none: 0 },
  },

  // ══════════════════════════════════════════════════════
  //  APPLE — iPhone 11 Series
  // ══════════════════════════════════════════════════════

  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 11 Pro Max",
    slug: "apple-iphone-11-pro-max",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-11-pro-max-.jpg",
    variants: [
      { storage: "64GB", basePrice: 14000 },
      { storage: "256GB", basePrice: 17000 },
      { storage: "512GB", basePrice: 20000 },
    ],
    conditionMultipliers: appleConditionMultipliers,
    screenMultipliers: appleScreenMultipliers,
    batteryDeductions: appleBatteryDeductions,
    functionalDeductions: {
      batteryLow: 700,
      cameraIssue: 1200,
      speakerIssue: 500,
      biometricIssue: 1800,
      chargingIssue: 400,
    },
    accessoriesBonus: { fullKit: 200, boxOnly: 100, none: 0 },
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 11 Pro",
    slug: "apple-iphone-11-pro",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-11-pro.jpg",
    variants: [
      { storage: "64GB", basePrice: 11000 },
      { storage: "256GB", basePrice: 14000 },
      { storage: "512GB", basePrice: 17000 },
    ],
    conditionMultipliers: appleConditionMultipliers,
    screenMultipliers: appleScreenMultipliers,
    batteryDeductions: appleBatteryDeductions,
    functionalDeductions: {
      batteryLow: 700,
      cameraIssue: 1200,
      speakerIssue: 500,
      biometricIssue: 1800,
      chargingIssue: 400,
    },
    accessoriesBonus: { fullKit: 200, boxOnly: 100, none: 0 },
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 11",
    slug: "apple-iphone-11",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-11.jpg",
    variants: [
      { storage: "64GB", basePrice: 9000 },
      { storage: "128GB", basePrice: 11000 },
      { storage: "256GB", basePrice: 13000 },
    ],
    conditionMultipliers: appleConditionMultipliers,
    screenMultipliers: appleScreenMultipliers,
    batteryDeductions: appleBatteryDeductions,
    functionalDeductions: {
      batteryLow: 600,
      cameraIssue: 1000,
      speakerIssue: 400,
      biometricIssue: 1500,
      chargingIssue: 300,
    },
    accessoriesBonus: { fullKit: 200, boxOnly: 100, none: 0 },
  },

  // ══════════════════════════════════════════════════════
  //  APPLE — iPhone SE Series
  // ══════════════════════════════════════════════════════

  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone SE 2022",
    slug: "apple-iphone-se-2022",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-se-2022.jpg",
    variants: [
      { storage: "64GB", basePrice: 12000 },
      { storage: "128GB", basePrice: 14000 },
      { storage: "256GB", basePrice: 17000 },
    ],
    conditionMultipliers: appleConditionMultipliers,
    screenMultipliers: appleScreenMultipliers,
    batteryDeductions: appleBatteryDeductions,
    functionalDeductions: {
      batteryLow: 700,
      cameraIssue: 1200,
      speakerIssue: 500,
      biometricIssue: 1500,
      chargingIssue: 400,
    },
    accessoriesBonus: { fullKit: 200, boxOnly: 100, none: 0 },
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone SE 2020",
    slug: "apple-iphone-se-2020",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-se-2020.jpg",
    variants: [
      { storage: "64GB", basePrice: 8000 },
      { storage: "128GB", basePrice: 10000 },
      { storage: "256GB", basePrice: 12000 },
    ],
    conditionMultipliers: appleConditionMultipliers,
    screenMultipliers: appleScreenMultipliers,
    batteryDeductions: appleBatteryDeductions,
    functionalDeductions: {
      batteryLow: 600,
      cameraIssue: 1000,
      speakerIssue: 400,
      biometricIssue: 1200,
      chargingIssue: 300,
    },
    accessoriesBonus: { fullKit: 200, boxOnly: 100, none: 0 },
  },

  // ══════════════════════════════════════════════════════
  //  APPLE — iPhone X Series
  // ══════════════════════════════════════════════════════

  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone XS Max",
    slug: "apple-iphone-xs-max",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-xs-max.jpg",
    variants: [
      { storage: "64GB", basePrice: 8000 },
      { storage: "256GB", basePrice: 10000 },
      { storage: "512GB", basePrice: 12000 },
    ],
    conditionMultipliers: appleConditionMultipliers,
    screenMultipliers: appleScreenMultipliers,
    batteryDeductions: appleBatteryDeductions,
    functionalDeductions: {
      batteryLow: 600,
      cameraIssue: 1000,
      speakerIssue: 400,
      biometricIssue: 1500,
      chargingIssue: 300,
    },
    accessoriesBonus: { fullKit: 200, boxOnly: 100, none: 0 },
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone XS",
    slug: "apple-iphone-xs",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-xs.jpg",
    variants: [
      { storage: "64GB", basePrice: 6500 },
      { storage: "256GB", basePrice: 8000 },
      { storage: "512GB", basePrice: 10000 },
    ],
    conditionMultipliers: appleConditionMultipliers,
    screenMultipliers: appleScreenMultipliers,
    batteryDeductions: appleBatteryDeductions,
    functionalDeductions: {
      batteryLow: 500,
      cameraIssue: 800,
      speakerIssue: 300,
      biometricIssue: 1200,
      chargingIssue: 250,
    },
    accessoriesBonus: { fullKit: 150, boxOnly: 75, none: 0 },
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone XR",
    slug: "apple-iphone-xr",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-xr.jpg",
    variants: [
      { storage: "64GB", basePrice: 6000 },
      { storage: "128GB", basePrice: 7000 },
      { storage: "256GB", basePrice: 8500 },
    ],
    conditionMultipliers: appleConditionMultipliers,
    screenMultipliers: appleScreenMultipliers,
    batteryDeductions: appleBatteryDeductions,
    functionalDeductions: {
      batteryLow: 500,
      cameraIssue: 800,
      speakerIssue: 300,
      biometricIssue: 1200,
      chargingIssue: 250,
    },
    accessoriesBonus: { fullKit: 150, boxOnly: 75, none: 0 },
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone X",
    slug: "apple-iphone-x",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-x.jpg",
    variants: [
      { storage: "64GB", basePrice: 5000 },
      { storage: "256GB", basePrice: 6500 },
    ],
    conditionMultipliers: appleConditionMultipliers,
    screenMultipliers: appleScreenMultipliers,
    batteryDeductions: appleBatteryDeductions,
    functionalDeductions: {
      batteryLow: 400,
      cameraIssue: 700,
      speakerIssue: 300,
      biometricIssue: 1000,
      chargingIssue: 200,
    },
    accessoriesBonus: { fullKit: 150, boxOnly: 75, none: 0 },
  },

  // ══════════════════════════════════════════════════════
  //  APPLE — iPhone 8 Series
  // ══════════════════════════════════════════════════════

  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 8 Plus",
    slug: "apple-iphone-8-plus",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-8-plus-.jpg",
    variants: [
      { storage: "64GB", basePrice: 4000 },
      { storage: "256GB", basePrice: 5000 },
    ],
    conditionMultipliers: appleConditionMultipliers,
    screenMultipliers: appleScreenMultipliers,
    batteryDeductions: appleBatteryDeductions,
    functionalDeductions: {
      batteryLow: 300,
      cameraIssue: 600,
      speakerIssue: 200,
      biometricIssue: 800,
      chargingIssue: 200,
    },
    accessoriesBonus: { fullKit: 100, boxOnly: 50, none: 0 },
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 8",
    slug: "apple-iphone-8",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-8-.jpg",
    variants: [
      { storage: "64GB", basePrice: 3000 },
      { storage: "256GB", basePrice: 4000 },
    ],
    conditionMultipliers: appleConditionMultipliers,
    screenMultipliers: appleScreenMultipliers,
    batteryDeductions: appleBatteryDeductions,
    functionalDeductions: {
      batteryLow: 300,
      cameraIssue: 500,
      speakerIssue: 200,
      biometricIssue: 700,
      chargingIssue: 150,
    },
    accessoriesBonus: { fullKit: 100, boxOnly: 50, none: 0 },
  },

  // ══════════════════════════════════════════════════════
  //  APPLE — iPhone 7 Series
  // ══════════════════════════════════════════════════════

  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 7 Plus",
    slug: "apple-iphone-7-plus",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-7-plus-r2.jpg",
    variants: [
      { storage: "32GB", basePrice: 2500 },
      { storage: "128GB", basePrice: 3000 },
      { storage: "256GB", basePrice: 3500 },
    ],
    conditionMultipliers: appleConditionMultipliers,
    screenMultipliers: appleScreenMultipliers,
    batteryDeductions: appleBatteryDeductions,
    functionalDeductions: {
      batteryLow: 200,
      cameraIssue: 400,
      speakerIssue: 150,
      biometricIssue: 600,
      chargingIssue: 100,
    },
    accessoriesBonus: { fullKit: 100, boxOnly: 50, none: 0 },
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 7",
    slug: "apple-iphone-7",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-7r4.jpg",
    variants: [
      { storage: "32GB", basePrice: 2000 },
      { storage: "128GB", basePrice: 2500 },
      { storage: "256GB", basePrice: 3000 },
    ],
    conditionMultipliers: appleConditionMultipliers,
    screenMultipliers: appleScreenMultipliers,
    batteryDeductions: appleBatteryDeductions,
    functionalDeductions: {
      batteryLow: 200,
      cameraIssue: 400,
      speakerIssue: 150,
      biometricIssue: 500,
      chargingIssue: 100,
    },
    accessoriesBonus: { fullKit: 100, boxOnly: 50, none: 0 },
  },

  // ══════════════════════════════════════════════════════
  //  SAMSUNG — Galaxy S25 Series (2025)
  // ══════════════════════════════════════════════════════

  {
    category: "mobile",
    brand: "Samsung",
    modelName: "Galaxy S25 Ultra",
    slug: "samsung-galaxy-s25-ultra",
    imageUrl:
      "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s25-ultra-sm-s938.jpg",
    variants: [
      { storage: "256GB", basePrice: 82000 },
      { storage: "512GB", basePrice: 90000 },
      { storage: "1TB", basePrice: 100000 },
    ],
    conditionMultipliers: samsungConditionMultipliers,
    screenMultipliers: samsungScreenMultipliers,
    batteryDeductions: samsungBatteryDeductions,
    functionalDeductions: {
      batteryLow: 2500,
      cameraIssue: 3500,
      speakerIssue: 1800,
      biometricIssue: 3500,
      chargingIssue: 1200,
    },
    accessoriesBonus: { fullKit: 600, boxOnly: 250, none: 0 },
  },
  {
    category: "mobile",
    brand: "Samsung",
    modelName: "Galaxy S25+",
    slug: "samsung-galaxy-s25-plus",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s25-plus-sm-s936.jpg",
    variants: [
      { storage: "256GB", basePrice: 60000 },
      { storage: "512GB", basePrice: 68000 },
    ],
    conditionMultipliers: samsungConditionMultipliers,
    screenMultipliers: samsungScreenMultipliers,
    batteryDeductions: samsungBatteryDeductions,
    functionalDeductions: {
      batteryLow: 2000,
      cameraIssue: 3000,
      speakerIssue: 1500,
      biometricIssue: 3000,
      chargingIssue: 1000,
    },
    accessoriesBonus: { fullKit: 500, boxOnly: 200, none: 0 },
  },
  {
    category: "mobile",
    brand: "Samsung",
    modelName: "Galaxy S25",
    slug: "samsung-galaxy-s25",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s25-sm-s931.jpg",
    variants: [
      { storage: "128GB", basePrice: 50000 },
      { storage: "256GB", basePrice: 56000 },
    ],
    conditionMultipliers: samsungConditionMultipliers,
    screenMultipliers: samsungScreenMultipliers,
    batteryDeductions: samsungBatteryDeductions,
    functionalDeductions: {
      batteryLow: 1800,
      cameraIssue: 2500,
      speakerIssue: 1200,
      biometricIssue: 2500,
      chargingIssue: 900,
    },
    accessoriesBonus: { fullKit: 500, boxOnly: 200, none: 0 },
  },

  // ══════════════════════════════════════════════════════
  //  SAMSUNG — Galaxy S24 Series
  // ══════════════════════════════════════════════════════

  {
    category: "mobile",
    brand: "Samsung",
    modelName: "Galaxy S24 Ultra",
    slug: "samsung-galaxy-s24-ultra",
    imageUrl:
      "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-ultra-5g-sm-s928-stylus.jpg",
    variants: [
      { storage: "256GB", basePrice: 72000 },
      { storage: "512GB", basePrice: 80000 },
      { storage: "1TB", basePrice: 90000 },
    ],
    conditionMultipliers: samsungConditionMultipliers,
    screenMultipliers: samsungScreenMultipliers,
    batteryDeductions: samsungBatteryDeductions,
    functionalDeductions: {
      batteryLow: 2000,
      cameraIssue: 3000,
      speakerIssue: 1500,
      biometricIssue: 3000,
      chargingIssue: 1000,
    },
    accessoriesBonus: { fullKit: 500, boxOnly: 200, none: 0 },
  },
  {
    category: "mobile",
    brand: "Samsung",
    modelName: "Galaxy S24+",
    slug: "samsung-galaxy-s24-plus",
    imageUrl:
      "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-plus-5g-sm-s926.jpg",
    variants: [
      { storage: "256GB", basePrice: 52000 },
      { storage: "512GB", basePrice: 59000 },
    ],
    conditionMultipliers: samsungConditionMultipliers,
    screenMultipliers: samsungScreenMultipliers,
    batteryDeductions: samsungBatteryDeductions,
    functionalDeductions: {
      batteryLow: 1500,
      cameraIssue: 2500,
      speakerIssue: 1200,
      biometricIssue: 2500,
      chargingIssue: 800,
    },
    accessoriesBonus: { fullKit: 400, boxOnly: 150, none: 0 },
  },
  {
    category: "mobile",
    brand: "Samsung",
    modelName: "Galaxy S24",
    slug: "samsung-galaxy-s24",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-5g-sm-s921.jpg",
    variants: [
      { storage: "128GB", basePrice: 40000 },
      { storage: "256GB", basePrice: 45000 },
    ],
    conditionMultipliers: samsungConditionMultipliers,
    screenMultipliers: samsungScreenMultipliers,
    batteryDeductions: samsungBatteryDeductions,
    functionalDeductions: {
      batteryLow: 1500,
      cameraIssue: 2000,
      speakerIssue: 1000,
      biometricIssue: 2000,
      chargingIssue: 700,
    },
    accessoriesBonus: { fullKit: 400, boxOnly: 150, none: 0 },
  },
  {
    category: "mobile",
    brand: "Samsung",
    modelName: "Galaxy S24 FE",
    slug: "samsung-galaxy-s24-fe",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-fe-r1.jpg",
    variants: [
      { storage: "128GB", basePrice: 30000 },
      { storage: "256GB", basePrice: 34000 },
    ],
    conditionMultipliers: samsungConditionMultipliers,
    screenMultipliers: samsungScreenMultipliers,
    batteryDeductions: samsungBatteryDeductions,
    functionalDeductions: {
      batteryLow: 1200,
      cameraIssue: 1800,
      speakerIssue: 900,
      biometricIssue: 1800,
      chargingIssue: 600,
    },
    accessoriesBonus: { fullKit: 300, boxOnly: 120, none: 0 },
  },

  // ══════════════════════════════════════════════════════
  //  SAMSUNG — Galaxy S23 Series
  // ══════════════════════════════════════════════════════

  {
    category: "mobile",
    brand: "Samsung",
    modelName: "Galaxy S23 Ultra",
    slug: "samsung-galaxy-s23-ultra",
    imageUrl:
      "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s23-ultra-5g.jpg",
    variants: [
      { storage: "256GB", basePrice: 48000 },
      { storage: "512GB", basePrice: 55000 },
      { storage: "1TB", basePrice: 63000 },
    ],
    conditionMultipliers: samsungConditionMultipliers,
    screenMultipliers: samsungScreenMultipliers,
    batteryDeductions: samsungBatteryDeductions,
    functionalDeductions: {
      batteryLow: 1800,
      cameraIssue: 2500,
      speakerIssue: 1200,
      biometricIssue: 2500,
      chargingIssue: 800,
    },
    accessoriesBonus: { fullKit: 400, boxOnly: 150, none: 0 },
  },
  {
    category: "mobile",
    brand: "Samsung",
    modelName: "Galaxy S23+",
    slug: "samsung-galaxy-s23-plus",
    imageUrl:
      "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s23-plus-5g.jpg",
    variants: [
      { storage: "256GB", basePrice: 35000 },
      { storage: "512GB", basePrice: 40000 },
    ],
    conditionMultipliers: samsungConditionMultipliers,
    screenMultipliers: samsungScreenMultipliers,
    batteryDeductions: samsungBatteryDeductions,
    functionalDeductions: {
      batteryLow: 1500,
      cameraIssue: 2000,
      speakerIssue: 1000,
      biometricIssue: 2000,
      chargingIssue: 700,
    },
    accessoriesBonus: { fullKit: 350, boxOnly: 130, none: 0 },
  },
  {
    category: "mobile",
    brand: "Samsung",
    modelName: "Galaxy S23",
    slug: "samsung-galaxy-s23",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s23-5g.jpg",
    variants: [
      { storage: "128GB", basePrice: 28000 },
      { storage: "256GB", basePrice: 32000 },
    ],
    conditionMultipliers: samsungConditionMultipliers,
    screenMultipliers: samsungScreenMultipliers,
    batteryDeductions: samsungBatteryDeductions,
    functionalDeductions: {
      batteryLow: 1200,
      cameraIssue: 1800,
      speakerIssue: 800,
      biometricIssue: 1800,
      chargingIssue: 600,
    },
    accessoriesBonus: { fullKit: 300, boxOnly: 120, none: 0 },
  },
  {
    category: "mobile",
    brand: "Samsung",
    modelName: "Galaxy S23 FE",
    slug: "samsung-galaxy-s23-fe",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s23-fe.jpg",
    variants: [
      { storage: "128GB", basePrice: 22000 },
      { storage: "256GB", basePrice: 25000 },
    ],
    conditionMultipliers: samsungConditionMultipliers,
    screenMultipliers: samsungScreenMultipliers,
    batteryDeductions: samsungBatteryDeductions,
    functionalDeductions: {
      batteryLow: 1000,
      cameraIssue: 1500,
      speakerIssue: 700,
      biometricIssue: 1500,
      chargingIssue: 500,
    },
    accessoriesBonus: { fullKit: 300, boxOnly: 100, none: 0 },
  },

  // ══════════════════════════════════════════════════════
  //  SAMSUNG — Galaxy Z Series (Foldables)
  // ══════════════════════════════════════════════════════

  {
    category: "mobile",
    brand: "Samsung",
    modelName: "Galaxy Z Fold 6",
    slug: "samsung-galaxy-z-fold-6",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-fold6.jpg",
    variants: [
      { storage: "256GB", basePrice: 100000 },
      { storage: "512GB", basePrice: 112000 },
    ],
    conditionMultipliers: samsungConditionMultipliers,
    screenMultipliers: {
      noScratch: 1.0,
      minorScratch: 0.92,
      crackedWorks: 0.65, // Foldables penalised more for screen issues
      crackedBroken: 0.4,
    },
    batteryDeductions: samsungBatteryDeductions,
    functionalDeductions: {
      batteryLow: 3000,
      cameraIssue: 4000,
      speakerIssue: 2000,
      biometricIssue: 4000,
      chargingIssue: 1500,
    },
    accessoriesBonus: { fullKit: 700, boxOnly: 300, none: 0 },
  },
  {
    category: "mobile",
    brand: "Samsung",
    modelName: "Galaxy Z Flip 6",
    slug: "samsung-galaxy-z-flip-6",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-flip6.jpg",
    variants: [
      { storage: "256GB", basePrice: 55000 },
      { storage: "512GB", basePrice: 62000 },
    ],
    conditionMultipliers: samsungConditionMultipliers,
    screenMultipliers: {
      noScratch: 1.0,
      minorScratch: 0.92,
      crackedWorks: 0.65,
      crackedBroken: 0.4,
    },
    batteryDeductions: samsungBatteryDeductions,
    functionalDeductions: {
      batteryLow: 2000,
      cameraIssue: 2500,
      speakerIssue: 1500,
      biometricIssue: 2500,
      chargingIssue: 1000,
    },
    accessoriesBonus: { fullKit: 600, boxOnly: 250, none: 0 },
  },

  // ══════════════════════════════════════════════════════
  //  SAMSUNG — Galaxy A Series (popular budget)
  // ══════════════════════════════════════════════════════

  {
    category: "mobile",
    brand: "Samsung",
    modelName: "Galaxy A55",
    slug: "samsung-galaxy-a55",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a55.jpg",
    variants: [
      { storage: "128GB", basePrice: 16000 },
      { storage: "256GB", basePrice: 19000 },
    ],
    conditionMultipliers: androidBudgetConditionMultipliers,
    screenMultipliers: androidBudgetScreenMultipliers,
    batteryDeductions: androidBudgetBatteryDeductions,
    functionalDeductions: {
      batteryLow: 800,
      cameraIssue: 1200,
      speakerIssue: 500,
      biometricIssue: 1200,
      chargingIssue: 400,
    },
    accessoriesBonus: { fullKit: 200, boxOnly: 80, none: 0 },
  },
  {
    category: "mobile",
    brand: "Samsung",
    modelName: "Galaxy A35",
    slug: "samsung-galaxy-a35",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a35.jpg",
    variants: [
      { storage: "128GB", basePrice: 12000 },
      { storage: "256GB", basePrice: 15000 },
    ],
    conditionMultipliers: androidBudgetConditionMultipliers,
    screenMultipliers: androidBudgetScreenMultipliers,
    batteryDeductions: androidBudgetBatteryDeductions,
    functionalDeductions: {
      batteryLow: 700,
      cameraIssue: 1000,
      speakerIssue: 400,
      biometricIssue: 1000,
      chargingIssue: 350,
    },
    accessoriesBonus: { fullKit: 150, boxOnly: 70, none: 0 },
  },

  // ══════════════════════════════════════════════════════
  //  ONEPLUS
  // ══════════════════════════════════════════════════════

  {
    category: "mobile",
    brand: "OnePlus",
    modelName: "OnePlus 13",
    slug: "oneplus-13",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-13.jpg",
    variants: [
      { storage: "256GB", basePrice: 50000 },
      { storage: "512GB", basePrice: 56000 },
    ],
    conditionMultipliers: androidMidConditionMultipliers,
    screenMultipliers: androidMidScreenMultipliers,
    batteryDeductions: androidMidBatteryDeductions,
    functionalDeductions: {
      batteryLow: 2000,
      cameraIssue: 2500,
      speakerIssue: 1200,
      biometricIssue: 2500,
      chargingIssue: 900,
    },
    accessoriesBonus: { fullKit: 500, boxOnly: 200, none: 0 },
  },
  {
    category: "mobile",
    brand: "OnePlus",
    modelName: "OnePlus 12",
    slug: "oneplus-12",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-12.jpg",
    variants: [
      { storage: "256GB", basePrice: 38000 },
      { storage: "512GB", basePrice: 42000 },
    ],
    conditionMultipliers: androidMidConditionMultipliers,
    screenMultipliers: androidMidScreenMultipliers,
    batteryDeductions: androidMidBatteryDeductions,
    functionalDeductions: {
      batteryLow: 1500,
      cameraIssue: 2000,
      speakerIssue: 1000,
      biometricIssue: 2000,
      chargingIssue: 800,
    },
    accessoriesBonus: { fullKit: 400, boxOnly: 150, none: 0 },
  },
  {
    category: "mobile",
    brand: "OnePlus",
    modelName: "OnePlus 12R",
    slug: "oneplus-12r",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-12r.jpg",
    variants: [
      { storage: "128GB", basePrice: 25000 },
      { storage: "256GB", basePrice: 28000 },
    ],
    conditionMultipliers: androidMidConditionMultipliers,
    screenMultipliers: androidMidScreenMultipliers,
    batteryDeductions: androidMidBatteryDeductions,
    functionalDeductions: {
      batteryLow: 1200,
      cameraIssue: 1800,
      speakerIssue: 800,
      biometricIssue: 1800,
      chargingIssue: 600,
    },
    accessoriesBonus: { fullKit: 300, boxOnly: 120, none: 0 },
  },
  {
    category: "mobile",
    brand: "OnePlus",
    modelName: "OnePlus Nord 4",
    slug: "oneplus-nord-4",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-nord4.jpg",
    variants: [
      { storage: "128GB", basePrice: 17000 },
      { storage: "256GB", basePrice: 20000 },
    ],
    conditionMultipliers: androidBudgetConditionMultipliers,
    screenMultipliers: androidBudgetScreenMultipliers,
    batteryDeductions: androidBudgetBatteryDeductions,
    functionalDeductions: {
      batteryLow: 900,
      cameraIssue: 1400,
      speakerIssue: 600,
      biometricIssue: 1400,
      chargingIssue: 400,
    },
    accessoriesBonus: { fullKit: 250, boxOnly: 100, none: 0 },
  },

  // ══════════════════════════════════════════════════════
  //  GOOGLE PIXEL
  // ══════════════════════════════════════════════════════

  {
    category: "mobile",
    brand: "Google",
    modelName: "Pixel 9 Pro XL",
    slug: "google-pixel-9-pro-xl",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-9-pro-xl-.jpg",
    variants: [
      { storage: "128GB", basePrice: 55000 },
      { storage: "256GB", basePrice: 60000 },
      { storage: "512GB", basePrice: 68000 },
    ],
    conditionMultipliers: androidMidConditionMultipliers,
    screenMultipliers: androidMidScreenMultipliers,
    batteryDeductions: androidMidBatteryDeductions,
    functionalDeductions: {
      batteryLow: 2000,
      cameraIssue: 3000,
      speakerIssue: 1200,
      biometricIssue: 3000,
      chargingIssue: 900,
    },
    accessoriesBonus: { fullKit: 500, boxOnly: 200, none: 0 },
  },
  {
    category: "mobile",
    brand: "Google",
    modelName: "Pixel 9 Pro",
    slug: "google-pixel-9-pro",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-9-pro-.jpg",
    variants: [
      { storage: "128GB", basePrice: 45000 },
      { storage: "256GB", basePrice: 50000 },
      { storage: "512GB", basePrice: 58000 },
    ],
    conditionMultipliers: androidMidConditionMultipliers,
    screenMultipliers: androidMidScreenMultipliers,
    batteryDeductions: androidMidBatteryDeductions,
    functionalDeductions: {
      batteryLow: 1500,
      cameraIssue: 2500,
      speakerIssue: 1000,
      biometricIssue: 2500,
      chargingIssue: 800,
    },
    accessoriesBonus: { fullKit: 400, boxOnly: 150, none: 0 },
  },
  {
    category: "mobile",
    brand: "Google",
    modelName: "Pixel 9",
    slug: "google-pixel-9",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-9-.jpg",
    variants: [
      { storage: "128GB", basePrice: 35000 },
      { storage: "256GB", basePrice: 40000 },
    ],
    conditionMultipliers: androidMidConditionMultipliers,
    screenMultipliers: androidMidScreenMultipliers,
    batteryDeductions: androidMidBatteryDeductions,
    functionalDeductions: {
      batteryLow: 1500,
      cameraIssue: 2200,
      speakerIssue: 1000,
      biometricIssue: 2200,
      chargingIssue: 700,
    },
    accessoriesBonus: { fullKit: 400, boxOnly: 150, none: 0 },
  },
  {
    category: "mobile",
    brand: "Google",
    modelName: "Pixel 8 Pro",
    slug: "google-pixel-8-pro",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-8-pro.jpg",
    variants: [
      { storage: "128GB", basePrice: 30000 },
      { storage: "256GB", basePrice: 35000 },
      { storage: "512GB", basePrice: 40000 },
      { storage: "1TB", basePrice: 46000 },
    ],
    conditionMultipliers: androidMidConditionMultipliers,
    screenMultipliers: androidMidScreenMultipliers,
    batteryDeductions: androidMidBatteryDeductions,
    functionalDeductions: {
      batteryLow: 1500,
      cameraIssue: 2200,
      speakerIssue: 1000,
      biometricIssue: 2200,
      chargingIssue: 700,
    },
    accessoriesBonus: { fullKit: 400, boxOnly: 150, none: 0 },
  },
  {
    category: "mobile",
    brand: "Google",
    modelName: "Pixel 8a",
    slug: "google-pixel-8a",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-8a.jpg",
    variants: [
      { storage: "128GB", basePrice: 22000 },
      { storage: "256GB", basePrice: 26000 },
    ],
    conditionMultipliers: androidMidConditionMultipliers,
    screenMultipliers: androidMidScreenMultipliers,
    batteryDeductions: androidMidBatteryDeductions,
    functionalDeductions: {
      batteryLow: 1200,
      cameraIssue: 1800,
      speakerIssue: 800,
      biometricIssue: 1800,
      chargingIssue: 600,
    },
    accessoriesBonus: { fullKit: 300, boxOnly: 120, none: 0 },
  },

  // ══════════════════════════════════════════════════════
  //  XIAOMI
  // ══════════════════════════════════════════════════════

  {
    category: "mobile",
    brand: "Xiaomi",
    modelName: "Xiaomi 15 Ultra",
    slug: "xiaomi-15-ultra",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-15-ultra-.jpg",
    variants: [
      { storage: "256GB", basePrice: 55000 },
      { storage: "512GB", basePrice: 62000 },
    ],
    conditionMultipliers: androidMidConditionMultipliers,
    screenMultipliers: androidMidScreenMultipliers,
    batteryDeductions: androidMidBatteryDeductions,
    functionalDeductions: {
      batteryLow: 1800,
      cameraIssue: 2500,
      speakerIssue: 1000,
      biometricIssue: 2500,
      chargingIssue: 800,
    },
    accessoriesBonus: { fullKit: 400, boxOnly: 150, none: 0 },
  },
  {
    category: "mobile",
    brand: "Xiaomi",
    modelName: "Xiaomi 14 Ultra",
    slug: "xiaomi-14-ultra",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-14-ultra-new.jpg",
    variants: [
      { storage: "256GB", basePrice: 35000 },
      { storage: "512GB", basePrice: 40000 },
    ],
    conditionMultipliers: { likenew: 1.0, good: 0.82, fair: 0.68, poor: 0.48 },
    screenMultipliers: androidMidScreenMultipliers,
    batteryDeductions: androidMidBatteryDeductions,
    functionalDeductions: {
      batteryLow: 1200,
      cameraIssue: 2000,
      speakerIssue: 800,
      biometricIssue: 2000,
      chargingIssue: 600,
    },
    accessoriesBonus: { fullKit: 300, boxOnly: 100, none: 0 },
  },
  {
    category: "mobile",
    brand: "Xiaomi",
    modelName: "Xiaomi 14",
    slug: "xiaomi-14",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-14.jpg",
    variants: [
      { storage: "256GB", basePrice: 28000 },
      { storage: "512GB", basePrice: 32000 },
    ],
    conditionMultipliers: { likenew: 1.0, good: 0.82, fair: 0.68, poor: 0.48 },
    screenMultipliers: androidMidScreenMultipliers,
    batteryDeductions: androidMidBatteryDeductions,
    functionalDeductions: {
      batteryLow: 1000,
      cameraIssue: 1600,
      speakerIssue: 700,
      biometricIssue: 1600,
      chargingIssue: 500,
    },
    accessoriesBonus: { fullKit: 300, boxOnly: 100, none: 0 },
  },

  // ══════════════════════════════════════════════════════
  //  REALME
  // ══════════════════════════════════════════════════════

  {
    category: "mobile",
    brand: "Realme",
    modelName: "Realme GT 7 Pro",
    slug: "realme-gt-7-pro",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/realme-gt7-pro.jpg",
    variants: [
      { storage: "256GB", basePrice: 28000 },
      { storage: "512GB", basePrice: 32000 },
    ],
    conditionMultipliers: androidBudgetConditionMultipliers,
    screenMultipliers: androidBudgetScreenMultipliers,
    batteryDeductions: androidBudgetBatteryDeductions,
    functionalDeductions: {
      batteryLow: 1200,
      cameraIssue: 1800,
      speakerIssue: 700,
      biometricIssue: 1800,
      chargingIssue: 600,
    },
    accessoriesBonus: { fullKit: 300, boxOnly: 100, none: 0 },
  },
  {
    category: "mobile",
    brand: "Realme",
    modelName: "Realme GT 5 Pro",
    slug: "realme-gt-5-pro",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/realme-gt5-pro.jpg",
    variants: [
      { storage: "128GB", basePrice: 18000 },
      { storage: "256GB", basePrice: 22000 },
    ],
    conditionMultipliers: androidBudgetConditionMultipliers,
    screenMultipliers: androidBudgetScreenMultipliers,
    batteryDeductions: androidBudgetBatteryDeductions,
    functionalDeductions: {
      batteryLow: 1000,
      cameraIssue: 1500,
      speakerIssue: 600,
      biometricIssue: 1500,
      chargingIssue: 500,
    },
    accessoriesBonus: { fullKit: 300, boxOnly: 100, none: 0 },
  },
  {
    category: "mobile",
    brand: "Realme",
    modelName: "Realme 13 Pro+",
    slug: "realme-13-pro-plus",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/realme-13-pro-plus.jpg",
    variants: [
      { storage: "256GB", basePrice: 22000 },
      { storage: "512GB", basePrice: 26000 },
    ],
    conditionMultipliers: androidBudgetConditionMultipliers,
    screenMultipliers: androidBudgetScreenMultipliers,
    batteryDeductions: androidBudgetBatteryDeductions,
    functionalDeductions: {
      batteryLow: 1000,
      cameraIssue: 1500,
      speakerIssue: 600,
      biometricIssue: 1500,
      chargingIssue: 500,
    },
    accessoriesBonus: { fullKit: 250, boxOnly: 100, none: 0 },
  },

  // ══════════════════════════════════════════════════════
  //  VIVO
  // ══════════════════════════════════════════════════════

  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Vivo X200 Pro",
    slug: "vivo-x200-pro",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-x200-pro.jpg",
    variants: [
      { storage: "256GB", basePrice: 32000 },
      { storage: "512GB", basePrice: 37000 },
    ],
    conditionMultipliers: { likenew: 1.0, good: 0.82, fair: 0.68, poor: 0.48 },
    screenMultipliers: androidMidScreenMultipliers,
    batteryDeductions: androidMidBatteryDeductions,
    functionalDeductions: {
      batteryLow: 1200,
      cameraIssue: 2000,
      speakerIssue: 800,
      biometricIssue: 2000,
      chargingIssue: 600,
    },
    accessoriesBonus: { fullKit: 300, boxOnly: 100, none: 0 },
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Vivo V40 Pro",
    slug: "vivo-v40-pro",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v40-pro.jpg",
    variants: [{ storage: "256GB", basePrice: 24000 }],
    conditionMultipliers: androidBudgetConditionMultipliers,
    screenMultipliers: androidBudgetScreenMultipliers,
    batteryDeductions: androidBudgetBatteryDeductions,
    functionalDeductions: {
      batteryLow: 1000,
      cameraIssue: 1500,
      speakerIssue: 600,
      biometricIssue: 1500,
      chargingIssue: 500,
    },
    accessoriesBonus: { fullKit: 250, boxOnly: 100, none: 0 },
  },

  // ══════════════════════════════════════════════════════
  //  OPPO
  // ══════════════════════════════════════════════════════

  {
    category: "mobile",
    brand: "OPPO",
    modelName: "OPPO Find X8 Pro",
    slug: "oppo-find-x8-pro",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-find-x8-pro.jpg",
    variants: [
      { storage: "256GB", basePrice: 40000 },
      { storage: "512GB", basePrice: 46000 },
    ],
    conditionMultipliers: { likenew: 1.0, good: 0.82, fair: 0.68, poor: 0.48 },
    screenMultipliers: androidMidScreenMultipliers,
    batteryDeductions: androidMidBatteryDeductions,
    functionalDeductions: {
      batteryLow: 1500,
      cameraIssue: 2200,
      speakerIssue: 900,
      biometricIssue: 2200,
      chargingIssue: 700,
    },
    accessoriesBonus: { fullKit: 350, boxOnly: 130, none: 0 },
  },
  {
    category: "mobile",
    brand: "OPPO",
    modelName: "OPPO Find X7 Ultra",
    slug: "oppo-find-x7-ultra",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-find-x7-ultra.jpg",
    variants: [{ storage: "256GB", basePrice: 34000 }],
    conditionMultipliers: { likenew: 1.0, good: 0.82, fair: 0.68, poor: 0.48 },
    screenMultipliers: androidMidScreenMultipliers,
    batteryDeductions: androidMidBatteryDeductions,
    functionalDeductions: {
      batteryLow: 1200,
      cameraIssue: 2000,
      speakerIssue: 800,
      biometricIssue: 2000,
      chargingIssue: 600,
    },
    accessoriesBonus: { fullKit: 300, boxOnly: 100, none: 0 },
  },
  {
    category: "mobile",
    brand: "OPPO",
    modelName: "OPPO Reno 13 Pro",
    slug: "oppo-reno-13-pro",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-reno13-pro-cn.jpg",
    variants: [{ storage: "256GB", basePrice: 20000 }],
    conditionMultipliers: androidBudgetConditionMultipliers,
    screenMultipliers: androidBudgetScreenMultipliers,
    batteryDeductions: androidBudgetBatteryDeductions,
    functionalDeductions: {
      batteryLow: 900,
      cameraIssue: 1400,
      speakerIssue: 600,
      biometricIssue: 1400,
      chargingIssue: 450,
    },
    accessoriesBonus: { fullKit: 250, boxOnly: 100, none: 0 },
  },

  // ══════════════════════════════════════════════════════
  //  MOTOROLA
  // ══════════════════════════════════════════════════════

  {
    category: "mobile",
    brand: "Motorola",
    modelName: "Motorola Edge 50 Ultra",
    slug: "motorola-edge-50-ultra",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/motorola-edge-50-ultra.jpg",
    variants: [
      { storage: "256GB", basePrice: 28000 },
      { storage: "512GB", basePrice: 32000 },
    ],
    conditionMultipliers: { likenew: 1.0, good: 0.82, fair: 0.68, poor: 0.48 },
    screenMultipliers: androidMidScreenMultipliers,
    batteryDeductions: androidMidBatteryDeductions,
    functionalDeductions: {
      batteryLow: 1000,
      cameraIssue: 1500,
      speakerIssue: 600,
      biometricIssue: 1500,
      chargingIssue: 500,
    },
    accessoriesBonus: { fullKit: 300, boxOnly: 100, none: 0 },
  },
  {
    category: "mobile",
    brand: "Motorola",
    modelName: "Motorola Edge 50 Pro",
    slug: "motorola-edge-50-pro",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/motorola-edge-50-pro.jpg",
    variants: [{ storage: "256GB", basePrice: 20000 }],
    conditionMultipliers: androidBudgetConditionMultipliers,
    screenMultipliers: androidBudgetScreenMultipliers,
    batteryDeductions: androidBudgetBatteryDeductions,
    functionalDeductions: {
      batteryLow: 900,
      cameraIssue: 1300,
      speakerIssue: 500,
      biometricIssue: 1300,
      chargingIssue: 400,
    },
    accessoriesBonus: { fullKit: 250, boxOnly: 100, none: 0 },
  },

  // ══════════════════════════════════════════════════════
  //  NOTHING PHONE
  // ══════════════════════════════════════════════════════

  {
    category: "mobile",
    brand: "Nothing",
    modelName: "Nothing Phone (3)",
    slug: "nothing-phone-3",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/nothing-phone-3.jpg",
    variants: [
      { storage: "256GB", basePrice: 38000 },
      { storage: "512GB", basePrice: 44000 },
    ],
    conditionMultipliers: androidMidConditionMultipliers,
    screenMultipliers: androidMidScreenMultipliers,
    batteryDeductions: androidMidBatteryDeductions,
    functionalDeductions: {
      batteryLow: 1200,
      cameraIssue: 1800,
      speakerIssue: 700,
      biometricIssue: 1800,
      chargingIssue: 600,
    },
    accessoriesBonus: { fullKit: 350, boxOnly: 130, none: 0 },
  },
  {
    category: "mobile",
    brand: "Nothing",
    modelName: "Nothing Phone (2a) Plus",
    slug: "nothing-phone-2a-plus",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/nothing-phone-2a-plus.jpg",
    variants: [
      { storage: "128GB", basePrice: 16000 },
      { storage: "256GB", basePrice: 19000 },
    ],
    conditionMultipliers: androidBudgetConditionMultipliers,
    screenMultipliers: androidBudgetScreenMultipliers,
    batteryDeductions: androidBudgetBatteryDeductions,
    functionalDeductions: {
      batteryLow: 800,
      cameraIssue: 1200,
      speakerIssue: 500,
      biometricIssue: 1200,
      chargingIssue: 400,
    },
    accessoriesBonus: { fullKit: 200, boxOnly: 100, none: 0 },
  },
  {
    category: "mobile",
    brand: "Nothing",
    modelName: "Nothing Phone (2a)",
    slug: "nothing-phone-2a",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/nothing-phone-2a.jpg",
    variants: [
      { storage: "128GB", basePrice: 14000 },
      { storage: "256GB", basePrice: 17000 },
    ],
    conditionMultipliers: androidBudgetConditionMultipliers,
    screenMultipliers: androidBudgetScreenMultipliers,
    batteryDeductions: androidBudgetBatteryDeductions,
    functionalDeductions: {
      batteryLow: 700,
      cameraIssue: 1100,
      speakerIssue: 450,
      biometricIssue: 1100,
      chargingIssue: 350,
    },
    accessoriesBonus: { fullKit: 200, boxOnly: 100, none: 0 },
  },

  // ══════════════════════════════════════════════════════
  //  IQOO (Vivo sub-brand, popular in India)
  // ══════════════════════════════════════════════════════

  {
    category: "mobile",
    brand: "iQOO",
    modelName: "iQOO 13",
    slug: "iqoo-13",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-iqoo-13.jpg",
    variants: [
      { storage: "256GB", basePrice: 42000 },
      { storage: "512GB", basePrice: 48000 },
    ],
    conditionMultipliers: androidMidConditionMultipliers,
    screenMultipliers: androidMidScreenMultipliers,
    batteryDeductions: androidMidBatteryDeductions,
    functionalDeductions: {
      batteryLow: 1500,
      cameraIssue: 2200,
      speakerIssue: 900,
      biometricIssue: 2200,
      chargingIssue: 700,
    },
    accessoriesBonus: { fullKit: 400, boxOnly: 150, none: 0 },
  },
  {
    category: "mobile",
    brand: "iQOO",
    modelName: "iQOO 12",
    slug: "iqoo-12",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-iqoo12.jpg",
    variants: [
      { storage: "256GB", basePrice: 32000 },
      { storage: "512GB", basePrice: 37000 },
    ],
    conditionMultipliers: androidMidConditionMultipliers,
    screenMultipliers: androidMidScreenMultipliers,
    batteryDeductions: androidMidBatteryDeductions,
    functionalDeductions: {
      batteryLow: 1200,
      cameraIssue: 1800,
      speakerIssue: 800,
      biometricIssue: 1800,
      chargingIssue: 600,
    },
    accessoriesBonus: { fullKit: 350, boxOnly: 130, none: 0 },
  },
];

// ─── SEED FUNCTION ────────────────────────────────────────────────────────────

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
    await Device.deleteMany({});
    console.log("Cleared existing devices");
    await Device.insertMany(devices);
    console.log(`✅ Seeded ${devices.length} devices successfully`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
}

seed();
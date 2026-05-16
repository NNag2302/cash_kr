import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import Device from '../models/Device.js';

// ─── LAPTOP PRICING MODEL ──────────────────────────────────────────────────
// finalPrice = round(
//   (baseConfigPrice × ageMultiplier × conditionMultiplier × screenMultiplier)
//   - sum(functionalDeductions)
//   + accessoriesBonus
// , nearest 100)

// ─── SHARED MULTIPLIER PRESETS ──────────────────────────────────────────────

const ageMultipliers = {
  lessThan1: 0.92, oneToTwo: 0.78, twoToThree: 0.62,
  threeToFour: 0.48, fourToFive: 0.36, moreThan5: 0.22,
};

const screenMultipliers = {
  noIssue: 1.0, minorScratch: 0.96, deadPixels: 0.82,
  crackedWorks: 0.68, crackedBroken: 0.45,
};

// Condition multipliers by tier
const premiumCond = { likenew: 1.0, good: 0.88, fair: 0.72, poor: 0.50 };
const midCond = { likenew: 1.0, good: 0.85, fair: 0.68, poor: 0.46 };
const budgetCond = { likenew: 1.0, good: 0.82, fair: 0.62, poor: 0.40 };
const gamingCond = { likenew: 1.0, good: 0.86, fair: 0.70, poor: 0.48 };

// Functional deductions by tier
const tierADed = { battery:2000, keyboard:2500, trackpad:1500, speakers:1000, webcam:800, ports:1200, hinge:2000, overheat:1500, gpu:3000 };
const tierBDed = { battery:1500, keyboard:2000, trackpad:1200, speakers:800, webcam:600, ports:1000, hinge:1500, overheat:1200, gpu:2500 };
const tierCDed = { battery:1000, keyboard:1500, trackpad:1000, speakers:600, webcam:500, ports:800, hinge:1000, overheat:1000, gpu:2000 };
const tierDDed = { battery:800, keyboard:1000, trackpad:800, speakers:400, webcam:300, ports:500, hinge:800, overheat:600, gpu:1500 };

// Accessories bonus by tier
const accAB = { withBoxAndCharger:800, originalCharger:500, thirdPartyCharger:200, none:0 };
const accCD = { withBoxAndCharger:500, originalCharger:300, thirdPartyCharger:150, none:0 };

function mk(tier, processorFamily, generation, gpuType, isGaming, modelName, slug, variants) {
  const cond = tier === 'Premium' ? premiumCond : tier === 'Gaming' ? gamingCond : tier === 'Mid-range' ? midCond : budgetCond;
  const maxBase = Math.max(...variants.map(v => v.basePrice));
  let ded, acc;
  if (maxBase > 80000) { ded = tierADed; acc = accAB; }
  else if (maxBase >= 40000) { ded = tierBDed; acc = accAB; }
  else if (maxBase >= 20000) { ded = tierCDed; acc = accCD; }
  else { ded = tierDDed; acc = accCD; }
  return {
    category: 'laptop', brand: modelName.split(' ')[0] === 'MacBook' ? 'Apple' : modelName.split(' ')[0],
    modelName, slug, imageUrl: '', processorFamily, generation: generation || '', gpuType: gpuType || '', isGamingLaptop: !!isGaming, tier,
    variants: variants.map(v => ({ 
      processor: v.processor || processorFamily, 
      generation: v.generation || generation,
      ram: v.ram, 
      storage: v.storage, 
      storageType: v.storage.includes('HDD') ? 'HDD' : 'SSD', 
      basePrice: v.basePrice 
    })),
    conditionMultipliers: cond, ageMultipliers, screenMultipliers,
    functionalDeductions: ded, accessoriesBonus: acc, isActive: true,
  };
}

function apple(name, slug, proc, tier, variants) {
  const d = mk(tier, proc, 'M-Series', '', false, name, slug, variants);
  d.brand = 'Apple';
  return d;
}

function dell(name, slug, proc, gen, tier, variants, gpu, gaming) {
  const d = mk(tier, proc, gen, gpu, gaming, name, slug, variants);
  d.brand = 'Dell';
  return d;
}

function acer(name, slug, proc, gen, tier, variants, gpu, gaming) {
  const d = mk(tier, proc, gen, gpu, gaming, name, slug, variants);
  d.brand = 'Acer';
  return d;
}

const devices = [
  // ══ APPLE ══
  apple('MacBook Pro 16-inch M4 Max', 'apple-macbook-pro-16-m4-max', 'Apple M4 Max', 'Premium', [
    { ram:'36GB', storage:'512GB SSD', basePrice:185000 }, { ram:'36GB', storage:'1TB SSD', basePrice:200000 },
    { ram:'64GB', storage:'1TB SSD', basePrice:220000 }, { ram:'64GB', storage:'2TB SSD', basePrice:245000 },
    { ram:'128GB', storage:'2TB SSD', basePrice:275000 },
  ]),
  apple('MacBook Pro 16-inch M4 Pro', 'apple-macbook-pro-16-m4-pro', 'Apple M4 Pro', 'Premium', [
    { ram:'24GB', storage:'512GB SSD', basePrice:145000 }, { ram:'24GB', storage:'1TB SSD', basePrice:160000 },
    { ram:'48GB', storage:'1TB SSD', basePrice:180000 }, { ram:'48GB', storage:'2TB SSD', basePrice:200000 },
  ]),
  apple('MacBook Pro 14-inch M4 Max', 'apple-macbook-pro-14-m4-max', 'Apple M4 Max', 'Premium', [
    { ram:'36GB', storage:'512GB SSD', basePrice:175000 }, { ram:'36GB', storage:'1TB SSD', basePrice:190000 },
    { ram:'64GB', storage:'1TB SSD', basePrice:210000 },
  ]),
  apple('MacBook Pro 14-inch M4 Pro', 'apple-macbook-pro-14-m4-pro', 'Apple M4 Pro', 'Premium', [
    { ram:'24GB', storage:'512GB SSD', basePrice:135000 }, { ram:'24GB', storage:'1TB SSD', basePrice:150000 },
    { ram:'48GB', storage:'1TB SSD', basePrice:170000 },
  ]),
  apple('MacBook Pro 14-inch M4', 'apple-macbook-pro-14-m4', 'Apple M4', 'Premium', [
    { ram:'16GB', storage:'512GB SSD', basePrice:105000 }, { ram:'32GB', storage:'512GB SSD', basePrice:120000 },
    { ram:'32GB', storage:'1TB SSD', basePrice:135000 },
  ]),
  apple('MacBook Pro 13-inch M2', 'apple-macbook-pro-13-m2', 'Apple M2', 'Premium', [
    { ram:'8GB', storage:'256GB SSD', basePrice:68000 }, { ram:'8GB', storage:'512GB SSD', basePrice:78000 },
    { ram:'16GB', storage:'512GB SSD', basePrice:90000 }, { ram:'16GB', storage:'1TB SSD', basePrice:105000 },
  ]),
  apple('MacBook Air 15-inch M3', 'apple-macbook-air-15-m3', 'Apple M3', 'Mid-range', [
    { ram:'8GB', storage:'256GB SSD', basePrice:72000 }, { ram:'8GB', storage:'512GB SSD', basePrice:82000 },
    { ram:'16GB', storage:'256GB SSD', basePrice:85000 }, { ram:'16GB', storage:'512GB SSD', basePrice:95000 },
    { ram:'24GB', storage:'1TB SSD', basePrice:115000 },
  ]),
  apple('MacBook Air 13-inch M3', 'apple-macbook-air-13-m3', 'Apple M3', 'Mid-range', [
    { ram:'8GB', storage:'256GB SSD', basePrice:62000 }, { ram:'8GB', storage:'512GB SSD', basePrice:72000 },
    { ram:'16GB', storage:'256GB SSD', basePrice:75000 }, { ram:'16GB', storage:'512GB SSD', basePrice:85000 },
    { ram:'24GB', storage:'1TB SSD', basePrice:105000 },
  ]),
  apple('MacBook Air 13-inch M2', 'apple-macbook-air-13-m2', 'Apple M2', 'Mid-range', [
    { ram:'8GB', storage:'256GB SSD', basePrice:52000 }, { ram:'8GB', storage:'512GB SSD', basePrice:62000 },
    { ram:'16GB', storage:'256GB SSD', basePrice:65000 }, { ram:'16GB', storage:'512GB SSD', basePrice:75000 },
  ]),
  apple('MacBook Air 13-inch M1', 'apple-macbook-air-13-m1', 'Apple M1', 'Mid-range', [
    { ram:'8GB', storage:'256GB SSD', basePrice:38000 }, { ram:'8GB', storage:'512GB SSD', basePrice:45000 },
    { ram:'16GB', storage:'256GB SSD', basePrice:48000 }, { ram:'16GB', storage:'512GB SSD', basePrice:55000 },
  ]),

  // ══ DELL ══
  dell('Dell XPS 15 (2024)', 'dell-xps-15-2024', 'Intel Core Ultra 7', 'Ultra Gen', 'Premium', [
    { ram:'16GB', storage:'512GB SSD', basePrice:82000 }, { ram:'16GB', storage:'1TB SSD', basePrice:92000 },
    { ram:'32GB', storage:'1TB SSD', basePrice:108000 }, { ram:'64GB', storage:'2TB SSD', basePrice:135000 },
  ]),
  dell('Dell XPS 13 (2024)', 'dell-xps-13-2024', 'Intel Core Ultra 5', 'Ultra Gen', 'Premium', [
    { ram:'16GB', storage:'512GB SSD', basePrice:62000 }, { ram:'32GB', storage:'1TB SSD', basePrice:78000 },
  ]),
  dell('Dell Inspiron 16 Plus', 'dell-inspiron-16-plus', 'Intel Core i7', '13th Gen', 'Mid-range', [
    { ram:'16GB', storage:'512GB SSD', basePrice:48000 }, { ram:'16GB', storage:'1TB SSD', basePrice:56000 },
    { ram:'32GB', storage:'1TB SSD', basePrice:68000 },
  ]),
  dell('Dell Inspiron 15 3520', 'dell-inspiron-15-3520', 'Intel Core i5', '12th Gen', 'Mid-range', [
    { ram:'8GB', storage:'512GB SSD', basePrice:28000 }, { ram:'16GB', storage:'512GB SSD', basePrice:34000 },
    { ram:'16GB', storage:'1TB SSD', basePrice:40000 },
  ]),
  dell('Dell Inspiron 14 (2023)', 'dell-inspiron-14-2023', 'Intel Core i5', '13th Gen', 'Mid-range', [
    { ram:'8GB', storage:'256GB SSD', basePrice:22000 }, { ram:'8GB', storage:'512GB SSD', basePrice:26000 },
    { ram:'16GB', storage:'512GB SSD', basePrice:32000 },
  ]),
  dell('Dell Vostro 15 3530', 'dell-vostro-15-3530', 'Intel Core i5', '13th Gen', 'Budget', [
    { ram:'8GB', storage:'512GB SSD', basePrice:22000 }, { ram:'16GB', storage:'512GB SSD', basePrice:28000 },
  ]),
  dell('Dell G15 Gaming (2024)', 'dell-g15-gaming-2024', 'Intel Core i7', '14th Gen', 'Gaming', [
    { ram:'16GB', storage:'512GB SSD', basePrice:68000 }, { ram:'16GB', storage:'1TB SSD', basePrice:76000 },
    { ram:'32GB', storage:'1TB SSD', basePrice:88000 },
  ], 'NVIDIA RTX 4060', true),
  dell('Dell Alienware m16 R2', 'dell-alienware-m16-r2', 'Intel Core i9', '14th Gen', 'Gaming', [
    { ram:'32GB', storage:'1TB SSD', basePrice:185000 }, { ram:'32GB', storage:'2TB SSD', basePrice:210000 },
    { ram:'64GB', storage:'2TB SSD', basePrice:240000 },
  ], 'NVIDIA RTX 4080', true),

  // ══ HP ══
  mk('Premium', 'Intel Core Ultra 7', 'Ultra Gen', '', false, 'HP Spectre x360 14 (2024)', 'hp-spectre-x360-14-2024', [
    { ram:'16GB', storage:'512GB SSD', basePrice:78000 }, { ram:'16GB', storage:'1TB SSD', basePrice:88000 },
    { ram:'32GB', storage:'1TB SSD', basePrice:105000 },
  ]),
  mk('Premium', 'Intel Core Ultra 9', 'Ultra Gen', '', false, 'HP Spectre x360 16 (2024)', 'hp-spectre-x360-16-2024', [
    { ram:'32GB', storage:'1TB SSD', basePrice:118000 }, { ram:'64GB', storage:'2TB SSD', basePrice:148000 },
  ]),
  mk('Mid-range', 'Intel Core i7', '13th Gen', '', false, 'HP Envy 16 (2024)', 'hp-envy-16-2024', [
    { ram:'16GB', storage:'512GB SSD', basePrice:58000 }, { ram:'32GB', storage:'1TB SSD', basePrice:72000 },
  ]),
  mk('Mid-range', 'Intel Core i5', '13th Gen', '', false, 'HP Pavilion 15 (2024)', 'hp-pavilion-15-2024', [
    { ram:'8GB', storage:'512GB SSD', basePrice:28000 }, { ram:'16GB', storage:'512GB SSD', basePrice:34000 },
    { ram:'16GB', storage:'1TB SSD', basePrice:40000 },
  ]),
  mk('Budget', 'Intel Core i3', '12th Gen', '', false, 'HP 15s (2024)', 'hp-15s-2024', [
    { ram:'8GB', storage:'256GB SSD', basePrice:18000 }, { ram:'8GB', storage:'512GB SSD', basePrice:22000 },
    { ram:'16GB', storage:'512GB SSD', basePrice:26000 },
  ]),
  mk('Gaming', 'Intel Core i7', '13th Gen', 'NVIDIA RTX 4070', true, 'HP Omen 16 (2024)', 'hp-omen-16-2024', [
    { ram:'16GB', storage:'512GB SSD', basePrice:92000 }, { ram:'32GB', storage:'1TB SSD', basePrice:110000 },
  ]),
  mk('Gaming', 'Intel Core i5', '13th Gen', 'NVIDIA RTX 4060', true, 'HP Victus 16 (2024)', 'hp-victus-16-2024', [
    { ram:'16GB', storage:'512GB SSD', basePrice:55000 }, { ram:'16GB', storage:'1TB SSD', basePrice:62000 },
  ]),

  // ══ LENOVO ══
  mk('Premium', 'Intel Core Ultra 7', 'Ultra Gen', '', false, 'Lenovo ThinkPad X1 Carbon Gen 12', 'lenovo-thinkpad-x1-carbon-gen12', [
    { ram:'16GB', storage:'512GB SSD', basePrice:98000 }, { ram:'32GB', storage:'1TB SSD', basePrice:125000 },
    { ram:'64GB', storage:'2TB SSD', basePrice:158000 },
  ]),
  mk('Mid-range', 'Intel Core i5', '13th Gen', '', false, 'Lenovo ThinkPad E14 Gen 5', 'lenovo-thinkpad-e14-gen5', [
    { ram:'8GB', storage:'256GB SSD', basePrice:35000 }, { ram:'16GB', storage:'512GB SSD', basePrice:44000 },
    { ram:'16GB', storage:'1TB SSD', basePrice:52000 },
  ]),
  mk('Mid-range', 'Intel Core i7', '13th Gen', '', false, 'Lenovo IdeaPad Slim 5 (2024)', 'lenovo-ideapad-slim-5-2024', [
    { ram:'16GB', storage:'512GB SSD', basePrice:42000 }, { ram:'16GB', storage:'1TB SSD', basePrice:50000 },
  ]),
  mk('Budget', 'Intel Core i3', '12th Gen', '', false, 'Lenovo IdeaPad Slim 3 (2024)', 'lenovo-ideapad-slim-3-2024', [
    { ram:'8GB', storage:'256GB SSD', basePrice:20000 }, { ram:'8GB', storage:'512GB SSD', basePrice:24000 },
    { ram:'16GB', storage:'512GB SSD', basePrice:28000 },
  ]),
  mk('Gaming', 'Intel Core i9', '14th Gen', 'NVIDIA RTX 4080', true, 'Lenovo Legion Pro 7i Gen 9', 'lenovo-legion-pro-7i-gen9', [
    { ram:'32GB', storage:'1TB SSD', basePrice:195000 }, { ram:'32GB', storage:'2TB SSD', basePrice:220000 },
    { ram:'64GB', storage:'2TB SSD', basePrice:250000 },
  ]),
  mk('Gaming', 'AMD Ryzen 9', '7000 Series', 'NVIDIA RTX 4070', true, 'Lenovo Legion 5 Pro Gen 9', 'lenovo-legion-5-pro-gen9', [
    { ram:'16GB', storage:'512GB SSD', basePrice:95000 }, { ram:'32GB', storage:'1TB SSD', basePrice:115000 },
  ]),
  mk('Gaming', 'Intel Core i7', '14th Gen', 'NVIDIA RTX 4060', true, 'Lenovo Legion 5i Gen 9', 'lenovo-legion-5i-gen9', [
    { ram:'16GB', storage:'512GB SSD', basePrice:72000 }, { ram:'32GB', storage:'1TB SSD', basePrice:88000 },
  ]),

  // ══ ASUS ══
  mk('Premium', 'Intel Core i9', '14th Gen', 'NVIDIA RTX 4070', false, 'Asus ZenBook Pro 16X (2024)', 'asus-zenbook-pro-16x-2024', [
    { ram:'32GB', storage:'1TB SSD', basePrice:155000 }, { ram:'64GB', storage:'2TB SSD', basePrice:185000 },
  ]),
  mk('Mid-range', 'Intel Core Ultra 7', 'Ultra Gen', '', false, 'Asus ZenBook 14 OLED (2024)', 'asus-zenbook-14-oled-2024', [
    { ram:'16GB', storage:'512GB SSD', basePrice:58000 }, { ram:'32GB', storage:'1TB SSD', basePrice:72000 },
  ]),
  mk('Mid-range', 'AMD Ryzen 5', '7000 Series', '', false, 'Asus VivoBook 16 (2024)', 'asus-vivobook-16-2024', [
    { ram:'8GB', storage:'512GB SSD', basePrice:28000 }, { ram:'16GB', storage:'512GB SSD', basePrice:34000 },
  ]),
  mk('Budget', 'Intel Core i3', '12th Gen', '', false, 'Asus VivoBook 15 (2024)', 'asus-vivobook-15-2024', [
    { ram:'8GB', storage:'256GB SSD', basePrice:18000 }, { ram:'8GB', storage:'512GB SSD', basePrice:22000 },
  ]),
  mk('Gaming', 'Intel Core Ultra 9', 'Ultra Gen', 'NVIDIA RTX 4090', true, 'Asus ROG Zephyrus G16 (2024)', 'asus-rog-zephyrus-g16-2024', [
    { ram:'32GB', storage:'1TB SSD', basePrice:225000 }, { ram:'64GB', storage:'2TB SSD', basePrice:265000 },
  ]),
  mk('Gaming', 'Intel Core i9', '14th Gen', 'NVIDIA RTX 4080', true, 'Asus ROG Strix G16 (2024)', 'asus-rog-strix-g16-2024', [
    { ram:'16GB', storage:'512GB SSD', basePrice:145000 }, { ram:'32GB', storage:'1TB SSD', basePrice:168000 },
  ]),
  mk('Gaming', 'AMD Ryzen 7', '7000 Series', 'NVIDIA RTX 4060', true, 'Asus TUF Gaming A15 (2024)', 'asus-tuf-gaming-a15-2024', [
    { ram:'16GB', storage:'512GB SSD', basePrice:62000 }, { ram:'16GB', storage:'1TB SSD', basePrice:70000 },
  ]),

  // ══ ACER ══
  acer('Acer Nitro 7 Series', 'acer-nitro-7-series', 'Intel Core i7', '9th Gen', 'Gaming', [
    // Intel variants
    { processor: 'Intel Core i3', generation: '10th Gen', ram:'8GB', storage:'256GB SSD', basePrice:22000 },
    { processor: 'Intel Core i5', generation: '9th Gen', ram:'8GB', storage:'1TB HDD', basePrice:28000 },
    { processor: 'Intel Core i5', generation: '10th Gen', ram:'8GB', storage:'512GB SSD', basePrice:32000 },
    { processor: 'Intel Core i5', generation: '11th Gen', ram:'16GB', storage:'512GB SSD', basePrice:38000 },
    { processor: 'Intel Core i7', generation: '9th Gen', ram:'16GB', storage:'1TB HDD', basePrice:38000 },
    { processor: 'Intel Core i7', generation: '10th Gen', ram:'16GB', storage:'512GB SSD', basePrice:45000 },
    { processor: 'Intel Core i7', generation: '11th Gen', ram:'16GB', storage:'1TB SSD', basePrice:52000 },
    { processor: 'Intel Core i7', generation: '12th Gen', ram:'32GB', storage:'1TB SSD', basePrice:65000 },
    // AMD variants (as seen in screenshot)
    { processor: 'AMD Ryzen 3', generation: '5th Gen', ram:'8GB', storage:'256GB SSD', basePrice:20000 },
    { processor: 'AMD Ryzen 3', generation: '5th Gen', ram:'8GB', storage:'512GB SSD', basePrice:24000 },
    { processor: 'AMD Ryzen 5', generation: '5000 Series', ram:'8GB', storage:'512GB SSD', basePrice:30000 },
    { processor: 'AMD Ryzen 5', generation: '5000 Series', ram:'16GB', storage:'512GB SSD', basePrice:35000 },
    { processor: 'AMD Ryzen 7', generation: '7000 Series', ram:'16GB', storage:'512GB SSD', basePrice:42000 },
    { processor: 'AMD Ryzen 7', generation: '7000 Series', ram:'32GB', storage:'1TB SSD', basePrice:55000 },
  ], 'NVIDIA GTX 1660 Ti', true),
  mk('Mid-range', 'Intel Core Ultra 7', 'Ultra Gen', '', false, 'Acer Swift 14 AI (2024)', 'acer-swift-14-ai-2024', [
    { ram:'16GB', storage:'512GB SSD', basePrice:52000 }, { ram:'32GB', storage:'1TB SSD', basePrice:65000 },
  ]),
  mk('Budget', 'Intel Core i5', '12th Gen', '', false, 'Acer Aspire 5 (2024)', 'acer-aspire-5-2024', [
    { ram:'8GB', storage:'512GB SSD', basePrice:22000 }, { ram:'16GB', storage:'512GB SSD', basePrice:28000 },
    { ram:'16GB', storage:'1TB SSD', basePrice:34000 },
  ]),
  mk('Budget', 'Intel Core i3', '12th Gen', '', false, 'Acer Aspire 3 (2024)', 'acer-aspire-3-2024', [
    { ram:'8GB', storage:'256GB SSD', basePrice:15000 }, { ram:'8GB', storage:'512GB SSD', basePrice:18000 },
  ]),
  mk('Gaming', 'Intel Core i5', '13th Gen', 'NVIDIA RTX 4060', true, 'Acer Nitro V 15 (2024)', 'acer-nitro-v-15-2024', [
    { ram:'8GB', storage:'512GB SSD', basePrice:52000 }, { ram:'16GB', storage:'512GB SSD', basePrice:60000 },
    { ram:'16GB', storage:'1TB SSD', basePrice:68000 },
  ]),
  mk('Gaming', 'Intel Core i7', '13th Gen', 'NVIDIA RTX 4070', true, 'Acer Predator Helios Neo 16 (2024)', 'acer-predator-helios-neo-16-2024', [
    { ram:'16GB', storage:'512GB SSD', basePrice:88000 }, { ram:'32GB', storage:'1TB SSD', basePrice:105000 },
  ]),

  // ══ MICROSOFT ══
  mk('Premium', 'Snapdragon X Elite', '2024 Gen', '', false, 'Surface Pro 11 (M2)', 'microsoft-surface-pro-11', [
    { ram:'16GB', storage:'256GB SSD', basePrice:92000 }, { ram:'16GB', storage:'512GB SSD', basePrice:108000 },
    { ram:'32GB', storage:'512GB SSD', basePrice:125000 }, { ram:'64GB', storage:'1TB SSD', basePrice:158000 },
  ]),
  mk('Premium', 'Intel Core Ultra 5', 'Ultra Gen', '', false, 'Surface Laptop 6 (13.5-inch)', 'microsoft-surface-laptop-6-13', [
    { ram:'16GB', storage:'256GB SSD', basePrice:88000 }, { ram:'16GB', storage:'512GB SSD', basePrice:102000 },
    { ram:'32GB', storage:'1TB SSD', basePrice:128000 },
  ]),
  mk('Mid-range', 'Intel Core i5', '12th Gen', '', false, 'Surface Laptop Go 3', 'microsoft-surface-laptop-go-3', [
    { ram:'8GB', storage:'256GB SSD', basePrice:52000 }, { ram:'16GB', storage:'256GB SSD', basePrice:60000 },
    { ram:'16GB', storage:'512GB SSD', basePrice:70000 },
  ]),

  // ══ MSI ══
  mk('Gaming', 'Intel Core i9', '14th Gen', 'NVIDIA RTX 4090', true, 'MSI Titan GT77 HX', 'msi-titan-gt77-hx', [
    { ram:'32GB', storage:'1TB SSD', basePrice:298000 }, { ram:'64GB', storage:'2TB SSD', basePrice:348000 },
  ]),
  mk('Gaming', 'Intel Core i9', '14th Gen', 'NVIDIA RTX 4080', true, 'MSI Raider GE78 HX', 'msi-raider-ge78-hx', [
    { ram:'32GB', storage:'1TB SSD', basePrice:225000 }, { ram:'64GB', storage:'2TB SSD', basePrice:265000 },
  ]),
  mk('Gaming', 'Intel Core i7', '13th Gen', 'NVIDIA RTX 4060', true, 'MSI Katana 15 (2024)', 'msi-katana-15-2024', [
    { ram:'16GB', storage:'512GB SSD', basePrice:72000 }, { ram:'32GB', storage:'1TB SSD', basePrice:88000 },
  ]),
  mk('Mid-range', 'Intel Core Ultra 5', 'Ultra Gen', '', false, 'MSI Modern 14 (2024)', 'msi-modern-14-2024', [
    { ram:'16GB', storage:'512GB SSD', basePrice:45000 }, { ram:'32GB', storage:'1TB SSD', basePrice:56000 },
  ]),

  // ══ RAZER ══
  mk('Gaming', 'Intel Core i9', '14th Gen', 'NVIDIA RTX 4090', true, 'Razer Blade 16 (2024)', 'razer-blade-16-2024', [
    { ram:'32GB', storage:'1TB SSD', basePrice:320000 }, { ram:'64GB', storage:'2TB SSD', basePrice:380000 },
  ]),
  mk('Gaming', 'AMD Ryzen 9', '7000 Series', 'NVIDIA RTX 4070', true, 'Razer Blade 14 (2024)', 'razer-blade-14-2024', [
    { ram:'16GB', storage:'1TB SSD', basePrice:195000 }, { ram:'32GB', storage:'1TB SSD', basePrice:225000 },
  ]),
  mk('Premium', 'Intel Core i7', '11th Gen', '', false, 'Razer Book 13 (2023)', 'razer-book-13-2023', [
    { ram:'16GB', storage:'256GB SSD', basePrice:88000 }, { ram:'16GB', storage:'512GB SSD', basePrice:102000 },
  ]),
];

// Fix brand for all HP, Lenovo, Asus, Acer, Microsoft, MSI, Razer entries created via mk()
devices.forEach(d => {
  if (d.modelName.startsWith('HP ')) d.brand = 'HP';
  else if (d.modelName.startsWith('Lenovo ')) d.brand = 'Lenovo';
  else if (d.modelName.startsWith('Asus ')) d.brand = 'Asus';
  else if (d.modelName.startsWith('Acer ')) d.brand = 'Acer';
  else if (d.modelName.startsWith('Surface ')) d.brand = 'Microsoft';
  else if (d.modelName.startsWith('MSI ')) d.brand = 'MSI';
  else if (d.modelName.startsWith('Razer ')) d.brand = 'Razer';
});

// ─── SEED FUNCTION ────────────────────────────────────────────────────────────

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    // Only delete laptops, preserve mobile devices
    await Device.deleteMany({ category: 'laptop' });
    console.log('Cleared existing laptop devices');
    await Device.insertMany(devices);
    console.log(`✅ Seeded ${devices.length} laptop devices successfully`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();

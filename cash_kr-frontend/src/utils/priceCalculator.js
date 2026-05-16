export function calculatePrice({ 
  basePrice, 
  condition, 
  screenCondition, 
  functionalIssues = [], 
  batteryHealth = 'above80',
  accessories, 
  conditionMultipliers, 
  screenMultipliers, 
  batteryDeductions,
  functionalDeductions, 
  accessoriesBonus 
}) {
  const condMult = conditionMultipliers?.[condition] || 1;
  const screenMult = screenMultipliers?.[screenCondition] || 1;
  
  let funcDeduction = 0;
  for (const issue of functionalIssues) {
    if (functionalDeductions?.[issue]) funcDeduction += functionalDeductions[issue];
  }

  const batteryDeduction = batteryDeductions?.[batteryHealth] || 0;
  const accBonus = accessoriesBonus?.[accessories] || 0;
  
  const raw = (basePrice * condMult * screenMult) - funcDeduction - batteryDeduction + accBonus;
  const finalPrice = Math.round(raw / 100) * 100;
  
  return {
    basePrice,
    conditionAdjustment: Math.round(basePrice * condMult - basePrice),
    screenAdjustment: Math.round(basePrice * condMult * screenMult - basePrice * condMult),
    functionalDeduction: -funcDeduction,
    batteryDeduction: -batteryDeduction,
    accessoriesBonus: accBonus,
    finalPrice: Math.max(finalPrice, 0),
  };
}

export function calculateLaptopPrice(device, selections) {
  const { ram, storage, yearBracket, condition, screenCondition, 
          functionalIssues = [], accessories } = selections;
  
  let variant = device.variants.find(v => 
    v.ram === ram && 
    v.storage === storage &&
    (!selections.processor || v.processor === selections.processor) &&
    (!selections.generation || v.generation === selections.generation)
  );

  let basePrice = 0;

  if (variant) {
    basePrice = variant.basePrice;
  } else {
    // Fallback: Use the first variant as baseline and adjust
    const baseline = device.variants[0];
    basePrice = baseline.basePrice;
    
    // Simple RAM Adjustment
    const ramVal = (r) => parseInt(r) || 8;
    basePrice += (ramVal(ram) - ramVal(baseline.ram)) * 200; // ~200 per GB diff

    // Robust Storage Adjustment
    const parseStorage = (s) => {
      if (!s) return 0;
      let totalGB = 0;
      // Handle dual drives like "1 TB HDD + 128 GB SSD"
      const parts = s.split('+');
      parts.forEach(p => {
        const val = parseInt(p.trim()) || 0;
        const isTB = p.toUpperCase().includes('TB');
        totalGB += isTB ? val * 1024 : val;
      });
      return totalGB;
    };

    const baselineGB = parseStorage(baseline.storage);
    const selectedGB = parseStorage(storage);
    
    // Add value for more storage, subtract for less
    basePrice += (selectedGB - baselineGB) * 5; // ~5 per GB diff (approximate)

    // Extra penalty if the main drive is HDD instead of SSD
    if (storage.includes('HDD') && !baseline.storage.includes('HDD')) {
      basePrice -= 1500;
    }
  }
  
  const ageMult = device.ageMultipliers?.[yearBracket] || 1;
  const condMult = device.conditionMultipliers?.[condition] || 1;
  const screenMult = device.screenMultipliers?.[screenCondition] || 1;
  const sizeMult = device.screenSizeMultipliers?.[selections.screenSize] || 1;
  
  const ageAdj   = Math.round(basePrice * ageMult) - basePrice;
  const condBase = Math.round(basePrice * ageMult);
  const condAdj  = Math.round(condBase * condMult) - condBase;
  const screenBase = condBase + condAdj;
  const screenAdj  = Math.round(screenBase * screenMult) - screenBase;
  
  const deductionTotal = (functionalIssues || [])
    .filter(i => i !== 'noIssues')
    .reduce((sum, issue) => sum + (device.functionalDeductions?.[issue] || 0), 0);
  
  // New Bonuses
  const gpuBonus = device.dedicatedGpuBonus?.[selections.gpuModel] || 0;
  
  const accList = Array.isArray(accessories) ? accessories : [];
  const accBonus = accList.reduce((sum, item) => sum + (device.accessoriesBonus?.[item] || 0), 0);
  
  const rawFinal = (screenBase + screenAdj) * sizeMult - deductionTotal + gpuBonus + accBonus;
  const finalPrice = Math.max(Math.round(rawFinal / 100) * 100, 0);
  
  return {
    basePrice,
    ageAdjustment: ageAdj,
    conditionAdjustment: condAdj,
    screenAdjustment: screenAdj,
    functionalDeduction: -deductionTotal,
    accessoriesBonus: accBonus,
    finalPrice,
  };
}

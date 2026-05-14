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

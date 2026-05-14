import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deviceService } from '../services/device.service';
import { useQuote } from '../hooks/useQuote';
import { useAuth } from '../hooks/useAuth';
import { calculatePrice } from '../utils/priceCalculator';
import { formatCurrency } from '../utils/formatCurrency';
import Badge from '../components/ui/Badge';
import Loader from '../components/ui/Loader';

// --- Icons & Assets (Matching Screenshots) ---
const IconTrend = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
);

const STEPS = [
  { id: 'warranty', label: 'Warranty' },
  { id: 'screen', label: 'Screen' },
  { id: 'body', label: 'Body' },
  { id: 'functional', label: 'Functional' },
  { id: 'accessories', label: 'Accessories' }
];

const AGE_OPTIONS = [
  '0 - 3 Months', '3 - 6 Months', '6 - 11 Months', 'Above 11 Months'
];

export default function ConditionQuizPage() {
  const { brand, slug } = useParams();
  const navigate = useNavigate();
  const { updateQuote } = useQuote();
  const { isAuthenticated, user } = useAuth();

  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  // Selections (matching new requirements)
  const [deviceAge, setDeviceAge] = useState('3 - 6 Months');
  const [hasScreenIssue, setHasScreenIssue] = useState(null);
  const [showScreenModal, setShowScreenModal] = useState(false);
  const [screenIssues, setScreenIssues] = useState([]);
  
  const [hasBodyIssue, setHasBodyIssue] = useState(null);
  const [showBodyModal, setShowBodyModal] = useState(false);
  const [bodyCondition, setBodyCondition] = useState(null);

  const [hasOtherIssues, setHasOtherIssues] = useState(null);
  const [showOtherModal, setShowOtherModal] = useState(false);
  const [otherIssues, setOtherIssues] = useState([]);

  const [showAccessoriesModal, setShowAccessoriesModal] = useState(false);
  const [selectedAccessories, setSelectedAccessories] = useState([]);

  const [showResult, setShowResult] = useState(false);
  const [priceAnimating, setPriceAnimating] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [breakdown, setBreakdown] = useState(null);

  useEffect(() => {
    deviceService.getDevice(slug).then(res => {
      setDevice(res.data);
      setLoading(false);
      setCurrentPrice(res.data.variants[0].basePrice);
    }).catch(() => setLoading(false));
  }, [slug]);

  // Recalculate price on selection change
  const [batteryHealth, setBatteryHealth] = useState('above80');

  useEffect(() => {
    if (!device) return;
    const variant = device.variants[0]; // For now using first variant
    
    // Map UI selections to price calculator keys
    const result = calculatePrice({
      basePrice: variant.basePrice,
      condition: bodyCondition === 'Good' ? 'good' : (bodyCondition === 'Average' ? 'fair' : 'poor'),
      screenCondition: hasScreenIssue ? 'crackedWorks' : 'noScratch',
      functionalIssues: otherIssues,
      batteryHealth,
      accessories: selectedAccessories.length === 3 ? 'fullKit' : (selectedAccessories.includes('Box') ? 'boxOnly' : 'none'),
      conditionMultipliers: device.conditionMultipliers,
      screenMultipliers: device.screenMultipliers,
      batteryDeductions: device.batteryDeductions,
      functionalDeductions: device.functionalDeductions,
      accessoriesBonus: device.accessoriesBonus,
    });

    setPriceAnimating(true);
    setTimeout(() => setPriceAnimating(false), 400);
    setCurrentPrice(result.finalPrice);
    setBreakdown(result);
  }, [device, bodyCondition, hasScreenIssue, otherIssues, selectedAccessories]);

  const handleGetBestPrice = () => {
    updateQuote({
      device: { 
        brand: device.brand, 
        modelName: device.modelName, 
        slug: device.slug,
        storage: device.variants[0].storage,
        deviceAge: deviceAge,
        hasScreenIssue: hasScreenIssue,
        screenIssues: screenIssues,
        hasBodyIssue: hasBodyIssue,
        bodyCondition: bodyCondition,
        hasOtherIssues: hasOtherIssues,
        functionalIssues: otherIssues,
        accessories: selectedAccessories,
      },
      priceBreakdown: breakdown,
    });
    setShowResult(true);
  };

  const handleSchedulePickup = () => {
    if (!isAuthenticated) {
      navigate('/login?returnUrl=/schedule-pickup');
    } else {
      navigate('/schedule-pickup');
    }
  };

  if (loading) return <Loader />;
  if (!device) return <div className="text-center py-20 text-gray-500">Device not found</div>;

  // --- RESULT VIEW ---
  if (showResult) {
    return (
      <div className="bg-[#F9FAFB] min-h-screen py-10 sm:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Progress */}
          <div className="flex items-center justify-end gap-12 mb-10 text-sm font-bold">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#16A34A] text-white flex items-center justify-center">1</span>
              <span className="text-[#111827]">Payment</span>
            </div>
            <div className="flex items-center gap-3 opacity-30">
              <span className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center">2</span>
              <span className="text-gray-500">Pickup</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1 space-y-8">
              {/* Offer Card */}
              <div className="bg-white rounded-[40px] border border-gray-100 p-8 sm:p-12 shadow-sm relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center gap-10">
                  <div className="w-40 h-40 bg-gray-50 rounded-[32px] flex items-center justify-center p-6">
                    <img 
                      src={device.variants[0].image || "https://img.freepik.com/free-photo/mobile-phone-with-blank-screen_23-2148151433.jpg"} 
                      alt={device.modelName}
                      className="max-h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <span className="text-[#16A34A] text-sm font-black uppercase tracking-wider mb-2 block">Offer ready — instant payout</span>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#111827] mb-4">
                      {device.modelName} ({device.variants[0].storage})
                    </h1>
                    <div className="flex items-center justify-center sm:justify-start gap-4 mb-6">
                      <span className="text-5xl font-black text-[#111827]">{formatCurrency(currentPrice)}</span>
                      <div className="flex items-center gap-1.5 bg-[#F0FDF4] text-[#16A34A] px-3 py-1.5 rounded-xl border border-[#16A34A]/10">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                        <span className="text-xs font-black uppercase tracking-wider">Guaranteed</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowResult(false)}
                      className="text-[#16A34A] font-black text-sm underline underline-offset-8 hover:text-[#15803D] transition-all"
                    >
                      Recalculate
                    </button>
                  </div>
                </div>

                <div className="mt-12 space-y-4 pt-10 border-t border-gray-50">
                  <label className="flex items-start gap-4 cursor-pointer group">
                    <div className="relative mt-1">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-6 h-6 border-2 border-gray-200 rounded-lg peer-checked:bg-[#16A34A] peer-checked:border-[#16A34A] transition-all" />
                      <svg className="absolute top-1 left-1 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <span className="text-sm font-medium text-gray-500 leading-relaxed group-hover:text-[#111827] transition-colors">
                      Receive updates via Whatsapp (+91 {user?.phone || '9076116803'})
                    </span>
                  </label>
                  <label className="flex items-start gap-4 cursor-pointer group">
                    <div className="relative mt-1">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-6 h-6 border-2 border-gray-200 rounded-lg peer-checked:bg-[#16A34A] peer-checked:border-[#16A34A] transition-all" />
                      <svg className="absolute top-1 left-1 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <span className="text-sm font-medium text-gray-500 leading-relaxed group-hover:text-[#111827] transition-colors">
                      I agree to the <span className="text-[#16A34A] font-bold">terms and conditions</span> of the service and understand that the final value of {formatCurrency(currentPrice)} is subject to physical device inspection by our technician at the time of pickup.
                    </span>
                  </label>
                </div>

                <button 
                  onClick={handleSchedulePickup}
                  className="w-full mt-10 bg-[#16A34A] text-white font-black py-6 rounded-3xl hover:bg-[#15803D] transition-all shadow-xl shadow-green-100 text-lg flex items-center justify-center gap-2 group"
                >
                  Get My {formatCurrency(currentPrice)} Now
                  <svg className="transition-transform group-hover:translate-x-1" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>

                <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-4 text-[13px] font-bold text-gray-400">
                  <span className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" /> Free doorstep pickup
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" /> Instant payment at pickup
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" /> Price locked for 24h
                  </span>
                </div>
              </div>

              {/* Device Evaluation Summary */}
              <div className="bg-white rounded-[40px] border border-gray-100 p-10 shadow-sm">
                <h3 className="text-2xl font-black text-[#111827] mb-10">Device Evaluation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  <EvaluationRow label="Device Age" value={deviceAge} color="#16A34A" />
                  <EvaluationRow label="Screen Condition" value={hasScreenIssue ? screenIssues.join(', ') : 'No Issues'} color={hasScreenIssue ? '#EF4444' : '#16A34A'} />
                  <EvaluationRow label="Body Condition" value={bodyCondition} color={bodyCondition === 'Good' ? '#16A34A' : '#EF4444'} />
                  <EvaluationRow label="Functional Issues" value={otherIssues.length > 0 ? otherIssues.join(', ') : 'No Issues'} color={otherIssues.length > 0 ? '#EF4444' : '#16A34A'} />
                  <EvaluationRow label="Power Issue" value="Powers On" color="#16A34A" />
                </div>
              </div>
            </div>

            {/* Sidebars */}
            <div className="w-full lg:w-96 space-y-6">
              {/* Payment Summary */}
              <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-[#F0FDF4] rounded-xl flex items-center justify-center text-[#16A34A]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                  </div>
                  <h3 className="text-xl font-black text-[#111827]">Payment Summary</h3>
                </div>
                <div className="space-y-6">
                  <PriceRow label="Base Price" value={breakdown?.basePrice} />
                  <PriceRow label="Pickup Fee" value={0} originalValue={100} isFree />
                  <PriceRow label="Processing Fee" value={0} originalValue={100} />
                  <PriceRow label="Promo Code" value={0} isBonus />
                  <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-lg font-black text-[#111827]">Final Offer</span>
                    <span className="text-2xl font-black text-[#111827]">{formatCurrency(currentPrice)}</span>
                  </div>
                </div>
              </div>

              {/* Apply Coupon */}
              <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-[#F0FDF4] rounded-xl flex items-center justify-center text-[#16A34A]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 5V7M15 11V13M15 17V19M5 5C3.34315 5 2 6.34315 2 8V10C3.10457 10 4 10.8954 4 12C4 13.1046 3.10457 14 2 14V16C2 17.6569 3.34315 19 5 19H19C20.6569 19 22 17.6569 22 16V14C20.8954 14 20 13.1046 20 12C20 10.8954 20.8954 10 22 10V8C22 6.34315 20.6569 5 19 5H5Z"/></svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#111827]">Apply Coupon</h3>
                    <p className="text-xs text-gray-400 font-bold mt-0.5">View exciting offers</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100 mb-6">
                  <p className="text-sm font-bold text-gray-500">No coupons available at the moment.</p>
                </div>

                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Type coupon code here" 
                    className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold focus:outline-none focus:border-[#16A34A] transition-all"
                  />
                  <button className="bg-gray-100 text-gray-400 px-6 py-3.5 rounded-xl font-black text-sm cursor-not-allowed">
                    Apply
                  </button>
                </div>
              </div>

              {/* Cancellation Policy */}
              <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-[#16A34A]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z"/></svg>
                  </div>
                  <h3 className="text-lg font-black text-[#111827]">Cancellation Policy</h3>
                </div>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  You can cancel your order anytime before the pickup is completed. Once the device is picked up and verified, the order cannot be cancelled. For any help, reach out to our support team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- QUIZ VIEW ---
  return (
    <div className="bg-[#F9FAFB] min-h-screen py-10 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* LEFT COLUMN: Quiz Content */}
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
            
            {/* Device Header */}
            <div className="p-8 flex items-center gap-6 border-b border-gray-50">
              <div className="w-20 h-24 bg-gray-50 rounded-2xl flex items-center justify-center p-2">
                <img src={device.imageUrl || '/placeholder-phone.png'} alt={device.modelName} className="h-full object-contain" />
              </div>
              <div>
                <p className="text-[#16A34A] text-xs font-bold uppercase tracking-wider mb-1">Evaluating</p>
                <h1 className="text-2xl font-black text-[#111827]">
                  {device.modelName} <span className="text-gray-400 font-medium">({device.variants[0].storage} / {device.variants[0].ram || '8 GB'})</span>
                </h1>
              </div>
            </div>

            {/* Sub-Stepper */}
            <div className="px-8 py-4">
              <div className="flex items-center gap-2 mb-4">
                {STEPS.map((s, idx) => (
                  <div key={s.id} className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${idx === currentStepIndex ? 'text-[#111827]' : 'text-gray-400'}`}>
                      {s.label}
                    </span>
                    {idx < STEPS.length - 1 && <span className="text-gray-300 text-xs font-bold">&gt;</span>}
                  </div>
                ))}
              </div>
              {/* Progress Bar */}
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#16A34A] transition-all duration-500" 
                  style={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Questions Area */}
            <div className="p-10 space-y-12 min-h-[400px]">
              
              {/* Question 1: Device Age */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-[#111827]">1. How old is your device?</h3>
                  <p className="text-sm text-gray-500 mt-1 font-medium">Choose the closest option.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {AGE_OPTIONS.map(age => (
                    <button
                      key={age}
                      onClick={() => setDeviceAge(age)}
                      className={`py-4 rounded-xl border-2 font-bold text-sm transition-all
                        ${deviceAge === age 
                          ? 'border-[#16A34A] bg-[#F0FDF4] text-[#16A34A]' 
                          : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: Screen Issue Toggle */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-[#111827]">2. Is there any screen issue?</h3>
                  <p className="text-sm text-gray-500 mt-1 font-medium">Cracks, scratches, touch problems, lines, spots, dead pixels.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => { setHasScreenIssue(true); setShowScreenModal(true); }}
                    className={`py-4 rounded-xl border-2 font-bold text-sm flex items-center justify-center gap-2 transition-all
                      ${hasScreenIssue === true 
                        ? 'border-[#16A34A] bg-[#F0FDF4] text-[#16A34A]' 
                        : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}
                  >
                    {hasScreenIssue === true && <span className="text-lg">✓</span>} Yes
                  </button>
                  <button
                    onClick={() => { setHasScreenIssue(false); setScreenIssues([]); }}
                    className={`py-4 rounded-xl border-2 font-bold text-sm flex items-center justify-center gap-2 transition-all
                      ${hasScreenIssue === false 
                        ? 'border-[#16A34A] bg-[#F0FDF4] text-[#16A34A]' 
                        : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}
                  >
                    {hasScreenIssue === false && <span className="text-lg">×</span>} No
                  </button>
                </div>
              </div>

              {/* Question 3: Body Damage */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-[#111827]">3. Any body damage?</h3>
                  <p className="text-sm text-gray-500 mt-1 font-medium">Dents, deep scratches, loose frame, heavy wear.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => { setHasBodyIssue(true); setShowBodyModal(true); }}
                    className={`py-4 rounded-xl border-2 font-bold text-sm flex items-center justify-center gap-2 transition-all
                      ${hasBodyIssue === true 
                        ? 'border-[#16A34A] bg-[#F0FDF4] text-[#16A34A]' 
                        : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}
                  >
                    {hasBodyIssue === true && <span className="text-lg">✓</span>} Yes
                  </button>
                  <button
                    onClick={() => { setHasBodyIssue(false); setBodyCondition('Good'); }}
                    className={`py-4 rounded-xl border-2 font-bold text-sm flex items-center justify-center gap-2 transition-all
                      ${hasBodyIssue === false 
                        ? 'border-[#16A34A] bg-[#F0FDF4] text-[#16A34A]' 
                        : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}
                  >
                    {hasBodyIssue === false && <span className="text-lg">×</span>} No
                  </button>
                </div>
              </div>

              {/* Question 4: Other Problems */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-[#111827]">4. Any other problems?</h3>
                  <p className="text-sm text-gray-500 mt-1 font-medium">Buttons, speaker, mic, camera, charging, Wi-Fi, battery, Face ID/Touch ID, broken back, etc.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => { setHasOtherIssues(true); setShowOtherModal(true); }}
                    className={`py-4 rounded-xl border-2 font-bold text-sm flex items-center justify-center gap-2 transition-all
                      ${hasOtherIssues === true 
                        ? 'border-[#16A34A] bg-[#F0FDF4] text-[#16A34A]' 
                        : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}
                  >
                    {hasOtherIssues === true && <span className="text-lg">✓</span>} Yes
                  </button>
                  <button
                    onClick={() => { setHasOtherIssues(false); setOtherIssues([]); }}
                    className={`py-4 rounded-xl border-2 font-bold text-sm flex items-center justify-center gap-2 transition-all
                      ${hasOtherIssues === false 
                        ? 'border-[#16A34A] bg-[#F0FDF4] text-[#16A34A]' 
                        : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}
                  >
                    {hasOtherIssues === false && <span className="text-lg">×</span>} No
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar Evaluation */}
        <div className="w-full lg:w-[400px]">
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8 sticky top-10">
            <h2 className="text-2xl font-black text-[#111827] mb-8">Device Evaluation</h2>
            
            {/* Price Box */}
            <div className="bg-[#F0FDF4] rounded-3xl p-6 mb-8 flex items-center justify-between border border-[#16A34A]/10">
              <div>
                <p className="text-[#16A34A] text-xs font-bold uppercase tracking-widest mb-1">Estimated Value</p>
                <p className="text-3xl font-black text-[#166534]">{formatCurrency(currentPrice)}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#16A34A] shadow-sm">
                <IconTrend />
              </div>
            </div>

            {/* Summary List */}
            <div className="space-y-6">
              <SummaryItem label="Device Age" value={deviceAge} active />
              <SummaryItem label="Screen Condition" value={hasScreenIssue === null ? 'Not answered' : (hasScreenIssue ? 'Issues detected' : 'No Issues')} active={hasScreenIssue !== null} />
              <SummaryItem label="Body Condition" value={hasBodyIssue === null ? 'Not answered' : (bodyCondition || 'No Issues')} active={hasBodyIssue !== null} />
              <SummaryItem label="Functional Issues" value={hasOtherIssues === null ? 'Not answered' : (otherIssues.length > 0 ? `${otherIssues.length} issues` : 'No Issues')} active={hasOtherIssues !== null} />
              <SummaryItem label="Accessories" value={selectedAccessories.length > 0 ? selectedAccessories.join(', ') : 'Not selected'} active={selectedAccessories.length > 0} />
              <SummaryItem label="Power Issue" value="Powers On" active />
            </div>

            <button 
              onClick={() => setShowAccessoriesModal(true)}
              disabled={hasOtherIssues === null}
              className="w-full mt-12 bg-[#16A34A] text-white font-black py-5 rounded-2xl shadow-xl shadow-green-100 hover:bg-[#15803D] transition-all disabled:opacity-50 disabled:shadow-none"
            >
              Continue Next →
            </button>
          </div>
        </div>
      </div>

      {/* Screen Issues Modal */}
      {showScreenModal && (
        <ScreenIssueModal 
          onClose={() => setShowScreenModal(false)} 
          selectedIssues={screenIssues}
          onToggle={(issue) => {
            setScreenIssues(prev => 
              prev.includes(issue) ? prev.filter(i => i !== issue) : [...prev, issue]
            );
          }}
          onSave={() => setShowScreenModal(false)}
        />
      )}

      {/* Body Issues Modal */}
      {showBodyModal && (
        <BodyConditionModal 
          onClose={() => setShowBodyModal(false)} 
          selectedCondition={bodyCondition}
          onSelect={(condition) => { setBodyCondition(condition); setShowBodyModal(false); }}
        />
      )}

      {/* Other Problems Modal */}
      {showOtherModal && (
        <OtherProblemsModal 
          onClose={() => setShowOtherModal(false)} 
          selectedIssues={otherIssues}
          onToggle={(issue) => {
            setOtherIssues(prev => 
              prev.includes(issue) ? prev.filter(i => i !== issue) : [...prev, issue]
            );
          }}
          onSave={() => setShowOtherModal(false)}
        />
      )}

      {/* Accessories Modal */}
      {showAccessoriesModal && (
        <AccessoriesModal 
          onClose={() => setShowAccessoriesModal(false)} 
          selectedAccessories={selectedAccessories}
          onToggle={(acc) => {
            setSelectedAccessories(prev => 
              prev.includes(acc) ? prev.filter(a => a !== acc) : [...prev, acc]
            );
          }}
          onConfirm={handleGetBestPrice}
        />
      )}
    </div>
  );
}

function AccessoriesModal({ onClose, selectedAccessories, onToggle, onConfirm }) {
  const accessories = [
    { id: 'Bill', label: 'Bill', icon: '📄' },
    { id: 'Box', label: 'Box', icon: '📦' },
    { id: 'Charger', label: 'Charger', icon: '🔌' },
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-4xl rounded-[40px] shadow-2xl p-10">
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-gray-600">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        <h2 className="text-3xl font-black text-[#111827] mb-2">Accessories</h2>
        <p className="text-gray-500 font-medium mb-10">Select accessories you have</p>

        <div className="grid grid-cols-3 gap-6 mb-12">
          {accessories.map(acc => (
            <button
              key={acc.id}
              onClick={() => onToggle(acc.id)}
              className={`p-10 rounded-[32px] border-2 flex flex-col items-center gap-6 transition-all group
                ${selectedAccessories.includes(acc.id) 
                  ? 'border-[#16A34A] bg-[#F0FDF4] text-[#16A34A]' 
                  : 'border-gray-50 bg-white text-gray-500 hover:border-gray-100'}`}
            >
              <div className={`w-24 h-24 rounded-3xl flex items-center justify-center text-4xl transition-transform group-hover:scale-110
                ${selectedAccessories.includes(acc.id) ? 'bg-white' : 'bg-gray-50'}`}>
                {acc.icon}
              </div>
              <span className="text-lg font-black flex items-center gap-2">
                {acc.label}
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                  ${selectedAccessories.includes(acc.id) ? 'border-[#16A34A] bg-[#16A34A]' : 'border-gray-200'}`}>
                  {selectedAccessories.includes(acc.id) && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>}
                </div>
              </span>
            </button>
          ))}
        </div>

        <button 
          onClick={onConfirm}
          className="w-full bg-[#16A34A] text-white font-black py-5 rounded-2xl shadow-xl shadow-green-100 hover:bg-[#15803D] flex items-center justify-center gap-3 transition-all"
        >
          GET BEST PRICE <span className="text-xl">›</span>
        </button>
      </div>
    </div>
  );
}

function SummaryItem({ label, value, active }) {
  return (
    <div className="space-y-1">
      <h4 className="text-sm font-bold text-[#111827]">{label}</h4>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${active ? 'bg-[#16A34A]' : 'bg-gray-200'}`} />
        <p className={`text-[13px] font-medium ${active ? 'text-gray-600' : 'text-gray-400'}`}>{value}</p>
      </div>
    </div>
  );
}

function ScreenIssueModal({ onClose, selectedIssues, onToggle, onSave }) {
  const issues = [
    { title: "Scratches On Screen", desc: "Visible Scratches on the screen" },
    { title: "Cracked Screen", points: ['Only Screen Cracked', 'No Display Broken'] },
    { title: "Faulty Screen", points: ['1 or 2 lines/small spots', 'small Patch of Light Screen'] },
    { title: "Screen Not Usable", points: ['Blank/Broken Screen', 'Touch not working', 'Multiples lines, Spots, Patches'] },
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-4xl rounded-[40px] shadow-2xl p-10 max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-gray-600">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        <h2 className="text-3xl font-black text-[#111827] mb-2">Screen Issues</h2>
        <p className="text-gray-500 font-medium mb-10">Cracks, scratches, touch problems, lines, spots, dead pixels.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {issues.map(issue => (
            <ScreenIssueCard 
              key={issue.title}
              title={issue.title} 
              desc={issue.desc}
              points={issue.points}
              selected={selectedIssues.includes(issue.title)}
              onClick={() => onToggle(issue.title)}
            />
          ))}
        </div>

        <div className="mt-10 flex justify-end">
          <button 
            onClick={onSave}
            className="bg-[#16A34A] text-white font-black px-12 py-4 rounded-2xl hover:bg-[#15803D] transition-all shadow-lg shadow-green-100"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

function BodyConditionModal({ onClose, selectedCondition, onSelect }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-4xl rounded-[40px] shadow-2xl p-10 max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-gray-600">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        <h2 className="text-3xl font-black text-[#111827] mb-2">Body Condition</h2>
        <p className="text-gray-500 font-medium mb-10">Dents, deep scratches, loose frame, heavy wear.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ScreenIssueCard 
            title="Good" 
            points={['Minor scratches', 'Light wear and tear', 'No major dents or damage']} 
            selected={selectedCondition === 'Good'}
            onClick={() => onSelect('Good')}
          />
          <ScreenIssueCard 
            title="Average" 
            points={['Visible scratches on body', 'Minor dents possible', 'Signs of normal wear and tear']} 
            selected={selectedCondition === 'Average'}
            onClick={() => onSelect('Average')}
          />
          <ScreenIssueCard 
            title="Below Average" 
            points={['Deep scratches', 'Multiple dents or cracks', 'Heavy wear and tear']} 
            selected={selectedCondition === 'Below Average'}
            onClick={() => onSelect('Below Average')}
          />
        </div>
      </div>
    </div>
  );
}

const OTHER_ISSUES_DATA = {
  'Physical Issues': [
    { id: 'back_glass', label: 'Back Glass Broken', icon: '📱' },
    { id: 'buttons', label: 'Physical Button', icon: '🔘' },
    { id: 'display_changed', label: 'Display Changed', icon: '📲' },
    { id: 'bend', label: 'Bend Device', icon: '〰️' },
  ],
  'Technical Issues': [
    { id: 'biometricIssue', label: 'Face ID / Fingerprint Problem', icon: '👤' },
    { id: 'restart', label: 'Restart Problem', icon: '🔄' },
    { id: 'sensors', label: 'Sensors Problem', icon: '📡' },
    { id: 'front_camera', label: 'Front Camera', icon: '📸' },
    { id: 'back_camera', label: 'Back Camera', icon: '📷' },
    { id: 'mic', label: 'Microphone Problem', icon: '🎤' },
    { id: 'speaker', label: 'Speaker Problem', icon: '🔊' },
    { id: 'fingerprint', label: 'Fingerprint Problem', icon: '☝️' },
    { id: 'bluetooth', label: 'Bluetooth', icon: '🦷' },
    { id: 'wifi', label: 'Wifi Problem', icon: '📶' },
    { id: 'network', label: 'Network Problem', icon: '📡' },
    { id: 'vibration', label: 'Vibration Problem', icon: '📳' },
    { id: 'charging', label: 'Charging Problem', icon: '🔌' },
    { id: 'batteryLow', label: 'Battery/Service Problem', icon: '🔋' },
    { id: 'motherboard', label: 'Motherboard Problem', icon: '🗂️' },
  ]
};

function OtherProblemsModal({ onClose, selectedIssues, onToggle, onSave }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-5xl rounded-[40px] shadow-2xl p-10 max-h-[90vh] flex flex-col">
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-gray-600">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        <h2 className="text-3xl font-black text-[#111827] mb-8">Select Issues</h2>

        <div className="flex-1 overflow-y-auto pr-4 space-y-10">
          {Object.entries(OTHER_ISSUES_DATA).map(([category, issues]) => (
            <div key={category} className="space-y-6">
              <h3 className="text-xl font-bold text-[#111827]">{category}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {issues.map(issue => (
                  <button
                    key={issue.id}
                    onClick={() => onToggle(issue.id)}
                    className={`p-6 rounded-3xl border-2 flex flex-col items-center gap-4 transition-all
                      ${selectedIssues.includes(issue.id) 
                        ? 'border-[#16A34A] bg-[#F0FDF4] text-[#16A34A]' 
                        : 'border-gray-50 bg-white text-gray-500 hover:border-gray-100'}`}
                  >
                    <span className="text-3xl">{issue.icon}</span>
                    <span className="text-sm font-bold text-center">{issue.label}</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-auto
                      ${selectedIssues.includes(issue.id) ? 'border-[#16A34A] bg-[#16A34A]' : 'border-gray-200'}`}>
                      {selectedIssues.includes(issue.id) && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-gray-50 flex justify-end">
          <button 
            onClick={onSave}
            className="bg-[#16A34A] text-white font-black px-12 py-4 rounded-2xl hover:bg-[#15803D] transition-all shadow-lg shadow-green-100"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
}

function ScreenIssueCard({ title, desc, points, selected, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`border-2 rounded-3xl p-6 flex justify-between group transition-all cursor-pointer
        ${selected 
          ? 'border-[#16A34A] bg-[#F0FDF4]' 
          : 'border-gray-100 bg-white hover:border-[#16A34A]/20 hover:bg-[#F9FAFB]/50'}`}
    >
      <div className="space-y-3">
        <h4 className={`text-lg font-black transition-colors ${selected ? 'text-[#166534]' : 'text-[#111827]'}`}>{title}</h4>
        {desc && <p className={`text-sm font-medium transition-colors ${selected ? 'text-[#166534]/80' : 'text-gray-500'}`}>{desc}</p>}
        {points && (
          <ul className="space-y-2">
            {points.map(p => (
              <li key={p} className={`flex items-center gap-2 text-sm font-medium transition-colors ${selected ? 'text-[#166534]/80' : 'text-gray-500'}`}>
                <span className={`w-1 h-1 rounded-full ${selected ? 'bg-[#16A34A]' : 'bg-gray-300'}`} /> {p}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className={`w-24 h-32 rounded-xl flex items-center justify-center p-2 transition-colors
        ${selected ? 'bg-white' : 'bg-gray-50 group-hover:bg-white'}`}>
        <div className={`w-12 h-20 border-2 rounded-lg relative overflow-hidden transition-colors
          ${selected ? 'border-[#16A34A]' : 'border-gray-300'}`}>
          <div className={`absolute top-1 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full transition-colors ${selected ? 'bg-[#16A34A]/20' : 'bg-gray-200'}`} />
          {title.includes('Cracked') && <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cracked-glass.png')] opacity-30" />}
          {title.includes('Broken') && <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cracked-glass.png')] opacity-30" />}
          {title.includes('Scratches') && <div className="absolute top-1/2 left-4 w-6 h-px bg-gray-300 rotate-45" />}
          {selected && (
             <div className="absolute bottom-2 right-2 w-4 h-4 bg-[#16A34A] rounded-full flex items-center justify-center">
               <svg width="8" height="8" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="3" strokeLinecap="round"/></svg>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}function PriceRow({ label, value, originalValue, isFree, isBonus }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-gray-400 uppercase tracking-widest">{label}</span>
      <div className="flex items-center gap-2">
        {originalValue && <span className="text-sm text-gray-300 line-through">₹{originalValue}</span>}
        <span className={`font-black ${isFree || isBonus ? 'text-[#16A34A]' : 'text-[#111827]'}`}>
          {isFree ? 'Free' : (isBonus ? `+${formatCurrency(value)}` : formatCurrency(value))}
        </span>
      </div>
    </div>
  );
}

function EvaluationRow({ label, value, color }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</p>
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
        <span className="font-black text-[#111827]">{value || 'N/A'}</span>
      </div>
    </div>
  );
}

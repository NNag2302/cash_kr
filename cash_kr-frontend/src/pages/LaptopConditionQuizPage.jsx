import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { deviceService } from '../services/device.service';
import { useQuote } from '../hooks/useQuote';
import { useAuth } from '../hooks/useAuth';
import { calculateLaptopPrice } from '../utils/priceCalculator';
import { formatCurrency } from '../utils/formatCurrency';
import Loader from '../components/ui/Loader';
import LaptopSpecModal from '../components/LaptopSpecModal';
import Modal from '../components/ui/Modal';

const STEPS = [
  { id: 'specs', label: 'Specs' },
  { id: 'warranty', label: 'Warranty' },
  { id: 'body', label: 'Device Body' },
  { id: 'functional', label: 'Functional' },
  { id: 'touch', label: 'Touch Screen' },
  { id: 'gpu', label: 'Graphics card' },
  { id: 'screensize', label: 'Screen Size' },
  { id: 'accessories', label: 'Accessories' },
];

const AGE_OPTIONS = [
  { key: 'lessThan3', label: '0 - 3 Months' },
  { key: 'threeToEleven', label: '3 - 11 Months' },
  { key: 'aboveEleven', label: 'Above 11 Months' },
];

export default function LaptopConditionQuizPage() {
  const { brand, slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { updateQuote } = useQuote();
  const { isAuthenticated, user } = useAuth();

  const [specs, setSpecs] = useState(location.state?.specs);

  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1); 
  const [showResult, setShowResult] = useState(false);
  
  // Modals
  const [isSpecsModalOpen, setIsSpecsModalOpen] = useState(false);
  const [isBodyModalOpen, setIsBodyModalOpen] = useState(false);
  const [isIssuesModalOpen, setIsIssuesModalOpen] = useState(false);
  const [isGpuModalOpen, setIsGpuModalOpen] = useState(false);
  const [isScreenSizeModalOpen, setIsScreenSizeModalOpen] = useState(false);
  const [isAccessoriesModalOpen, setIsAccessoriesModalOpen] = useState(false);

  // Selections
  const [age, setAge] = useState(null);
  const [bodyDamage, setBodyDamage] = useState(null); 
  const [selectedCondition, setSelectedCondition] = useState('likenew'); 
  const [functionalIssues, setFunctionalIssues] = useState(null); 
  const [issuesList, setIssuesList] = useState([]);
  const [hasTouchscreen, setHasTouchscreen] = useState(null);
  const [gpuModel, setGpuModel] = useState(null);
  const [screenSize, setScreenSize] = useState(null);
  const [accessories, setAccessories] = useState([]);

  const [currentPrice, setCurrentPrice] = useState(0);
  const [breakdown, setBreakdown] = useState(null);

  useEffect(() => {
    if (!specs) {
      navigate(`/sell-old-laptops/${brand}/${slug}`, { replace: true });
      return;
    }
    deviceService.getDevice(slug).then(res => {
      setDevice(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [slug, specs, navigate, brand]);

  useEffect(() => {
    if (!device || !specs) return;
    const result = calculateLaptopPrice(device, {
      ...specs,
      yearBracket: age,
      condition: selectedCondition,
      screenCondition: 'noIssue',
      functionalIssues: issuesList,
      gpuModel,
      screenSize,
      accessories: accessories.length > 0 ? accessories : ['none']
    });
    if (result) {
      setCurrentPrice(result.finalPrice);
      setBreakdown(result);
    }
  }, [device, specs, age, selectedCondition, issuesList, gpuModel, screenSize, accessories]);

  const handleSpecsUpdate = (newSpecs) => {
    setSpecs(newSpecs);
    setIsSpecsModalOpen(false);
  };

  const handleBodyDamageSelect = (val) => {
    if (val === 'yes') setIsBodyModalOpen(true);
    else {
      setBodyDamage('no');
      setSelectedCondition('good'); 
      if (currentStep === 2) setCurrentStep(3);
    }
  };

  const handleConditionFinish = (cond) => {
    setBodyDamage('yes');
    setSelectedCondition(cond);
    setIsBodyModalOpen(false);
    if (currentStep === 2) setCurrentStep(3);
  };

  const handleBodyModalClose = () => {
    setIsBodyModalOpen(false);
    if (!selectedCondition || selectedCondition === 'likenew') {
      setBodyDamage('no');
      setSelectedCondition('good');
    }
  };

  const handleFunctionalSelect = (val) => {
    if (val === 'yes') setIsIssuesModalOpen(true);
    else {
      setFunctionalIssues('no');
      setIssuesList([]);
      if (currentStep === 3) setCurrentStep(4);
    }
  };

  const handleIssuesFinish = (list) => {
    setFunctionalIssues(list.length > 0 ? 'yes' : 'no');
    setIssuesList(list);
    setIsIssuesModalOpen(false);
    if (currentStep === 3) setCurrentStep(4);
  };

  const handleIssuesModalClose = () => {
    setIsIssuesModalOpen(false);
    if (issuesList.length === 0) setFunctionalIssues('no');
  };

  const handleGpuSelect = (val) => {
    if (val === 'yes') setIsGpuModalOpen(true);
    else {
      setGpuModel('Integrated');
      setIsScreenSizeModalOpen(true);
      if (currentStep === 5) setCurrentStep(6);
    }
  };

  const handleGpuFinish = (model) => {
    setGpuModel(model);
    setIsGpuModalOpen(false);
    setIsScreenSizeModalOpen(true);
    if (currentStep === 5) setCurrentStep(6);
  };

  const handleScreenSizeFinish = (size) => {
    setScreenSize(size);
    setIsScreenSizeModalOpen(false);
    setIsAccessoriesModalOpen(true);
    if (currentStep === 6) setCurrentStep(7);
  };

  const handleAccessoriesFinish = (list) => {
    setAccessories(list);
    setIsAccessoriesModalOpen(false);
    
    const ageLabel = AGE_OPTIONS.find(o => o.key === age)?.label || age;
    
    updateQuote({
      device: {
        ...device,
        category: 'laptop',
        brand,
        modelName: device.modelName,
        slug,
        ...specs,
        deviceAge: ageLabel,
        yearBracket: age,
        bodyCondition: selectedCondition === 'likenew' ? 'Flawless' : selectedCondition === 'good' ? 'Good' : selectedCondition === 'average' ? 'Average' : 'Below Average',
        condition: selectedCondition,
        screenCondition: 'noIssue',
        functionalIssues: issuesList,
        graphicsCard: gpuModel,
        hasDedicatedGpu: gpuModel !== 'Integrated',
        hasTouchscreen: hasTouchscreen === 'yes',
        screenSize,
        accessories: list
      },
      priceBreakdown: breakdown,
      price: currentPrice
    });
    
    setShowResult(true);
  };

  const handleSchedulePickup = () => {
    if (!isAuthenticated) navigate('/login?returnUrl=/schedule-pickup');
    else navigate('/schedule-pickup');
  };

  if (loading) return <Loader />;
  if (!device) return <div className="text-center py-20 font-black text-gray-400">Device not found</div>;

  // --- RESULT VIEW (SAME AS MOBILE FLOW) ---
  if (showResult) {
    return (
      <div className="bg-[#F9FAFB] min-h-screen py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          
          {/* Header Progress */}
          <div className="flex justify-center gap-12 border-b border-gray-100 pb-8">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#16A34A] text-white flex items-center justify-center font-black">1</span>
              <span className="text-[#111827] font-black">Offer Details</span>
            </div>
            <div className="flex items-center gap-3 opacity-30">
              <span className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-black">2</span>
              <span className="text-gray-500 font-black">Pickup & Payment</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Main Content */}
            <div className="flex-1 space-y-8">
              
              {/* Offer Card */}
              <div className="bg-white rounded-[40px] border border-gray-100 p-10 sm:p-14 shadow-sm relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center gap-12">
                  <div className="w-44 h-44 bg-gray-50 rounded-[40px] flex items-center justify-center p-8">
                    <img src={device.imageUrl} alt={device.modelName} className="max-h-full object-contain" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <span className="text-[#16A34A] text-xs font-black uppercase tracking-wider mb-2 block">Offer ready — instant payout</span>
                    <h1 className="text-xl sm:text-2xl font-black text-[#111827] mb-4">
                      {device.modelName} <span className="text-gray-400 font-medium text-sm">({specs.ram}/{specs.storage})</span>
                    </h1>
                    <div className="flex items-center justify-center sm:justify-start gap-5 mb-6">
                      <span className="text-4xl font-black text-[#111827] tracking-tighter">{formatCurrency(currentPrice)}</span>
                      <div className="flex items-center gap-2 bg-[#F0FDF4] text-[#16A34A] px-3 py-1.5 rounded-xl border border-[#16A34A]/10">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                        <span className="text-xs font-black uppercase tracking-widest">Guaranteed</span>
                      </div>
                    </div>
                    <button onClick={() => setShowResult(false)} className="text-[#16A34A] font-black text-sm underline underline-offset-8 hover:text-[#15803D] transition-all">Recalculate</button>
                  </div>
                </div>

                <div className="mt-14 space-y-6 pt-12 border-t border-gray-50">
                   <CheckboxRow label={`Receive updates via Whatsapp (+91 ${user?.phone || 'XXXXXXXXXX'})`} checked />
                   <CheckboxRow label="I agree to the terms and conditions and understand that the final value is subject to physical device inspection by our technician." checked />
                </div>

                <button 
                  onClick={handleSchedulePickup}
                  className="w-full mt-12 bg-[#16A34A] text-white font-black py-7 rounded-[32px] hover:bg-[#15803D] transition-all shadow-2xl shadow-[#16A34A]/20 text-xl flex items-center justify-center gap-3 group"
                >
                  Get My {formatCurrency(currentPrice)} Now
                  <svg className="transition-transform group-hover:translate-x-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>

                <div className="mt-10 flex flex-wrap justify-center gap-x-12 gap-y-4 text-[13px] font-black text-gray-400">
                  <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" /> Free doorstep pickup</span>
                  <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" /> Instant payment at pickup</span>
                  <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" /> Price locked for 24h</span>
                </div>
              </div>

              {/* Evaluation Detail */}
              <div className="bg-white rounded-[40px] border border-gray-100 p-12 shadow-sm">
                <h3 className="text-2xl font-black text-[#111827] mb-12">Laptop Evaluation Detail</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
                   <EvaluationDetailRow label="Device Specs" value={`${specs.processor} / ${specs.ram} / ${specs.storage}`} color="#16A34A" />
                   <EvaluationDetailRow label="Device Age" value={age ? AGE_OPTIONS.find(o => o.key === age).label : '-'} color="#16A34A" />
                   <EvaluationDetailRow label="Body Condition" value={selectedCondition.toUpperCase()} color={selectedCondition === 'likenew' ? '#16A34A' : '#EAB308'} />
                   <EvaluationDetailRow label="Functional Issues" value={issuesList.length > 0 ? issuesList.join(', ') : 'No Issues'} color={issuesList.length > 0 ? '#EF4444' : '#16A34A'} />
                   <EvaluationDetailRow label="Touch Screen" value={hasTouchscreen === 'yes' ? 'Available' : 'No'} color="#16A34A" />
                   <EvaluationDetailRow label="Graphics Card" value={gpuModel || 'Integrated'} color="#16A34A" />
                </div>
              </div>
            </div>

            {/* Sidebars */}
            <div className="w-full lg:w-[400px] space-y-8">
              <div className="bg-white rounded-[40px] border border-gray-100 p-10 shadow-sm">
                 <h3 className="text-xl font-black text-[#111827] mb-8">Offer Summary</h3>
                 <div className="space-y-6">
                    <SummaryPriceRow label="Base Price" value={breakdown?.basePrice} />
                    <SummaryPriceRow label="Pickup Fee" value={0} original={100} isFree />
                    <SummaryPriceRow label="Processing" value={0} original={150} isFree />
                    <div className="pt-8 border-t border-gray-50 flex justify-between items-center">
                      <span className="text-lg font-black text-[#111827]">Final Payout</span>
                      <span className="text-3xl font-black text-[#16A34A]">{formatCurrency(currentPrice)}</span>
                    </div>
                 </div>
              </div>

              {/* Policy */}
              <div className="bg-[#111827] rounded-[40px] p-10 text-white">
                 <h4 className="text-lg font-black mb-4">Pickup Policy</h4>
                 <p className="text-gray-400 text-sm font-bold leading-relaxed">
                   Our technician will verify the laptop at your doorstep. Please ensure the laptop is charged and all data is backed up. Payment is instant.
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
    <div className="bg-[#F9FAFB] min-h-screen py-8 px-4 sm:px-10">
      <div className="max-w-[1400px] mx-auto">
        <div className="bg-white rounded-[32px] p-8 mb-8 border border-gray-100 flex items-center gap-8 shadow-sm">
          <div className="w-24 h-24 bg-gray-50 rounded-2xl flex items-center justify-center p-3">
             <img src={device.imageUrl} alt={device.modelName} className="max-h-full object-contain" />
          </div>
          <div>
            <p className="text-[#16A34A] text-[10px] font-black uppercase tracking-widest mb-1">Evaluating</p>
            <h1 className="text-xl font-black text-[#111827]">{device.modelName}</h1>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1 space-y-8">
            <EvaluationStepCard title="1. Select Device Specs ?" active={true}>
               <button onClick={() => setIsSpecsModalOpen(true)} className="px-6 py-2 rounded-full border-[1.5px] border-gray-100 text-sm font-black text-gray-500 hover:bg-gray-50 transition-colors">Modify</button>
            </EvaluationStepCard>
            <EvaluationStepCard title="2. How old is your laptop?" active={currentStep >= 1}>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 {AGE_OPTIONS.map(opt => (
                   <button key={opt.key} onClick={() => { setAge(opt.key); if(currentStep === 1) setCurrentStep(2); }} className={`py-5 rounded-2xl border-[1.5px] font-black transition-all ${age === opt.key ? 'border-[#16A34A] bg-[#F0FDF4] text-[#16A34A]' : 'border-gray-100 text-gray-500 hover:border-gray-200'}`}>{opt.label}</button>
                 ))}
               </div>
            </EvaluationStepCard>
            <EvaluationStepCard title="3. Any body damage?" active={currentStep >= 2}>
               <div className="grid grid-cols-2 gap-4">
                 {['Yes', 'No'].map(v => (
                   <button key={v} onClick={() => handleBodyDamageSelect(v.toLowerCase())} className={`py-5 rounded-2xl border-[1.5px] font-black transition-all ${((bodyDamage === 'yes' && v === 'Yes') || (bodyDamage === 'no' && v === 'No')) ? 'border-[#16A34A] bg-[#F0FDF4] text-[#16A34A]' : 'border-gray-100 text-gray-500 hover:border-gray-200'}`}>{v}</button>
                 ))}
               </div>
            </EvaluationStepCard>
            <EvaluationStepCard title="4. Any other problems?" active={currentStep >= 3}>
               <div className="grid grid-cols-2 gap-4">
                 {['Yes', 'No'].map(v => (
                   <button key={v} onClick={() => handleFunctionalSelect(v.toLowerCase())} className={`py-5 rounded-2xl border-[1.5px] font-black transition-all ${((functionalIssues === 'yes' && v === 'Yes') || (functionalIssues === 'no' && v === 'No')) ? 'border-[#16A34A] bg-[#F0FDF4] text-[#16A34A]' : 'border-gray-100 text-gray-500 hover:border-gray-200'}`}>{v}</button>
                 ))}
               </div>
            </EvaluationStepCard>
            <EvaluationStepCard title="5. Does your laptop have a touchscreen?" active={currentStep >= 4}>
               <div className="grid grid-cols-2 gap-4">
                 {['Yes', 'No'].map(v => (
                   <button key={v} onClick={() => { setHasTouchscreen(v.toLowerCase()); if(currentStep === 4) setCurrentStep(5); }} className={`py-5 rounded-2xl border-[1.5px] font-black transition-all ${hasTouchscreen === v.toLowerCase() ? 'border-[#16A34A] bg-[#F0FDF4] text-[#16A34A]' : 'border-gray-100 text-gray-500 hover:border-gray-200'}`}>{v}</button>
                 ))}
               </div>
            </EvaluationStepCard>
            <EvaluationStepCard title="6. Have External graphics card/device ?" active={currentStep >= 5}>
               <div className="grid grid-cols-2 gap-4">
                 {['Yes', 'No'].map(v => (
                   <button key={v} onClick={() => handleGpuSelect(v.toLowerCase())} className={`py-5 rounded-2xl border-[1.5px] font-black transition-all ${((gpuModel && gpuModel !== 'Integrated' && v === 'Yes') || (gpuModel === 'Integrated' && v === 'No')) ? 'border-[#16A34A] bg-[#F0FDF4] text-[#16A34A]' : 'border-gray-100 text-gray-500 hover:border-gray-200'}`}>{v}</button>
                 ))}
               </div>
            </EvaluationStepCard>
          </div>
          <div className="w-full lg:w-[450px]">
            <div className="sticky top-8 space-y-8">
              <div className="bg-[#F0FDF4] rounded-[32px] p-8 border border-[#16A34A]/20 shadow-sm flex items-center justify-between">
                <div><p className="text-[#16A34A] text-xs font-black uppercase tracking-widest mb-1">Estimated Value</p><p className="text-4xl font-black text-[#166534] tracking-tighter">{currentPrice > 0 ? formatCurrency(currentPrice) : '₹ XX,XXX'}</p></div>
              </div>
              <div className="bg-white rounded-[32px] p-10 border border-gray-100 shadow-sm space-y-8">
                <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Summary</h4>
                <div className="space-y-5">
                   <SummaryItem label="Age" value={age ? AGE_OPTIONS.find(o => o.key === age).label : '-'} />
                   <SummaryItem label="Condition" value={selectedCondition !== 'likenew' ? selectedCondition : '-'} />
                   <SummaryItem label="Touch" value={hasTouchscreen || '-'} />
                   <SummaryItem label="GPU" value={gpuModel || '-'} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LaptopSpecModal isOpen={isSpecsModalOpen} onClose={() => setIsSpecsModalOpen(false)} device={device} onComplete={handleSpecsUpdate} initialValues={specs} />
      <BodyConditionModal isOpen={isBodyModalOpen} onClose={handleBodyModalClose} onSelect={handleConditionFinish} initialValue={selectedCondition} />
      <IssuesModal isOpen={isIssuesModalOpen} onClose={handleIssuesModalClose} onFinish={handleIssuesFinish} initialList={issuesList} />
      <GpuModal isOpen={isGpuModalOpen} onClose={() => setIsGpuModalOpen(false)} onFinish={handleGpuFinish} initialValue={gpuModel} />
      <ScreenSizeModal isOpen={isScreenSizeModalOpen} onClose={() => setIsScreenSizeModalOpen(false)} onFinish={handleScreenSizeFinish} initialValue={screenSize} />
      <AccessoriesModal isOpen={isAccessoriesModalOpen} onClose={() => setIsAccessoriesModalOpen(false)} onFinish={handleAccessoriesFinish} initialList={accessories} />
    </div>
  );
}

// --- SUB-COMPONENTS ---
function CheckboxRow({ label, checked }) {
  return (
    <label className="flex items-start gap-5 cursor-pointer group">
      <div className="relative mt-1">
        <input type="checkbox" defaultChecked={checked} className="sr-only peer" />
        <div className="w-7 h-7 border-2 border-gray-200 rounded-xl peer-checked:bg-[#16A34A] peer-checked:border-[#16A34A] transition-all shadow-sm" />
        <svg className="absolute top-1.5 left-1.5 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <span className="text-sm font-bold text-gray-500 leading-relaxed group-hover:text-[#111827] transition-colors">{label}</span>
    </label>
  );
}

function EvaluationDetailRow({ label, value, color }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{label}</p>
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="font-black text-[#111827]">{value || 'N/A'}</span>
      </div>
    </div>
  );
}

function SummaryPriceRow({ label, value, original, isFree }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{label}</span>
      <div className="flex items-center gap-3">
        {original && <span className="text-sm text-gray-300 line-through">₹{original}</span>}
        <span className={`font-black ${isFree ? 'text-[#16A34A]' : 'text-[#111827]'}`}>{isFree ? 'Free' : formatCurrency(value)}</span>
      </div>
    </div>
  );
}

function BodyConditionModal({ isOpen, onClose, onSelect, initialValue }) {
  const options = [
    { 
      key: 'good', 
      label: 'Good', 
      variant: 'good', 
      bullets: ['Minor scratches', 'Light wear and tear', 'No major dents or damage'] 
    }, 
    { 
      key: 'average', 
      label: 'Average', 
      variant: 'average', 
      bullets: ['Visible scratches on body', 'Minor dents possible', 'Signs of normal wear and tear'] 
    }, 
    { 
      key: 'belowAverage', 
      label: 'Below Average', 
      variant: 'belowAverage', 
      bullets: ['Deep scratches', 'Multiple dents or cracks', 'Heavy wear and tear'] 
    }
  ];
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Body Condition" size="3xl">
       <div className="py-2">
         <p className="text-[13px] text-gray-500 font-bold mb-10">Dents, deep scratches, loose frame, heavy wear.</p>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {options.slice(0, 2).map(o => (<ConditionCard key={o.key} opt={o} onSelect={() => onSelect(o.key)} isSelected={initialValue === o.key} />))}
            <div className="md:col-span-1"><ConditionCard opt={options[2]} onSelect={() => onSelect(options[2].key)} isSelected={initialValue === options[2].key} /></div>
         </div>
       </div>
    </Modal>
  );
}

function ConditionCard({ opt, onSelect, isSelected }) {
  return (
    <button onClick={onSelect} className={`group text-left p-6 rounded-[24px] border-[1.5px] bg-white transition-all hover:shadow-lg flex justify-between items-center h-full relative overflow-hidden active:scale-[0.98] ${isSelected ? 'border-[#16A34A] bg-[#F0FDF4]' : 'border-gray-200 hover:border-gray-300'}`}>
      <div className="relative z-10 pr-2">
        <h4 className="text-base font-black text-[#111827] mb-4">{opt.label}</h4>
        <ul className="space-y-2">{opt.bullets.map(b => (<li key={b} className="text-[11px] font-bold text-gray-500 flex items-start gap-3"><div className="w-1 h-1 rounded-full bg-gray-300 mt-[6px] shrink-0" />{b}</li>))}</ul>
      </div>
      <div className="relative shrink-0 ml-1">
        <div className="relative w-[65px] h-[90px] bg-gray-100 rounded-[15px] border-2 border-gray-200 flex flex-col items-center p-1.5">
           <div className="w-6 h-0.5 bg-gray-300 rounded-full mb-auto" />
           {opt.variant === 'good' && <div className="absolute -top-1.5 -right-1.5 text-xl">✨</div>}
           {opt.variant === 'average' && <div className="absolute -top-1 right-1"><div className="w-1.5 h-0.5 bg-gray-400 rotate-[30deg]" /></div>}
           {opt.variant === 'belowAverage' && <><div className="absolute -top-1 right-1 w-1.5 h-0.5 bg-gray-400 rotate-[30deg]" /><div className="absolute -bottom-1 left-1 w-1.5 h-0.5 bg-gray-400 -rotate-[30deg]" /><div className="absolute top-1/2 -right-0.5 w-1.5 h-0.5 bg-gray-400 rotate-[90deg]" /></>}
        </div>
      </div>
    </button>
  );
}

function IssuesModal({ isOpen, onClose, onFinish, initialList }) {
  const [selected, setSelected] = useState(initialList || []);
  const issues = [{ id: 'screenChanged', label: 'Display Changed', icon: '💻' }, { id: 'keyboard', label: 'Keyboard Issues', icon: '⌨️' }, { id: 'trackpad', label: 'Trackpad Problem', icon: '🖱️' }, { id: 'speakers', label: 'Speaker Problem', icon: '🔊' }, { id: 'wifi', label: 'Wifi/Bluetooth Problem', icon: '🌐' }, { id: 'biometric', label: 'Fingerprint Problem', icon: '👆' }, { id: 'charging', label: 'Charging Problem', icon: '🔌' }, { id: 'battery', label: 'Battery Problem', icon: '🔋' }, { id: 'ports', label: 'USB Port Problem', icon: '🔌' }, { id: 'cdDrive', label: 'CD Drive Problem', icon: '💿' }, { id: 'webcam', label: 'WebCam Issue', icon: '📷' }, { id: 'chargerIssue', label: 'Charger Issue', icon: '🔌' }, { id: 'hardDisk', label: 'Hard Disk Issue', icon: '💾' }, { id: 'displayIssue', label: 'Display Issue', icon: '🖥️' }, { id: 'hinge', label: 'Hinge Issue', icon: '📐' }, { id: 'motherboard', label: 'Motherboard Problem', icon: '🧩' }];
  const toggle = (id) => selected.includes(id) ? setSelected(selected.filter(i => i !== id)) : setSelected([...selected, id]);
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Issues" size="5xl">
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{issues.map(i => (<button key={i.id} onClick={() => toggle(i.id)} className={`p-6 rounded-3xl border-[1.5px] flex flex-col items-center gap-4 transition-all ${selected.includes(i.id) ? 'border-[#16A34A] bg-[#F0FDF4]' : 'border-gray-100 bg-white'}`}><div className="text-2xl">{i.icon}</div><span className="text-[11px] font-black text-center">{i.label}</span></button>))}</div>
       <button onClick={() => onFinish(selected)} className="w-full mt-8 py-4 bg-[#16A34A] text-white rounded-2xl font-black">Proceed</button>
    </Modal>
  );
}

function GpuModal({ isOpen, onClose, onFinish, initialValue }) {
  const [search, setSearch] = useState('');
  const gpus = ['GTX 1650', 'RTX 2050', 'RTX 3050', 'RTX 4050', 'RTX 4060', 'RTX 4070', 'RTX 4080', 'RTX 4090'];
  const filtered = gpus.filter(g => g.toLowerCase().includes(search.toLowerCase()));
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Graphics Card" size="2xl">
       <div className="space-y-6">
         <input type="text" placeholder="Search graphic card..." value={search} onChange={e => setSearch(e.target.value)} className="w-full p-4 border rounded-xl outline-none focus:border-[#16A34A]" />
         <div className="space-y-2 max-h-[300px] overflow-y-auto">{filtered.map(g => (<button key={g} onClick={() => onFinish(g)} className={`w-full text-left p-4 rounded-xl font-bold transition-all ${initialValue === g ? 'bg-[#F0FDF4] text-[#16A34A]' : 'hover:bg-gray-50 text-gray-700'}`}>{g}</button>))}</div>
       </div>
    </Modal>
  );
}

function ScreenSizeModal({ isOpen, onClose, onFinish, initialValue }) {
  const options = [{ key: '10-12', label: 'Screen 10 To 12 Inch' }, { key: '13-14', label: 'Screen 13 To 14 Inch' }, { key: '15-16', label: 'Screen 15 To 16 Inch' }, { key: '16+', label: 'Above 16 Inch' }];
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Screen Size" size="4xl">
       <div className="grid grid-cols-1 md:grid-cols-4 gap-3">{options.map(o => (<button key={o.key} onClick={() => onFinish(o.key)} className={`p-6 rounded-[24px] border-[1.5px] flex flex-col items-center gap-4 transition-all ${initialValue === o.key ? 'border-[#16A34A] bg-[#F0FDF4]' : 'border-gray-100 bg-white'}`}><span className="text-xs font-black text-center">{o.label}</span><div className="w-16 h-16 flex items-center justify-center"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M7 8l10 4" /><path d="M17 8l-10 4" /></svg></div></button>))}</div>
    </Modal>
  );
}

function AccessoriesModal({ isOpen, onClose, onFinish, initialList }) {
  const [selected, setSelected] = useState(initialList || []);
  const items = [{ id: 'bill', label: 'Bill', icon: '📄' }, { id: 'box', label: 'Box', icon: '📦' }, { id: 'charger', label: 'Charger', icon: '🔌' }];
  const toggle = (id) => selected.includes(id) ? setSelected(selected.filter(i => i !== id)) : setSelected([...selected, id]);
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Accessories" size="3xl">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">{items.map(i => (<button key={i.id} onClick={() => toggle(i.id)} className={`p-8 rounded-[24px] border-[1.5px] flex flex-col items-center gap-4 transition-all ${selected.includes(i.id) ? 'border-[#16A34A] bg-[#F0FDF4]' : 'border-gray-100 bg-white'}`}><div className="text-3xl">{i.icon}</div><span className="text-xs font-black">{i.label}</span></button>))}</div>
       <button onClick={() => onFinish(selected)} className="w-full py-5 bg-[#16A34A] text-white rounded-[20px] font-black text-lg shadow-xl shadow-[#16A34A]/30">GET BEST PRICE →</button>
    </Modal>
  );
}

function SummaryItem({ label, value }) {
  return (<div className="flex justify-between items-center group"><span className="text-sm font-bold text-gray-800">{label}</span><span className={`text-sm font-black ${value === '-' ? 'text-gray-300' : 'text-[#111827]'}`}>{value}</span></div>);
}

function EvaluationStepCard({ title, active, children }) {
  return (<div className={`bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm transition-all duration-500 ${active ? 'ring-2 ring-[#16A34A]/20 scale-[1.01]' : 'opacity-30 pointer-events-none'}`}><h3 className="text-base font-black text-[#111827] mb-4">{title}</h3>{children}</div>);
}

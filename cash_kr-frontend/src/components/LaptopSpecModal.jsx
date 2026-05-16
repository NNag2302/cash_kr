import { useState, useEffect, useRef } from 'react';
import Modal from './ui/Modal';
import { 
  MASTER_PROCESSORS, 
  MASTER_GENERATIONS, 
  MASTER_RAM, 
  MASTER_STORAGE 
} from '../utils/laptopSpecs';

export default function LaptopSpecModal({ isOpen, onClose, device, onComplete, initialValues }) {
  const [selectedProcessor, setSelectedProcessor] = useState(null);
  const [selectedGen, setSelectedGen] = useState(null);
  const [selectedRam, setSelectedRam] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  // Load initial values when modal opens
  useEffect(() => {
    if (isOpen && initialValues) {
      setSelectedProcessor(initialValues.processor || null);
      setSelectedGen(initialValues.generation || null);
      setSelectedRam(initialValues.ram || null);
      setSelectedStorage(initialValues.storage || null);
    }
  }, [isOpen, initialValues]);

  if (!device) return null;

  const handleSelect = (type, val) => {
    if (type === 'processor') {
      setSelectedProcessor(val);
      setSelectedGen(null);
      setSelectedRam(null);
      setSelectedStorage(null);
    } else if (type === 'generation') {
      setSelectedGen(val);
      setSelectedRam(null);
      setSelectedStorage(null);
    } else if (type === 'ram') {
      setSelectedRam(val);
      setSelectedStorage(null);
    } else if (type === 'storage') {
      setSelectedStorage(val);
    }
    setOpenDropdown(null);
  };

  const isComplete = selectedProcessor && selectedGen && selectedRam && selectedStorage;

  const handleFinish = () => {
    if (isComplete) {
      onComplete({
        processor: selectedProcessor,
        generation: selectedGen,
        ram: selectedRam,
        storage: selectedStorage
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Choose Specifications :">
      <div className="py-4 relative min-h-[500px] flex flex-col">
        <div className="space-y-6 flex-1">
          <SpecSelect 
            label="Processor" 
            value={selectedProcessor} 
            isOpen={openDropdown === 'processor'}
            setOpen={() => setOpenDropdown('processor')}
          />

          <SpecSelect 
            label="Generation" 
            value={selectedGen} 
            disabled={!selectedProcessor}
            isOpen={openDropdown === 'generation'}
            setOpen={() => setOpenDropdown('generation')}
          />

          <SpecSelect 
            label="RAM" 
            value={selectedRam} 
            disabled={!selectedGen}
            isOpen={openDropdown === 'ram'}
            setOpen={() => setOpenDropdown('ram')}
          />

          <SpecSelect 
            label="Storage" 
            value={selectedStorage} 
            disabled={!selectedRam}
            isOpen={openDropdown === 'storage'}
            setOpen={() => setOpenDropdown('storage')}
          />
        </div>

        <div className="pt-4">
          <button 
            onClick={handleFinish}
            disabled={!isComplete}
            className={`w-full py-4 rounded-xl font-black transition-all flex items-center justify-center gap-2 text-base
              ${isComplete 
                ? 'bg-[#16A34A] text-white hover:bg-[#15803D] shadow-[0_0_15px_rgba(22,163,74,0.3)] scale-[1.01]' 
                : 'bg-[#93C5B5]/50 text-white cursor-not-allowed'}`}
          >
            Next →
          </button>
        </div>

        {/* Full Modal Overlay List */}
        {openDropdown && (
          <div className="absolute inset-x-0 -top-2 bottom-0 bg-white z-[100] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-base font-black text-[#111827]">Select {openDropdown.charAt(0).toUpperCase() + openDropdown.slice(1)}</h3>
              <button onClick={() => setOpenDropdown(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>
            
            <OverlayList 
              type={openDropdown}
              onSelect={(val) => handleSelect(openDropdown, val)}
              onClose={() => setOpenDropdown(null)}
            />
          </div>
        )}
      </div>
    </Modal>
  );
}

function SpecSelect({ label, value, disabled, setOpen }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
          {label} 
          <span className="w-3.5 h-3.5 rounded-full border border-gray-300 flex items-center justify-center text-[9px] text-gray-400 font-bold cursor-help">?</span>
        </label>
        {value && <span className="text-[9px] font-black text-[#16A34A] uppercase tracking-wider">Selected</span>}
      </div>

      <button 
        onClick={setOpen}
        disabled={disabled}
        className={`w-full border-[1.5px] rounded-xl p-4 flex justify-between items-center transition-all text-left
          ${disabled ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm active:scale-[0.98]'}`}
      >
        <span className={`text-sm font-bold ${value ? 'text-[#111827]' : 'text-gray-400'}`}>
          {value ? value : `Select ${label}`}
        </span>
        <div className="flex flex-col -space-y-1 text-gray-400">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="m18 15-6-6-6 6"/></svg>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="m6 9 6 6 6-6"/></svg>
        </div>
      </button>
    </div>
  );
}

function OverlayList({ type, onSelect, onClose }) {
  const [search, setSearch] = useState('');
  
  const options = {
    processor: MASTER_PROCESSORS,
    generation: MASTER_GENERATIONS,
    ram: MASTER_RAM,
    storage: MASTER_STORAGE
  }[type] || [];

  const filteredOptions = options.filter(o => o.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-white rounded-3xl border border-gray-100 shadow-2xl">
      <div className="p-4 border-b border-gray-50">
        <input 
          type="text" 
          placeholder={`Search ${type}...`}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full text-lg outline-none font-bold text-gray-700 placeholder:text-gray-200 bg-gray-50/50 p-4 rounded-2xl"
          autoFocus
        />
      </div>
      <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
        {filteredOptions.length > 0 ? (
          filteredOptions.map(opt => (
            <button 
              key={opt}
              onClick={() => onSelect(opt)}
              className="w-full text-left px-8 py-5 text-base font-bold text-gray-700 hover:bg-gray-50 hover:text-[#16A34A] transition-all border-b border-gray-50 last:border-none"
            >
              {opt}
            </button>
          ))
        ) : (
          <div className="p-20 text-center text-gray-400 font-bold text-sm uppercase tracking-[0.2em]">No Results Found</div>
        )}
      </div>
    </div>
  );
}

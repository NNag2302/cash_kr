import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuote } from '../hooks/useQuote';
import { useAuth } from '../hooks/useAuth';
import { orderService } from '../services/order.service';
import { userService } from '../services/user.service';
import { formatCurrency } from '../utils/formatCurrency';
import { getNextDays, formatDate, formatDateISO, TIME_SLOTS } from '../utils/dateUtils';
import Input from '../components/ui/Input';

const PINCODE_MAP = {
  '400067': { city: 'Mumbai', state: 'Maharashtra', landmark: 'Near Orlem Church', address: '1223, Orlem, orlem' },
  '400001': { city: 'Mumbai', state: 'Maharashtra', landmark: 'Fort Area', address: '10, Marine Drive' },
};

export default function SchedulePickupPage() {
  const navigate = useNavigate();
  const { quote } = useQuote();
  const { user, refreshUser } = useAuth();
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showAddressModal, setShowAddressModal] = useState(false);
  
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Sync selectedAddressId when user changes or first load
  useEffect(() => {
    if (user?.addresses?.length > 0 && !selectedAddressId) {
      setSelectedAddressId(user.addresses[0]._id);
    }
  }, [user, selectedAddressId]);

  const days = getNextDays(7);

  const handleCreateOrder = async () => {
    if (!selectedAddressId || !selectedDate || !selectedSlot) {
      setError('Please complete all selections');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const selectedAddr = user.addresses.find(a => a._id === selectedAddressId);
      const { data } = await orderService.createOrder({
        device: quote.device || {},
        priceBreakdown: quote.priceBreakdown || {},
        pickup: { 
          ...selectedAddr, 
          date: formatDateISO(selectedDate), 
          timeSlot: selectedSlot, 
          paymentMethod 
        },
      });
      navigate(`/order-confirmation/${data.orderId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order');
    } finally {
      setSubmitting(false);
    }
  };

  if (!quote.device) {
    return <div className="text-center py-20 font-bold text-gray-500">No active quote found. Please start over.</div>;
  }

  return (
    <div className="bg-[#F9FAFB] min-h-screen py-10 sm:py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Progress */}
        <div className="flex items-center justify-between mb-10">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 font-bold hover:text-[#111827] transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back
          </button>
          <div className="flex items-center gap-12 text-sm font-bold">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#16A34A]/20 text-[#16A34A] flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <span className="text-gray-400">Payment</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#16A34A] text-white flex items-center justify-center">2</span>
              <span className="text-[#111827]">Pickup</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Step 1: Select Address */}
            <div className="bg-white rounded-[40px] border border-gray-100 p-8 sm:p-10 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#F3F4F6] rounded-xl flex items-center justify-center text-[#111827] font-black">1</div>
                  <h3 className="text-xl font-black text-[#111827]">Select Pickup Address</h3>
                </div>
                <button 
                  onClick={() => setShowAddressModal(true)}
                  className="flex items-center gap-2 bg-[#F0FDF4] text-[#16A34A] px-5 py-2.5 rounded-xl font-black text-sm hover:bg-[#16A34A] hover:text-white transition-all"
                >
                  <span className="text-lg">+</span> Add New Address
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user?.addresses?.length > 0 ? (
                  user.addresses.map((addr) => (
                    <label 
                      key={addr._id}
                      className={`p-6 rounded-[32px] border-2 cursor-pointer transition-all flex items-start gap-4
                        ${selectedAddressId === addr._id 
                          ? 'border-[#16A34A] bg-[#F0FDF4]' 
                          : 'border-gray-50 bg-gray-50/50 hover:border-gray-200'}`}
                    >
                      <input 
                        type="radio" 
                        name="address" 
                        checked={selectedAddressId === addr._id}
                        onChange={() => setSelectedAddressId(addr._id)}
                        className="sr-only"
                      />
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0
                        ${selectedAddressId === addr._id ? 'bg-[#16A34A] text-white' : 'bg-white text-gray-400'}`}>
                        {addr.label === 'Home' ? (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                        ) : (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-[#111827] mb-1">{addr.label}</p>
                        <p className="text-xs text-gray-500 font-medium line-clamp-2 leading-relaxed">{addr.address}, {addr.city}, {addr.pincode}</p>
                      </div>
                      {selectedAddressId === addr._id && (
                        <div className="ml-auto w-5 h-5 bg-[#16A34A] rounded-full flex items-center justify-center shrink-0">
                          <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="3" strokeLinecap="round"/></svg>
                        </div>
                      )}
                    </label>
                  ))
                ) : (
                  <div className="col-span-full py-10 text-center bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200">
                    <p className="text-sm font-bold text-gray-400">No addresses saved. Please add one.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: Select Date & Time */}
            <div className="bg-white rounded-[40px] border border-gray-100 p-8 sm:p-10 shadow-sm">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-10 h-10 bg-[#F3F4F6] rounded-xl flex items-center justify-center text-[#111827] font-black">2</div>
                <h3 className="text-xl font-black text-[#111827]">Select Pickup Date And Time</h3>
              </div>

              <div className="space-y-10">
                {/* Date Selection */}
                <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                  {days.map(d => {
                    const isSelected = selectedDate && formatDateISO(selectedDate) === formatDateISO(d);
                    const dateParts = formatDate(d).split(', ');
                    const dayName = dateParts[0];

                    return (
                      <button 
                        key={d.toISOString()} 
                        onClick={() => setSelectedDate(d)}
                        className={`min-w-[100px] p-5 rounded-[28px] border-2 transition-all flex flex-col items-center gap-1
                          ${isSelected ? 'border-[#16A34A] bg-[#F0FDF4]' : 'border-gray-50 bg-gray-50/50 hover:border-gray-100'}`}
                      >
                        <span className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? 'text-[#16A34A]' : 'text-gray-400'}`}>
                          {dayName}
                        </span>
                        <span className="text-2xl font-black text-[#111827]">{d.getDate()}</span>
                        <span className="text-xs font-bold text-gray-400">{d.toLocaleDateString('en-IN', { month: 'short' })}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Time Selection */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {TIME_SLOTS.map(slot => (
                    <button 
                      key={slot.value} 
                      onClick={() => setSelectedSlot(slot.value)}
                      className={`p-5 rounded-2xl border-2 font-bold transition-all relative
                        ${selectedSlot === slot.value ? 'border-[#16A34A] bg-[#F0FDF4] text-[#16A34A]' : 'border-gray-50 bg-gray-50/50 text-gray-500 hover:border-gray-100'}`}
                    >
                      {slot.popular && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-400 text-[9px] font-black text-white px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm border border-white">Popular</span>
                      )}
                      {slot.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="w-full lg:w-96 space-y-6">
            <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
              <div className="flex items-center gap-6 mb-8 bg-gray-50/50 p-4 rounded-3xl">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-2 shadow-sm border border-gray-100">
                  <img 
                    src={quote.device?.variants?.[0]?.image || "https://img.freepik.com/free-photo/mobile-phone-with-blank-screen_23-2148151433.jpg"} 
                    className="max-h-full object-contain" 
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-[#111827] leading-tight text-sm">{quote.device?.modelName}</h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mt-1 tracking-wider">{quote.device?.variants?.[0]?.storage}</p>
                </div>
              </div>

              <div className="space-y-5">
                <PriceRow label="Final Offer" value={quote.priceBreakdown?.finalPrice} />
                <div className="pt-5 border-t border-gray-100 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-[#16A34A]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>
                    <span className="text-[11px] font-black uppercase tracking-wider">Free doorstep pickup</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#16A34A]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>
                    <span className="text-[11px] font-black uppercase tracking-wider">Instant payment at pickup</span>
                  </div>
                </div>
              </div>

              <button 
                disabled={submitting || !selectedAddressId || !selectedDate || !selectedSlot}
                onClick={handleCreateOrder}
                className="w-full mt-8 bg-[#16A34A] text-white font-black py-5 rounded-2xl hover:bg-[#15803D] transition-all shadow-xl shadow-green-100 disabled:opacity-50 disabled:shadow-none"
              >
                {submitting ? 'Scheduling...' : `Confirm Order — ${formatCurrency(quote.priceBreakdown?.finalPrice)}`}
              </button>
              {error && <p className="text-center text-red-500 text-xs font-bold mt-4">{error}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <CreateAddressModal onClose={() => setShowAddressModal(false)} />
      )}
    </div>
  );
}

function CreateAddressModal({ onClose }) {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [form, setForm] = useState({
    label: 'Home',
    address: '',
    landmark: '',
    pincode: '',
    city: '',
    state: '',
    name: user?.name || '',
    phone: user?.phone || '',
  });

  const handleAutofill = () => {
    // Mock realistic autofill
    setForm({
      ...form,
      address: '1223, Orlem, orlem',
      landmark: 'Near Orlem Church',
      pincode: '400067',
      city: 'Mumbai',
      state: 'Maharashtra',
    });
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.length > 3) {
       // Mock search result selection
       handleAutofill();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.address || !form.pincode || !form.city) {
      alert('Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      await userService.addAddress(form);
      await refreshUser();
      onClose();
    } catch (err) {
      alert('Failed to add address');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl p-10 max-h-[90vh] overflow-y-auto no-scrollbar">
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-[#111827] transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-[#F0FDF4] rounded-2xl flex items-center justify-center text-[#16A34A]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <h2 className="text-2xl font-black text-[#111827]">Create New Address</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></svg>
                Address Type
              </label>
              <div className="flex gap-3">
                {['Home', 'Office', 'Other'].map(type => (
                  <button 
                    key={type} 
                    type="button" 
                    onClick={() => setForm({ ...form, label: type })}
                    className={`flex-1 py-4 rounded-2xl border-2 font-black text-sm transition-all
                      ${form.label === type ? 'border-[#16A34A] bg-[#F0FDF4] text-[#16A34A]' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/></svg>
                Search Address
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  value={searchText}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search here to autofill address" 
                  className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-[#16A34A] transition-all pr-32"
                />
                <button 
                  type="button" 
                  onClick={handleAutofill}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white border border-gray-100 shadow-sm px-4 py-2 rounded-xl text-xs font-black text-[#111827] flex items-center gap-2 hover:bg-gray-50 active:scale-95 transition-all"
                >
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/></svg>
                   Autofill
                </button>
              </div>
              <p className="text-[10px] text-gray-400 font-bold mt-2 ml-1">Search here to autofill your address details</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                Flat No / Building / Colony
              </label>
              <input 
                type="text" 
                placeholder="Enter building details" 
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full bg-white border-2 border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-[#16A34A] transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M2 12h20M12 2v20"/><circle cx="12" cy="12" r="10"/></svg>
                Pincode
              </label>
              <input 
                type="text" 
                placeholder="Enter Pincode" 
                value={form.pincode}
                onChange={(e) => {
                  const val = e.target.value;
                  setForm({ ...form, pincode: val });
                  if (val.length === 6 && PINCODE_MAP[val]) {
                    setForm(f => ({ ...f, city: PINCODE_MAP[val].city, state: PINCODE_MAP[val].state, address: PINCODE_MAP[val].address, landmark: PINCODE_MAP[val].landmark }));
                  }
                }}
                className="w-full bg-white border-2 border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-[#16A34A] transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                Landmark
              </label>
              <input 
                type="text" 
                placeholder="Enter landmark details" 
                value={form.landmark}
                onChange={(e) => setForm({ ...form, landmark: e.target.value })}
                className="w-full bg-white border-2 border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-[#16A34A] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">City</label>
              <input 
                type="text" 
                placeholder="City" 
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">State</label>
              <input 
                type="text" 
                placeholder="State" 
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-6 bg-[#16A34A] text-white font-black py-5 rounded-[24px] hover:bg-[#15803D] transition-all shadow-xl shadow-green-100 flex items-center justify-center gap-2"
          >
            {loading ? 'Saving...' : 'Save Address'}
          </button>
        </form>
      </div>
    </div>
  );
}

function PriceRow({ label, value }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-gray-400 uppercase tracking-widest">{label}</span>
      <span className="font-black text-[#111827]">{formatCurrency(value)}</span>
    </div>
  );
}

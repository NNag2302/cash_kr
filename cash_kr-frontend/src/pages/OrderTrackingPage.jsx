import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../services/order.service';
import { formatCurrency } from '../utils/formatCurrency';
import Loader from '../components/ui/Loader';

export default function OrderTrackingPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);

  const fetchOrder = () => {
    orderService.getOrder(orderId).then(res => {
      setOrder(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await orderService.cancelOrder(orderId);
      fetchOrder();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order');
    }
  };

  if (loading) return <Loader />;
  if (!order) return <div className="text-center py-20 font-bold text-gray-500">Order not found.</div>;
  if (order.status === 'cancelled') {
    return (
      <div className="bg-[#F9FAFB] min-h-screen py-20 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-12 rounded-[40px] shadow-sm border border-gray-100">
           <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
           </div>
           <h2 className="text-2xl font-black text-[#111827] mb-2">Order Cancelled</h2>
           <p className="text-sm font-bold text-gray-400 mb-8">This order has been cancelled successfully.</p>
           <button onClick={() => navigate('/dashboard')} className="w-full bg-[#111827] text-white font-black py-4 rounded-2xl hover:bg-black transition-all">Go to Dashboard</button>
        </div>
      </div>
    );
  }

  const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const pickupDateStr = order.pickup?.date ? new Date(order.pickup.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Pending';

  const steps = [
    { label: 'Order Confirmed', status: 'placed' },
    { label: 'Vendor Assigned', status: 'assigned' },
    { label: 'Out For Pickup', status: 'picked' },
    { label: 'Pickup', status: 'completed' },
  ];

  const getStatusIndex = (status) => {
    if (['placed', 'scheduled'].includes(status)) return 0;
    if (status === 'assigned') return 1;
    if (['picked', 'verified'].includes(status)) return 2;
    if (['payment_initiated', 'completed'].includes(status)) return 3;
    return 0;
  };

  const currentIdx = getStatusIndex(order.status);

  return (
    <div className="bg-[#F9FAFB] min-h-screen py-10 sm:py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-400 font-bold hover:text-[#111827] transition-colors mb-8"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back
        </button>

        <div className="bg-white rounded-[40px] border border-gray-100 p-8 sm:p-12 shadow-sm space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-2xl font-black text-[#111827] mb-1">Order #: <span className="uppercase">{orderId}</span></h1>
              <p className="text-[#EF4444] font-black text-sm uppercase tracking-wider">PIN : 7803</p>
            </div>
            <button 
              onClick={() => setShowReport(true)}
              className="flex items-center gap-2 bg-[#F9FAFB] border border-gray-100 text-[#16A34A] px-6 py-3 rounded-2xl font-black text-sm hover:bg-white transition-all shadow-sm"
            >
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
               See Device Report
            </button>
          </div>

          <div className="flex flex-wrap gap-y-2 gap-x-8 text-sm font-bold">
             <p className="text-gray-400">Order date: <span className="text-[#111827]">{orderDate}</span></p>
             <p className="text-[#16A34A]">Pickup Date: <span className="font-black">{pickupDateStr} - {order.pickup?.timeSlot}</span></p>
          </div>

          <div className="border-t border-gray-50 pt-10">
            <h3 className="text-lg font-black text-[#111827] mb-10">Order Status: <span className="text-[#16A34A]">Generated</span></h3>
            
            {/* Progress Bar */}
            <div className="relative pt-12 pb-8">
              <div className="absolute top-[60px] left-0 right-0 h-1 bg-gray-100 rounded-full" />
              <div 
                className="absolute top-[60px] left-0 h-1 bg-[#16A34A] rounded-full transition-all duration-500" 
                style={{ width: `${(currentIdx / (steps.length - 1)) * 100}%` }}
              />
              
              <div className="flex justify-between relative">
                {steps.map((step, i) => {
                  const isActive = i <= currentIdx;
                  return (
                    <div key={step.label} className="flex flex-col items-center">
                      <div className={`absolute -top-12 text-[11px] font-black uppercase tracking-tighter w-max
                        ${isActive ? 'text-[#16A34A]' : 'text-gray-300'}`}>
                        {step.label}
                      </div>
                      <div className={`w-6 h-6 rounded-full border-4 border-white shadow-sm relative z-10 transition-all duration-300
                        ${isActive ? 'bg-[#16A34A] scale-125' : 'bg-gray-200'}`} />
                    </div>
                  );
                })}
              </div>
            </div>
            <p className="text-sm font-bold text-gray-500 text-center mt-6">Your order has been confirmed and ready for pickup.</p>
          </div>

          {/* Device Item */}
          <div className="bg-white border border-gray-100 rounded-[32px] p-8 flex flex-col md:flex-row items-center gap-10">
             <div className="w-24 h-24 bg-gray-50 rounded-3xl flex items-center justify-center p-4">
                <img 
                  src={order.device?.variants?.[0]?.image || "https://img.freepik.com/free-photo/mobile-phone-with-blank-screen_23-2148151433.jpg"} 
                  className="max-h-full object-contain"
                />
             </div>
             <div className="flex-1 text-center md:text-left">
                <h4 className="text-xl font-black text-[#111827] mb-1">{order.device?.modelName}</h4>
                <p className="text-sm font-bold text-gray-400">( {order.device?.storage} / {order.device?.ram || '8 GB'} )</p>
             </div>
             <div className="text-center md:text-right">
                <p className="text-2xl font-black text-[#111827]">{formatCurrency(order.priceBreakdown?.finalPrice)}</p>
                <p className="text-xs font-bold text-gray-400">Qty: 1</p>
             </div>
          </div>

          {/* Logistics Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-gray-50">
            <div className="space-y-6">
              <div>
                <h5 className="text-sm font-black text-[#111827] mb-2">Payment Method</h5>
                <p className="text-xs font-bold text-gray-400 mb-1">Payment Type : <span className="text-[#16A34A] capitalize">{order.pickup?.paymentMethod}</span></p>
              </div>

              <div>
                 <h5 className="text-sm font-black text-[#111827] mb-4">Need Help</h5>
                 <div className="space-y-3">
                    <HelpLink label="Order issues" />
                    <HelpLink label="Pick Up" />
                    <HelpLink label="Contact Support" />
                 </div>
              </div>
            </div>

            <div className="space-y-6">
               <div>
                  <h5 className="text-sm font-black text-[#111827] mb-2">Pickup Address</h5>
                  <p className="text-xs font-bold text-gray-400 mb-4">Pickup Status: <span className="text-[#16A34A]">Order Generated</span></p>
                  
                  <div className="flex gap-3 mb-4">
                    <button 
                      onClick={() => setShowReschedule(true)}
                      className="flex items-center gap-2 bg-[#F0FDF4] text-[#16A34A] px-6 py-2.5 rounded-xl font-black text-xs hover:bg-[#16A34A] hover:text-white transition-all shadow-sm"
                    >
                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                       Reschedule
                    </button>
                    {['placed', 'scheduled'].includes(order.status) && (
                      <button 
                        onClick={handleCancel}
                        className="flex items-center gap-2 bg-red-50 text-red-500 px-6 py-2.5 rounded-xl font-black text-xs hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      >
                         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                         Cancel Order
                      </button>
                    )}
                  </div>

                  <div className="flex gap-4 p-5 rounded-2xl bg-gray-50/50 border border-gray-100">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm border border-gray-100">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                    </div>
                    <div>
                      <p className="font-black text-[#111827] text-xs mb-1">Home</p>
                      <p className="text-[11px] font-bold text-gray-500 leading-relaxed">{order.pickup?.address}, {order.pickup?.city}, {order.pickup?.pincode}</p>
                    </div>
                  </div>
               </div>

               <div>
                 <h5 className="text-sm font-black text-[#111827] mb-4">Order Summary</h5>
                 <div className="space-y-3 bg-white p-6 rounded-2xl border border-gray-50 shadow-sm">
                    <div className="flex justify-between text-xs font-bold text-gray-400">
                       <span>Subtotal</span>
                       <span className="text-[#111827]">{formatCurrency(order.priceBreakdown?.finalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-gray-400">
                       <span>Pickup</span>
                       <span className="text-[#16A34A]">FREE</span>
                    </div>
                    <div className="pt-3 border-t border-gray-50 flex justify-between">
                       <span className="text-sm font-black text-[#111827]">Total Payout</span>
                       <span className="text-xl font-black text-[#111827]">{formatCurrency(order.priceBreakdown?.finalPrice)}</span>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {showReport && (
        <DeviceEvaluationReportModal order={order} onClose={() => setShowReport(false)} />
      )}

      {showReschedule && (
        <RescheduleModal 
          order={order} 
          onClose={() => setShowReschedule(false)} 
          onSuccess={() => {
            setShowReschedule(false);
            fetchOrder();
          }}
        />
      )}
    </div>
  );
}

function DeviceEvaluationReportModal({ order, onClose }) {
  const functionalIssues = order.device?.functionalIssues || [];
  const screenIssues = order.device?.screenIssues || [];
  
  const issueLabels = {
    'back_glass': 'Back Glass Broken',
    'buttons': 'Physical Button Problem',
    'display_changed': 'Display Changed',
    'bend': 'Bend Device',
    'face_id': 'Face ID Problem',
    'restart': 'Restart Problem',
    'sensors': 'Sensors Problem',
    'front_camera': 'Front Camera Problem',
    'back_camera': 'Back Camera Problem',
    'mic': 'Microphone Problem',
    'speaker': 'Speaker Problem',
    'fingerprint': 'Fingerprint Problem',
    'bluetooth': 'Bluetooth Problem',
    'wifi': 'Wifi Problem',
    'network': 'Network Problem',
    'vibration': 'Vibration Problem',
    'charging': 'Charging Problem',
    'battery': 'Battery/Service Problem',
    'motherboard': 'Motherboard Problem'
  };

  const techIssues = functionalIssues.filter(id => !['back_glass', 'display_changed', 'bend', 'buttons'].includes(id));
  const physicalIssues = functionalIssues.filter(id => ['back_glass', 'display_changed', 'bend', 'buttons'].includes(id));

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden">
        <div className="p-8 text-center relative border-b border-gray-50">
          <button onClick={onClose} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-gray-900 transition-all">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
          <h2 className="text-2xl font-black text-[#111827] mb-2">Device Evaluation Report</h2>
          <p className="text-sm font-bold text-gray-400">This is the report that you filled while selling this device.</p>
        </div>

        <div className="p-8 max-h-[70vh] overflow-y-auto no-scrollbar space-y-10">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-black text-[#16A34A] mb-1">Device Evaluation</h3>
              <p className="text-sm font-black text-[#111827]">Summary</p>
            </div>
            <div className="space-y-4">
              <ReportRow label="Device Age" value={order.device?.deviceAge || '3 - 6 Months'} />
              <ReportRow label="Screen Condition" value={order.device?.hasScreenIssue ? 'Faulty Screen' : 'Good Condition'} />
              <ReportRow label="Body Condition" value={order.device?.bodyCondition || 'Average'} isAlert={order.device?.bodyCondition !== 'Flawless'} />
              <ReportRow label="Functional Issues" value={order.device?.functionalIssues?.length > 0 ? 'Has Issues' : 'No Issues'} isAlert={order.device?.functionalIssues?.length > 0} />
              <ReportRow label="Power Issue" value="Powers On" />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-black text-[#111827]">Physical Condition</h3>
            <div className="space-y-3">
               {physicalIssues.length === 0 && screenIssues.length === 0 && (
                 <p className="text-sm font-bold text-gray-400 italic">No physical issues reported</p>
               )}
               {screenIssues.map(issue => (
                 <div key={issue} className="flex items-center gap-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                   <p className="text-sm font-black text-[#EF4444]">{issue}</p>
                 </div>
               ))}
               {physicalIssues.map(id => (
                 <div key={id} className="flex items-center gap-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                   <p className="text-sm font-black text-[#EF4444]">{issueLabels[id] || id}</p>
                 </div>
               ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-black text-[#111827]">Technical Condition</h3>
            <div className="space-y-3">
               {techIssues.length === 0 ? (
                 <div className="p-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No technical issues reported</p>
                 </div>
               ) : (
                 techIssues.map(id => (
                   <div key={id} className="flex items-center gap-3">
                     <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                     <p className="text-sm font-black text-[#EF4444]">{issueLabels[id] || id}</p>
                   </div>
                 ))
               )}
            </div>
          </div>
        </div>

        <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex gap-4">
           <button onClick={onClose} className="flex-1 bg-[#111827] text-white font-black py-4 rounded-2xl hover:bg-black transition-all">Close Report</button>
        </div>
      </div>
    </div>
  );
}

function ReportRow({ label, value, isAlert }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm font-black text-[#111827]">{label}</span>
      <span className={`text-sm font-black ${isAlert ? 'text-[#EF4444]' : 'text-gray-500'}`}>{value}</span>
    </div>
  );
}

function RescheduleModal({ order, onClose, onSuccess }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d.toISOString().split('T')[0];
  });

  const slots = ['10:00 AM - 01:00 PM', '01:00 PM - 04:00 PM', '04:00 PM - 07:00 PM'];

  const handleReschedule = async () => {
    if (!selectedDate || !selectedSlot) return;
    setSubmitting(true);
    try {
      await orderService.rescheduleOrder(order.orderId, { date: selectedDate, timeSlot: selectedSlot });
      onSuccess();
    } catch (error) {
      console.error('Reschedule failed:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-[32px] shadow-2xl p-8">
        <h2 className="text-2xl font-black text-[#111827] mb-2">Reschedule Pickup</h2>
        <p className="text-sm font-bold text-gray-400 mb-8">Select a new date and time for your pickup.</p>

        <div className="space-y-6">
          <div>
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 block">Select Date</label>
            <div className="grid grid-cols-3 gap-2">
              {dates.map(date => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`py-3 rounded-xl border text-xs font-black transition-all
                    ${selectedDate === date ? 'bg-[#16A34A] text-white border-[#16A34A]' : 'bg-gray-50 text-gray-500 border-gray-100 hover:border-gray-200'}`}
                >
                  {new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 block">Select Time Slot</label>
            <div className="space-y-2">
              {slots.map(slot => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`w-full py-4 px-6 rounded-2xl border text-sm font-black transition-all text-left flex items-center justify-between
                    ${selectedSlot === slot ? 'bg-[#F0FDF4] text-[#16A34A] border-[#16A34A]' : 'bg-gray-50 text-gray-500 border-gray-100 hover:border-gray-200'}`}
                >
                  {slot}
                  {selectedSlot === slot && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button onClick={onClose} className="flex-1 bg-gray-100 text-gray-500 font-black py-4 rounded-2xl hover:bg-gray-200 transition-all">Cancel</button>
            <button 
              onClick={handleReschedule}
              disabled={submitting || !selectedDate || !selectedSlot}
              className="flex-2 bg-[#16A34A] text-white font-black py-4 px-8 rounded-2xl hover:bg-black transition-all disabled:opacity-50"
            >
              {submitting ? 'Updating...' : 'Confirm Reschedule'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function HelpLink({ label }) {
  return (
    <div className="flex items-center justify-between group cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-[#16A34A] transition-colors">
           {label === 'Order issues' && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>}
           {label === 'Pick Up' && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="1" y="3" width="15" height="13"/><polyline points="16 8 20 8 23 11 23 16 16 16"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>}
           {label === 'Contact Support' && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
        </div>
        <span className="text-xs font-bold text-gray-500 group-hover:text-[#111827] transition-colors">{label}</span>
      </div>
      <svg className="text-gray-300 group-hover:text-[#16A34A] group-hover:translate-x-0.5 transition-all" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M7 17l10-10M7 7h10v10"/></svg>
    </div>
  );
}

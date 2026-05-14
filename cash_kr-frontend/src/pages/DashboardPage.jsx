import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { orderService } from '../services/order.service';
import { userService } from '../services/user.service';
import { formatCurrency } from '../utils/formatCurrency';
import Badge from '../components/ui/Badge';
import Loader from '../components/ui/Loader';

// --- Icons (SVGs matching CashKr style) ---
const IconOrders = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
);
const IconAddress = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);
const IconPayment = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
);
const IconEarnings = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="m17 5-5-3-5 3"/><path d="m17 19-5 3-5-3"/><path d="M2 12h20"/><path d="m5 7-3 5 3 5"/><path d="m19 7 3 5-3 5"/></svg>
);
const IconReferral = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect width="20" height="5" x="2" y="7"/><line x1="12" x2="12" y1="22" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7Z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7Z"/></svg>
);
const IconLogout = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
);
const IconChevronRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
);
const IconChevronLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
);

export default function DashboardPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Orders');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [referral, setReferral] = useState({ referralCode: '', totalReferrals: 0, totalEarnings: 0, referrals: [] });
  const [addresses, setAddresses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [copied, setCopied] = useState(false);
  const [selectedReportOrder, setSelectedReportOrder] = useState(null);

  const fetchData = async () => {
    try {
      const [userRes, ordersRes, refRes] = await Promise.all([
        userService.getMe(),
        orderService.getOrders(),
        userService.getReferrals().catch(() => ({ data: { referralCode: 'GENERATE123', totalReferrals: 0, totalEarnings: 0, referrals: [] } })),
      ]);
      
      setUser(userRes.data.user);
      setOrders(ordersRes.data || []);
      setReferral(refRes.data);
      setAddresses(userRes.data.user.addresses || []);
      setPaymentMethods(userRes.data.user.paymentMethods || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddAddress = async (addressData) => {
    try {
      const res = await userService.addAddress(addressData);
      setAddresses(res.data);
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      const res = await userService.deleteAddress(id);
      setAddresses(res.data);
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const handleAddPayment = async (paymentData) => {
    try {
      const res = await userService.addPaymentMethod(paymentData);
      setPaymentMethods(res.data);
    } catch (error) {
      console.error('Error adding payment method:', error);
    }
  };

  const handleDeletePayment = async (id) => {
    try {
      const res = await userService.deletePaymentMethod(id);
      setPaymentMethods(res.data);
    } catch (error) {
      console.error('Error deleting payment method:', error);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await orderService.cancelOrder(orderId);
        fetchData();
      } catch (error) {
        console.error('Error cancelling order:', error);
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const copyCode = () => {
    if (referral.referralCode) {
      navigator.clipboard.writeText(referral.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) return <Loader />;

  const menuItems = [
    { name: 'Orders', icon: <IconOrders /> },
    { name: 'Address', icon: <IconAddress /> },
    { name: 'Payment', icon: <IconPayment /> },
    { name: 'Earnings', icon: <IconEarnings /> },
    { name: 'Referral', icon: <IconReferral /> },
  ];

  return (
    <div className="bg-gray-50/50 min-h-screen py-10 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#111827] mb-8">My Profile</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-[320px] flex flex-col gap-6">
            {/* User Profile Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#F0FDF4] flex items-center justify-center border-4 border-white shadow-sm overflow-hidden">
                <div className="w-10 h-10 rounded-full bg-[#16A34A] flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#111827]">{user?.name || 'User Name'}</h3>
                <p className="text-sm text-gray-500 font-medium">{user?.phone || 'Phone number'}</p>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="bg-white rounded-2xl border border-gray-100 p-3 shadow-sm flex flex-col gap-1">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group
                    ${activeTab === item.name 
                      ? 'bg-[#F0FDF4] text-[#16A34A]' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  <div className={`p-2 rounded-lg transition-colors
                    ${activeTab === item.name ? 'bg-white shadow-sm text-[#16A34A]' : 'bg-gray-50 text-gray-400 group-hover:text-gray-600'}`}>
                    {item.icon}
                  </div>
                  <span className="font-bold text-[15px]">{item.name}</span>
                </button>
              ))}
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-3 w-full py-4 rounded-xl border border-[#FEE2E2] bg-[#FEF2F2] text-[#EF4444] font-bold text-[15px] hover:bg-[#FEE2E2] transition-colors mt-auto"
            >
              <div className="p-1 rounded bg-white shadow-sm">
                <IconLogout />
              </div>
              Log Out
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm min-h-[500px] p-8">
            {activeTab === 'Orders' && (
              <OrdersTab 
                orders={orders} 
                setSelectedReportOrder={setSelectedReportOrder} 
                onCancel={handleCancelOrder} 
              />
            )}
            {activeTab === 'Address' && (
              <AddressTab 
                addresses={addresses} 
                onAdd={handleAddAddress} 
                onDelete={handleDeleteAddress} 
              />
            )}
            {activeTab === 'Payment' && (
              <PaymentTab 
                paymentMethods={paymentMethods} 
                onAdd={handleAddPayment} 
                onDelete={handleDeletePayment} 
              />
            )}
            {activeTab === 'Earnings' && <EarningsTab />}
            {activeTab === 'Referral' && (
              <ReferralTab 
                referral={referral} 
                copyCode={copyCode} 
                copied={copied} 
              />
            )}
          </div>
        </div>
      </div>

      {selectedReportOrder && (
        <DeviceEvaluationReportModal 
          order={selectedReportOrder} 
          onClose={() => setSelectedReportOrder(null)} 
        />
      )}
    </div>
  );
}

// --- Sub-components for Tabs ---

function OrdersTab({ orders, setSelectedReportOrder, onCancel }) {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#111827]">Check the status of orders</h2>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50/50 rounded-[40px] border border-dashed border-gray-200">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
            <IconOrders />
          </div>
          <p className="text-gray-500 font-bold">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {orders.map((order) => (
               <div key={order.orderId} className="bg-white border border-gray-100 rounded-[40px] p-8 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                  {/* Top Status Bar */}
                  <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-50">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-[#F0FDF4] rounded-full flex items-center justify-center text-[#16A34A]">
                         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                       </div>
                       <div>
                         <h4 className="text-lg font-black text-[#111827]">Order Confirmed</h4>
                         <p className="text-sm font-bold text-gray-400">Your order has been created.</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => navigate(`/orders/${order.orderId}`)}
                      className="px-8 py-3 rounded-xl border-2 border-[#16A34A] text-[#16A34A] font-black text-sm hover:bg-[#16A34A] hover:text-white transition-all"
                    >
                      View Details
                    </button>
                  </div>

                  {/* Device Info Row */}
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-24 h-24 bg-gray-50 rounded-3xl flex items-center justify-center p-4">
                      <img 
                        src={order.device?.variants?.[0]?.image || "https://img.freepik.com/free-photo/mobile-phone-with-blank-screen_23-2148151433.jpg"} 
                        className="max-h-full object-contain"
                      />
                    </div>
                    
                    <div className="flex-1 text-center md:text-left">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-1">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
                      </p>
                      <h3 className="text-xl font-black text-[#111827] mb-1">{order.device?.modelName}</h3>
                      <p className="text-sm font-bold text-gray-400">{order.device?.storage} / {order.device?.ram || '8 GB'}</p>
                    </div>

                    <div className="flex items-center gap-12">
                      <div className="text-center md:text-right">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
                        <p className="font-black text-[#111827] uppercase">{order.orderId}</p>
                      </div>
                      <div className="text-center md:text-right">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Quote</p>
                        <p className="text-2xl font-black text-[#111827]">{formatCurrency(order.priceBreakdown?.finalPrice)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Actions for Mobile-ish view */}
                  <div className="mt-8 flex gap-3">
                     <button 
                       onClick={() => setSelectedReportOrder(order)}
                       className="flex-1 bg-gray-50 text-gray-500 font-bold py-3 rounded-2xl hover:bg-gray-100 transition-all text-sm"
                     >
                       Evaluation Report
                     </button>
                     {['placed', 'scheduled'].includes(order.status) && (
                        <button 
                          onClick={() => onCancel(order.orderId)}
                          className="flex-1 bg-red-50 text-red-500 font-bold py-3 rounded-2xl hover:bg-red-100 transition-all text-sm"
                        >
                          Cancel Order
                        </button>
                     )}
                  </div>
               </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <button className="flex items-center justify-center w-12 h-12 rounded-2xl border border-gray-100 bg-white text-gray-400 hover:text-[#111827] hover:border-gray-200 transition-all">
              <IconChevronLeft />
            </button>
            <div className="flex items-center gap-2">
               <span className="w-10 h-10 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center font-black">1</span>
            </div>
            <button className="flex items-center justify-center w-12 h-12 rounded-2xl border border-gray-100 bg-white text-gray-400 hover:text-[#111827] hover:border-gray-200 transition-all">
              <IconChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AddressTab({ addresses, onAdd, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    label: 'Home',
    name: '',
    phone: '',
    pincode: '',
    address: '',
    landmark: '',
    city: '',
    state: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    setShowForm(false);
    setFormData({ label: 'Home', name: '', phone: '', pincode: '', address: '', landmark: '', city: '', state: '' });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#111827]">Manage Your Saved Addresses</h2>
          <p className="text-sm text-gray-500 mt-1">Add, edit, or remove your saved locations</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-all shadow-sm"
        >
          <span className="text-[#16A34A] text-xl">{showForm ? '×' : '+'}</span> {showForm ? 'Cancel' : 'Add New Address'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            placeholder="Label (e.g. Home, Office)" 
            className="p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/50"
            value={formData.label}
            onChange={(e) => setFormData({...formData, label: e.target.value})}
            required
          />
          <input 
            placeholder="Full Name" 
            className="p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/50"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <input 
            placeholder="Phone Number" 
            className="p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/50"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            required
          />
          <input 
            placeholder="Pincode" 
            className="p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/50"
            value={formData.pincode}
            onChange={(e) => setFormData({...formData, pincode: e.target.value})}
            required
          />
          <div className="md:col-span-2">
            <textarea 
              placeholder="Full Address" 
              className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/50"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              required
            />
          </div>
          <input 
            placeholder="Landmark" 
            className="p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/50"
            value={formData.landmark}
            onChange={(e) => setFormData({...formData, landmark: e.target.value})}
          />
          <input 
            placeholder="City" 
            className="p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/50"
            value={formData.city}
            onChange={(e) => setFormData({...formData, city: e.target.value})}
            required
          />
          <input 
            placeholder="State" 
            className="p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/50"
            value={formData.state}
            onChange={(e) => setFormData({...formData, state: e.target.value})}
            required
          />
          <button type="submit" className="md:col-span-2 bg-[#16A34A] text-white font-bold py-3 rounded-xl hover:bg-[#15803d] transition-colors mt-2">
            Save Address
          </button>
        </form>
      )}

      {addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-gray-400 font-medium">(0 addresses out of 3)</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div key={addr._id} className="border border-gray-100 rounded-2xl p-5 relative group hover:border-[#16A34A]/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 bg-[#F0FDF4] text-[#16A34A] text-xs font-bold rounded-full uppercase">{addr.label}</span>
                <button 
                  onClick={() => onDelete(addr._id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                </button>
              </div>
              <h4 className="font-bold text-[#111827]">{addr.name}</h4>
              <p className="text-sm text-gray-500 mt-1">{addr.address}</p>
              <p className="text-sm text-gray-500">{addr.city}, {addr.state} - {addr.pincode}</p>
              <p className="text-sm text-gray-500 mt-2 font-medium">📞 {addr.phone}</p>
              {addr.isDefault && <p className="text-[10px] text-[#16A34A] font-bold mt-3 uppercase tracking-wider">Default Address</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PaymentTab({ paymentMethods, onAdd, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState('bank');
  const [formData, setFormData] = useState({
    accountName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    upiId: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ ...formData, type });
    setShowForm(false);
    setFormData({ accountName: '', accountNumber: '', ifscCode: '', bankName: '', upiId: '' });
  };

  const bankAccounts = paymentMethods.filter(pm => pm.type === 'bank');
  const upiIds = paymentMethods.filter(pm => pm.type === 'upi');

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Manage Your Saved Payment Methods</p>
        <h2 className="text-3xl font-bold text-[#111827]">Payments</h2>
      </div>

      <div className="space-y-4">
        {/* Forms for adding */}
        {showForm && (
          <div className="bg-gray-50 rounded-3xl p-6 border border-[#16A34A]/20">
            <div className="flex gap-4 mb-6">
              <button 
                onClick={() => setType('bank')}
                className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${type === 'bank' ? 'bg-[#16A34A] text-white shadow-md' : 'bg-white text-gray-500 border border-gray-100'}`}
              >
                Bank Account
              </button>
              <button 
                onClick={() => setType('upi')}
                className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${type === 'upi' ? 'bg-[#16A34A] text-white shadow-md' : 'bg-white text-gray-500 border border-gray-100'}`}
              >
                UPI ID
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {type === 'bank' ? (
                <>
                  <input 
                    placeholder="Account Holder Name" 
                    className="p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/50"
                    value={formData.accountName}
                    onChange={(e) => setFormData({...formData, accountName: e.target.value})}
                    required
                  />
                  <input 
                    placeholder="Bank Name" 
                    className="p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/50"
                    value={formData.bankName}
                    onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                    required
                  />
                  <input 
                    placeholder="Account Number" 
                    className="p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/50"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                    required
                  />
                  <input 
                    placeholder="IFSC Code" 
                    className="p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/50"
                    value={formData.ifscCode}
                    onChange={(e) => setFormData({...formData, ifscCode: e.target.value})}
                    required
                  />
                </>
              ) : (
                <div className="md:col-span-2">
                  <input 
                    placeholder="UPI ID (e.g. name@bank)" 
                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/50"
                    value={formData.upiId}
                    onChange={(e) => setFormData({...formData, upiId: e.target.value})}
                    required
                  />
                </div>
              )}
              <div className="md:col-span-2 flex gap-3 mt-2">
                <button type="submit" className="flex-1 bg-[#16A34A] text-white font-bold py-3 rounded-xl hover:bg-[#15803d] transition-colors">
                  Save Payment Method
                </button>
                <button 
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 rounded-xl border border-gray-200 text-gray-500 font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Bank Account List */}
        <div className="border border-gray-100 rounded-3xl p-6 relative overflow-hidden group hover:border-[#16A34A]/20 transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-[#F0FDF4] group-hover:text-[#16A34A] transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-[#111827]">Bank Accounts</h4>
                {bankAccounts.length === 0 ? (
                  <p className="text-sm text-gray-400 font-medium">Not added</p>
                ) : (
                  <div className="mt-4 space-y-4">
                    {bankAccounts.map(bank => (
                      <div key={bank._id} className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <div>
                          <p className="font-bold text-sm text-gray-900">{bank.bankName}</p>
                          <p className="text-xs text-gray-500">A/c: ****{bank.accountNumber.slice(-4)} • {bank.accountName}</p>
                        </div>
                        <button 
                          onClick={() => onDelete(bank._id)}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-2">Bank transfers are sent directly to your account.</p>
              </div>
            </div>
            {!showForm && <button onClick={() => {setShowForm(true); setType('bank');}} className="text-[#16A34A] font-bold text-sm hover:underline">Add New Bank Account</button>}
          </div>
        </div>

        {/* UPI List */}
        <div className="border border-gray-100 rounded-3xl p-6 relative overflow-hidden group hover:border-[#16A34A]/20 transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-[#F0FDF4] group-hover:text-[#16A34A] transition-colors">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-[#111827]">UPI Transfer</h4>
                {upiIds.length === 0 ? (
                  <p className="text-sm text-gray-400 font-medium">Not added</p>
                ) : (
                  <div className="mt-4 space-y-4">
                    {upiIds.map(upi => (
                      <div key={upi._id} className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <div>
                          <p className="font-bold text-sm text-gray-900">{upi.upiId}</p>
                        </div>
                        <button 
                          onClick={() => onDelete(upi._id)}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-2">Instant transfer to your UPI linked account.</p>
              </div>
            </div>
            {!showForm && <button onClick={() => {setShowForm(true); setType('upi');}} className="text-[#16A34A] font-bold text-sm hover:underline">Add New UPI ID</button>}
          </div>
        </div>

        {/* Security Info */}
        <div className="bg-gray-50/50 rounded-2xl p-4 text-center">
          <p className="text-xs text-gray-500 font-medium flex items-center justify-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Secured by SSL Encryption. 100% Safe and Confidential Payment Info
          </p>
        </div>
      </div>
    </div>
  );
}

function EarningsTab() {
  return (
    <div className="h-full flex flex-col">
      <div className="bg-[#15803d] rounded-3xl p-10 text-white text-center relative overflow-hidden mb-10">
        <div className="relative z-10">
          <h2 className="text-4xl font-black mb-4">Earnings Dashboard</h2>
          <span className="inline-block bg-white text-[#15803d] px-6 py-2 rounded-full font-bold text-sm">Coming Soon</span>
        </div>
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <p className="text-center text-gray-600 font-medium max-w-lg mx-auto mb-12">
        We're building powerful tools to help you track and maximize your earnings on Cashkr.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Earnings Analytics', desc: 'Visualize your earnings trends and identify your best performing activities.', icon: <IconEarnings /> },
          { title: 'Refer & Earn', desc: 'Invite friends to join Cashkr and earn bonuses for each successful referral.', icon: <IconReferral /> },
          { title: 'Earnings History', desc: 'Track your complete earnings history with detailed transaction records.', icon: <IconOrders /> },
        ].map((card) => (
          <div key={card.title} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-[#F0FDF4] rounded-2xl flex items-center justify-center text-[#16A34A] mb-6">
              {card.icon}
            </div>
            <h4 className="font-bold text-[#111827] mb-3">{card.title}</h4>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">{card.desc}</p>
            <button className="text-[#16A34A] font-bold text-sm flex items-center gap-1 group">
              Learn more <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReferralTab({ referral, copyCode, copied }) {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] font-bold text-[#16A34A] uppercase tracking-widest mb-1">Refer & Earn</p>
        <h2 className="text-3xl font-bold text-[#111827] max-w-md leading-tight">
          Share your referral link, earn instant rewards
        </h2>
        <p className="text-sm text-gray-500 mt-4 max-w-lg">
          Generate your referral link, invite your friends, and their bonus applies automatically when they complete their first sale.
        </p>
      </div>

      <div className="border border-[#16A34A]/30 bg-white rounded-3xl p-8 relative">
        <div className="absolute top-4 right-6 text-[#16A34A]/20">
           <IconReferral />
        </div>
        
        <p className="text-[10px] font-bold text-[#16A34A] uppercase tracking-widest mb-4">Your Referral Link</p>
        
        <div className="mb-8">
          <div className="bg-[#F9FAFB] border border-gray-100 rounded-2xl p-5 text-gray-500 font-medium">
             {referral.referralCode || 'Referral code not generated yet'}
          </div>
          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
            Generate link to activate
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button className="flex-1 bg-[#15803d] text-white font-bold py-4 rounded-2xl hover:bg-[#166534] transition-colors shadow-lg shadow-green-200">
            Generate Link
          </button>
          <button 
            onClick={copyCode}
            className="flex-1 border border-gray-100 text-gray-400 font-bold py-4 rounded-2xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            {copied ? 'Copied!' : 'Copy link'}
          </button>
        </div>
      </div>

      {referral.referrals?.length > 0 && (
        <div className="mt-10">
          <h3 className="font-bold text-[#111827] mb-4">Your Referrals ({referral.totalReferrals})</h3>
          <div className="space-y-3">
            {referral.referrals.map((ref, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                  <p className="font-bold text-sm text-gray-900">{ref.name}</p>
                  <p className="text-xs text-gray-500">Joined on {new Date(ref.createdAt).toLocaleDateString()}</p>
                </div>
                <Badge status="completed" text="+ ₹500" />
              </div>
            ))}
          </div>
        </div>
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
        {/* Header */}
        <div className="p-8 text-center relative border-b border-gray-50">
          <button onClick={onClose} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-gray-900 transition-all">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
          <h2 className="text-2xl font-black text-[#111827] mb-2">Device Evaluation Report</h2>
          <p className="text-sm font-bold text-gray-400">This is the report that you filled while selling this device.</p>
        </div>

        <div className="p-8 max-h-[70vh] overflow-y-auto no-scrollbar space-y-10">
          {/* Device Evaluation Section */}
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

          {/* Physical Condition Section */}
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

          {/* Technical Condition Section */}
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

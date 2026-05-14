import mongoose from 'mongoose';
import crypto from 'crypto';

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  orderId: {
    type: String,
    unique: true,
    default: () => 'ORD-' + crypto.randomBytes(3).toString('hex').toUpperCase(),
  },
  device: {
    brand: String,
    modelName: String,
    slug: String,
    storage: String,
    deviceAge: String,
    hasScreenIssue: Boolean,
    screenIssues: [String],
    hasBodyIssue: Boolean,
    bodyCondition: String,
    hasOtherIssues: Boolean,
    functionalIssues: [String],
    accessories: [String],
  },
  priceBreakdown: {
    basePrice: { type: Number, default: 0 },
    conditionAdjustment: { type: Number, default: 0 },
    screenAdjustment: { type: Number, default: 0 },
    functionalDeduction: { type: Number, default: 0 },
    accessoriesBonus: { type: Number, default: 0 },
    finalPrice: { type: Number, default: 0 },
  },
  pickup: {
    name: String,
    phone: String,
    email: String,
    pincode: String,
    address: String,
    landmark: String,
    city: String,
    state: String,
    date: String,
    timeSlot: String,
    paymentMethod: String,
  },
  status: {
    type: String,
    enum: ['placed', 'scheduled', 'assigned', 'picked', 'verified', 'payment_initiated', 'completed', 'cancelled'],
    default: 'placed',
  },
  partnerName: {
    type: String,
    default: '',
  },
  partnerPhone: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

orderSchema.index({ userId: 1, createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;

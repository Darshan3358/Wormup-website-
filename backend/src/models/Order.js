import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  variant: { type: String },
  price: { type: Number, required: true }, // Frozen snapshot price at checkout
  subtotal: { type: Number, required: true },
  picked: { type: Boolean, default: false }
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  areaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Area', required: true },
  storeId: { type: String, required: true },
  address: {
    label: String,
    line: String,
    area: String,
    pincode: String
  },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  handlingFee: { type: Number, default: 5 },
  discount: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ['INITIATED', 'PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'],
    default: 'PENDING'
  },
  paymentMethod: { type: String, default: 'UPI' },
  orderStatus: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'PICKING', 'PACKING', 'READY_FOR_PICKUP', 'RIDER_ASSIGNED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'],
    default: 'CONFIRMED'
  },
  estimatedDeliveryMinutes: { type: Number, default: 12 },
  otp: { type: String, required: true },
  riderId: { type: String },
  riderName: { type: String, default: 'Rahul Sharma' }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);

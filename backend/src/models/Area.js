import mongoose from 'mongoose';

const areaSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. Bopal, Satellite
  city: { type: String, required: true, default: 'Ahmedabad' },
  pincode: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  serviceRadiusKm: { type: Number, default: 5 },
  storeId: { type: String, required: true }, // Dark store assigned
  deliveryFee: { type: Number, default: 20 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Area', areaSchema);

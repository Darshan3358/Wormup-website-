import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  description: { type: String },
  images: [{ type: String }],
  unit: { type: String, required: true }, // e.g. 1 kg, 500 g, 1 pc
  variants: [{ type: String }],
  basePrice: { type: Number, required: true },
  freshness: { type: String, default: 'Harvested Today' },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);

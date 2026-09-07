import mongoose from 'mongoose';

/**
 * Core USP Schema: Area-Specific Pricing
 * Guarantees that product pricing is always resolved by area ID
 */
const areaPriceSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  areaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Area', required: true },
  sellingPrice: { type: Number, required: true },
  mrp: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  effectiveFrom: { type: Date, default: Date.now },
  effectiveTo: { type: Date },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' }
}, { timestamps: true });

areaPriceSchema.index({ productId: 1, areaId: 1 }, { unique: true });

export default mongoose.model('AreaPrice', areaPriceSchema);

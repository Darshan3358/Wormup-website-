import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  storeId: { type: String, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  availableQuantity: { type: Number, required: true, default: 0 },
  reservedQuantity: { type: Number, default: 0 },
  lowStockThreshold: { type: Number, default: 10 }
}, { timestamps: true });

inventorySchema.index({ storeId: 1, productId: 1 }, { unique: true });

export default mongoose.model('Inventory', inventorySchema);

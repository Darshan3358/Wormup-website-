import mongoose from 'mongoose';

const emailCampaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  content: { type: String, required: true },
  recipientType: {
    type: String,
    enum: ['ALL_USERS', 'ACTIVE_CUSTOMERS', 'INACTIVE_USERS'],
    default: 'ALL_USERS'
  },
  scheduledAt: { type: Date, required: true },
  status: {
    type: String,
    enum: ['DRAFT', 'SCHEDULED', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED'],
    default: 'SCHEDULED'
  },
  targetCount: { type: Number, default: 0 },
  sentCount: { type: Number, default: 0 },
  errorCount: { type: Number, default: 0 },
  sentAt: { type: Date }
}, { timestamps: true });

export default mongoose.model('EmailCampaign', emailCampaignSchema);

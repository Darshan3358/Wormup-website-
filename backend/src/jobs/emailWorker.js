import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import EmailCampaign from '../models/EmailCampaign.js';

const redisConnection = new IORedis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
  maxRetriesPerRequest: null,
  lazyConnect: true
});

export const emailQueue = new Queue('emailCampaigns', { connection: redisConnection });

/**
 * BullMQ Worker processing scheduled email campaign batches
 */
export const startEmailWorker = () => {
  const worker = new Worker('emailCampaigns', async (job) => {
    const { campaignId } = job.data;
    const campaign = await EmailCampaign.findById(campaignId);
    if (!campaign) return;

    campaign.status = 'PROCESSING';
    await campaign.save();

    console.log(`[BullMQ Worker] Processing scheduled campaign: ${campaign.name} (${campaign.recipientType})`);

    // Simulate batch sending (e.g. 100 emails per batch via AWS SES / SendGrid / Resend)
    const total = campaign.targetCount || 100;
    let sent = 0;

    while (sent < total) {
      sent += Math.min(50, total - sent);
      campaign.sentCount = sent;
      await campaign.save();
      // Simulating rate limit delay
      await new Promise(r => setTimeout(r, 100));
    }

    campaign.status = 'COMPLETED';
    campaign.sentAt = new Date();
    await campaign.save();

    console.log(`[BullMQ Worker] Successfully dispatched ${sent} emails for campaign ${campaign.name}`);
  }, { connection: redisConnection });

  worker.on('failed', (job, err) => {
    console.error(`[BullMQ Worker] Campaign job failed:`, err);
  });

  return worker;
};

/**
 * Cron / Periodic checker to trigger scheduled campaigns when due
 */
export const checkScheduledCampaigns = async () => {
  try {
    const dueCampaigns = await EmailCampaign.find({
      status: 'SCHEDULED',
      scheduledAt: { $lte: new Date() }
    });

    for (const campaign of dueCampaigns) {
      campaign.status = 'PROCESSING';
      await campaign.save();
      await emailQueue.add('sendCampaignBatch', { campaignId: campaign._id });
    }
  } catch (err) {
    console.error('[Email Cron Error]', err);
  }
};

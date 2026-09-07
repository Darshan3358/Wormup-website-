import React, { useState } from 'react';
import { INITIAL_CAMPAIGNS } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import { Icon } from '../common/Icons';

export const ScheduledEmailCampaigns = () => {
  const { showToast } = useApp();
  const [campaigns, setCampaigns] = useState(() => {
    const saved = localStorage.getItem('womup_campaigns');
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  });

  const [isCreating, setIsCreating] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    subject: '',
    content: '',
    recipientType: 'ALL_USERS',
    scheduledDate: '2026-09-08',
    scheduledTime: '10:00'
  });

  const [simulatingId, setSimulatingId] = useState(null);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newCampaign.name || !newCampaign.subject || !newCampaign.content) {
      showToast('Please fill in all campaign fields.', 'warning');
      return;
    }

    const scheduledAt = `${newCampaign.scheduledDate}T${newCampaign.scheduledTime}`;
    const targetCounts = {
      ALL_USERS: 1850,
      ACTIVE_CUSTOMERS: 940,
      INACTIVE_USERS: 910
    };

    const campaign = {
      id: `CMP_${Math.floor(100 + Math.random() * 900)}`,
      name: newCampaign.name,
      subject: newCampaign.subject,
      content: newCampaign.content,
      recipientType: newCampaign.recipientType,
      scheduledAt,
      status: 'SCHEDULED',
      createdAt: new Date().toISOString(),
      sentCount: 0,
      targetCount: targetCounts[newCampaign.recipientType] || 1850
    };

    const updated = [campaign, ...campaigns];
    setCampaigns(updated);
    localStorage.setItem('womup_campaigns', JSON.stringify(updated));
    setIsCreating(false);
    showToast(`Campaign "${campaign.name}" scheduled for ${campaign.scheduledAt}`, 'success');
  };

  // Simulate BullMQ Worker sending emails in batches
  const simulateCampaignDispatch = (campaignId) => {
    setSimulatingId(campaignId);
    showToast(`Worker started: Dispatching queued emails in batches...`, 'info');

    let current = 0;
    const interval = setInterval(() => {
      current += 400;
      setCampaigns(prev => prev.map(c => {
        if (c.id === campaignId) {
          const sent = Math.min(c.targetCount, current);
          const isDone = sent >= c.targetCount;
          if (isDone) clearInterval(interval);
          return {
            ...c,
            status: isDone ? 'COMPLETED' : 'PROCESSING',
            sentCount: sent
          };
        }
        return c;
      }));

      if (current >= 2000) {
        clearInterval(interval);
        setSimulatingId(null);
        showToast('All scheduled batch emails successfully sent and logged!', 'success');
      }
    }, 600);
  };

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF' }}>
            Scheduled Email Campaigns & Cron Worker
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Schedule marketing and offer campaigns by date & time with automated Redis/BullMQ background queue.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="btn-brand"
          style={{ fontSize: '13px', padding: '10px 18px' }}
        >
          <Icon name="mail" size={16} />
          <span>{isCreating ? 'Close Form' : '+ Schedule New Campaign'}</span>
        </button>
      </div>

      {/* Creation Modal / Inline Form */}
      {isCreating && (
        <div 
          className="glass-panel"
          style={{
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            marginBottom: '24px',
            border: '1px solid rgba(124, 58, 237, 0.4)'
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', marginBottom: '16px' }}>
            Create Scheduled Email Campaign
          </h3>

          <form onSubmit={handleCreate}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Campaign Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Navratri Special Discounts"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    color: '#FFFFFF',
                    fontSize: '13px'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Target Recipients
                </label>
                <select
                  value={newCampaign.recipientType}
                  onChange={(e) => setNewCampaign({ ...newCampaign, recipientType: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    color: '#FFFFFF',
                    fontSize: '13px'
                  }}
                >
                  <option value="ALL_USERS">All Users (1,850 subscribers)</option>
                  <option value="ACTIVE_CUSTOMERS">Active Customers (Last 30 days - 940)</option>
                  <option value="INACTIVE_USERS">Inactive Customers (Win-back - 910)</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Email Subject Line
              </label>
              <input
                type="text"
                placeholder="e.g. 🥦 Morning Harvest Alert: Fresh Veggies at 20% off today!"
                value={newCampaign.subject}
                onChange={(e) => setNewCampaign({ ...newCampaign, subject: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  color: '#FFFFFF',
                  fontSize: '13px'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Email Message Content (HTML or Plain text)
              </label>
              <textarea
                rows={4}
                placeholder="Write your email body here. E.g. Hello from Womup! Farm-fresh vegetables are now in stock in your area. Order now for 10-minute delivery."
                value={newCampaign.content}
                onChange={(e) => setNewCampaign({ ...newCampaign, content: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            {/* Date & Time Picker */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '14px',
              background: 'var(--bg-elevated)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-fresh)' }}>
                <Icon name="calendar" size={18} />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>Dispatch Schedule:</span>
              </div>
              <input
                type="date"
                value={newCampaign.scheduledDate}
                onChange={(e) => setNewCampaign({ ...newCampaign, scheduledDate: e.target.value })}
                style={{
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  color: '#FFFFFF',
                  fontSize: '13px'
                }}
              />
              <input
                type="time"
                value={newCampaign.scheduledTime}
                onChange={(e) => setNewCampaign({ ...newCampaign, scheduledTime: e.target.value })}
                style={{
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  color: '#FFFFFF',
                  fontSize: '13px'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="btn-secondary"
                style={{ fontSize: '13px' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                style={{ fontSize: '13px' }}
              >
                Schedule Campaign
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Campaigns Queue Table */}
      <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>
            Campaign Queue & Execution Logs ({campaigns.length})
          </h3>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Cron runs every 60s via BullMQ + Redis
          </span>
        </div>

        <div className="table-responsive">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 18px' }}>Campaign Name</th>
                <th style={{ padding: '12px 18px' }}>Target Audience</th>
                <th style={{ padding: '12px 18px' }}>Scheduled Date / Time</th>
                <th style={{ padding: '12px 18px' }}>Progress & Logs</th>
                <th style={{ padding: '12px 18px' }}>Status</th>
                <th style={{ padding: '12px 18px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map(camp => {
                const percent = Math.round((camp.sentCount / (camp.targetCount || 1)) * 100);

                return (
                  <tr key={camp.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px 18px' }}>
                      <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{camp.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {camp.subject}
                      </div>
                    </td>

                    <td style={{ padding: '12px 18px', color: 'var(--text-secondary)' }}>
                      <span className="badge-tag">
                        {camp.recipientType.replace('_', ' ')}
                      </span>
                    </td>

                    <td style={{ padding: '12px 18px', color: '#FFFFFF' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Icon name="calendar" size={13} color="var(--accent-fresh)" />
                        <span>{new Date(camp.scheduledAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                      </div>
                    </td>

                    {/* Progress */}
                    <td style={{ padding: '12px 18px', minWidth: '160px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                        <span>{camp.sentCount} / {camp.targetCount} sent</span>
                        <span style={{ fontWeight: 700 }}>{percent}%</span>
                      </div>
                      <div style={{ height: '6px', width: '100%', background: 'var(--bg-elevated)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${percent}%`,
                          background: camp.status === 'COMPLETED' ? 'var(--accent-fresh)' : 'var(--accent-primary)',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </td>

                    <td style={{ padding: '12px 18px' }}>
                      {camp.status === 'COMPLETED' ? (
                        <span className="badge-fresh" style={{ fontSize: '10px' }}>Sent</span>
                      ) : camp.status === 'PROCESSING' ? (
                        <span style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#38BDF8', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700 }}>
                          Dispatching...
                        </span>
                      ) : (
                        <span style={{ background: 'rgba(124, 58, 237, 0.15)', color: '#D8B4FE', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700 }}>
                          Scheduled
                        </span>
                      )}
                    </td>

                    <td style={{ padding: '12px 18px' }}>
                      {camp.status !== 'COMPLETED' && (
                        <button
                          onClick={() => simulateCampaignDispatch(camp.id)}
                          disabled={simulatingId === camp.id}
                          style={{
                            background: 'rgba(16, 185, 129, 0.15)',
                            border: '1px solid var(--accent-fresh)',
                            color: 'var(--accent-fresh)',
                            padding: '4px 10px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 700
                          }}
                        >
                          {simulatingId === camp.id ? 'Sending...' : 'Trigger Now'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, CheckCircle2, Smartphone, ArrowRight } from 'lucide-react';
import { OLD_PHONE_MODELS } from '../data/products';

export default function TradeInModal({ isOpen, onClose, onApplyDiscount }) {
  const [selectedDeviceIndex, setSelectedDeviceIndex] = useState(0);
  const [condition, setCondition] = useState('good');
  const [isCalculated, setIsCalculated] = useState(false);

  if (!isOpen) return null;

  const currentDevice = OLD_PHONE_MODELS[selectedDeviceIndex];

  // Calculate value multiplier based on condition
  const multiplier = condition === 'flawless' ? 1.0 : condition === 'good' ? 0.85 : 0.65;
  const estimatedValue = Math.round(currentDevice.maxValue * multiplier);

  const handleApply = () => {
    onApplyDiscount(estimatedValue, `${currentDevice.brand} ${currentDevice.model}`);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <Smartphone style={{ color: 'var(--accent-cyan)' }} size={24} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
            Instant Device Exchange Valuation
          </h2>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Select your current phone brand & model to get an instant GMC trade-in quote.
        </p>

        {/* Device Selection */}
        <div className="form-group">
          <label className="form-label">Select Your Existing Device</label>
          <select
            className="form-select"
            value={selectedDeviceIndex}
            onChange={(e) => {
              setSelectedDeviceIndex(Number(e.target.value));
              setIsCalculated(false);
            }}
          >
            {OLD_PHONE_MODELS.map((item, idx) => (
              <option key={idx} value={idx}>
                {item.brand} - {item.model} (Max Up to ₹{item.maxValue.toLocaleString('en-IN')})
              </option>
            ))}
          </select>
        </div>

        {/* Condition Selection */}
        <div className="form-group">
          <label className="form-label">Physical & Operational Condition</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            {[
              { id: 'flawless', label: 'Flawless', desc: 'No scratches, 100% working' },
              { id: 'good', label: 'Good', desc: 'Minor scuffs, fully functional' },
              { id: 'fair', label: 'Fair', desc: 'Screen glass scratches/dents' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                className={`brand-card ${condition === item.id ? 'active' : ''}`}
                style={{ padding: '0.75rem 0.5rem', textAlign: 'left' }}
                onClick={() => {
                  setCondition(item.id);
                  setIsCalculated(false);
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                  {item.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Valuation Result Box */}
        <div
          style={{
            background: 'rgba(0, 240, 255, 0.06)',
            border: '1px solid rgba(0, 240, 255, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            margin: '1.5rem 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Estimated Trade-in Valuation
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
              ₹{estimatedValue.toLocaleString('en-IN')}
            </div>
          </div>
          <button className="btn-primary" onClick={handleApply}>
            Apply Credit to Cart <ArrowRight size={16} style={{ marginLeft: 6 }} />
          </button>
        </div>

        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textAlign: 'center' }}>
          * Final valuation confirmed upon physical verification at Gagan Mobile Care store.
        </div>
      </div>
    </div>
  );
}

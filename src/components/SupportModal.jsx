import React, { useState } from 'react';
import { X, MapPin, Phone, Shield, Wrench, Clock, CheckCircle } from 'lucide-react';

export default function SupportModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('contact'); // 'contact', 'repair', 'warranty'
  const [repairCode, setRepairCode] = useState('');
  const [repairStatusResult, setRepairStatusResult] = useState(null);

  if (!isOpen) return null;

  const handleCheckRepair = (e) => {
    e.preventDefault();
    setRepairStatusResult({
      code: repairCode || 'REP-9921',
      device: 'iPhone 13 Pro',
      status: 'Display Replacement Completed - Ready for Pickup',
      cost: '₹4,500',
      date: '2026-08-26'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
        <button className="modal-close" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="flex items-center gap-3.5 mb-3">
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.35)]">
            <img
              src="/gmc_logo.jpg"
              alt="Gagan Mobile Care Maur"
              className="h-full w-full object-cover scale-110"
            />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '0.15rem' }}>
              Gagan Mobile Care
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Official Store • Maur Mandi (Ph: +91 98726-22624)
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
          {[
            { id: 'contact', label: 'Store Location & Info', icon: MapPin },
            { id: 'repair', label: 'Repair Status', icon: Wrench },
            { id: 'warranty', label: 'Warranty Check', icon: Shield }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`brand-card ${activeTab === tab.id ? 'active' : ''}`}
                style={{ padding: '0.6rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={14} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content 1: Contact & Store */}
        {activeTab === 'contact' && (
          <div style={{ background: '#131b2b', borderRadius: 'var(--radius-md)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <MapPin style={{ color: 'var(--accent-cyan)', marginTop: 3 }} size={20} />
              <div>
                <strong style={{ color: '#fff', fontSize: '0.95rem' }}>Gagan Mobile Care - Maur Mandi</strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Main Market, Maur Mandi, Dist. Bathinda, Punjab - 151509
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <Phone style={{ color: 'var(--accent-cyan)', marginTop: 3 }} size={20} />
              <div>
                <strong style={{ color: '#fff', fontSize: '0.95rem' }}>Phone & WhatsApp Support</strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <a href="tel:+919872622624" className="text-amber-400 font-bold hover:underline">
                    +91 98726-22624
                  </a>{' '}
                  (Store Hours: 10:00 AM - 9:00 PM)
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <Clock style={{ color: 'var(--accent-cyan)', marginTop: 3 }} size={20} />
              <div>
                <strong style={{ color: '#fff', fontSize: '0.95rem' }}>Store Timings</strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Open All 7 Days: 10:00 AM to 9:30 PM
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 2: Repair Status */}
        {activeTab === 'repair' && (
          <div>
            <form onSubmit={handleCheckRepair} className="form-group" style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Enter Repair Ticket Number (e.g. REP-9921)"
                value={repairCode}
                onChange={(e) => setRepairCode(e.target.value)}
                required
              />
              <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
                Track
              </button>
            </form>

            {repairStatusResult && (
              <div style={{ background: '#131b2b', borderRadius: 'var(--radius-md)', padding: '1.25rem', border: '1px solid var(--accent-cyan)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: '0.5rem' }}>
                  <CheckCircle size={18} /> {repairStatusResult.status}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <div>Device: <strong>{repairStatusResult.device}</strong></div>
                  <div>Ticket ID: <strong>{repairStatusResult.code}</strong></div>
                  <div>Repair Estimate: <strong>{repairStatusResult.cost}</strong></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab Content 3: Warranty */}
        {activeTab === 'warranty' && (
          <div style={{ background: '#131b2b', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              All phones purchased from Gagan Mobile Care include 100% official brand warranty + complimentary 1-Year GMC Screen Protect Coverage.
            </p>
            <div className="form-group">
              <label className="form-label">IMEI or Serial Number</label>
              <input type="text" className="form-input" placeholder="Enter 15-digit IMEI number" />
            </div>
            <button className="btn-primary" style={{ width: '100%' }}>Verify GMC Warranty</button>
          </div>
        )}
      </div>
    </div>
  );
}

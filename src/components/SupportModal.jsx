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
      <div className="modal-card w-full max-w-[620px] p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} title="Close">
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 overflow-hidden rounded-full border-2 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.35)]">
            <img
              src="/gmc_logo.jpg"
              alt="Gagan Mobile Care Maur"
              className="h-full w-full object-cover scale-110"
            />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white">
              Gagan Mobile Care
            </h2>
            <p className="text-xs text-gray-400">
              Official Store • Maur Mandi (Ph: +91 98726-22624)
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { id: 'contact', label: 'Store & Location', icon: MapPin },
            { id: 'repair', label: 'Repair Status', icon: Wrench },
            { id: 'warranty', label: 'Warranty Check', icon: Shield }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                  isActive
                    ? 'border-cyan-400 bg-cyan-500/10 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                    : 'border-white/10 bg-white/5 text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Store Contact & Location */}
        {activeTab === 'contact' && (
          <div className="space-y-3.5 text-xs sm:text-sm">
            <div className="bg-[#131b2b] p-3.5 sm:p-4 rounded-xl border border-white/5">
              <div className="text-white font-bold mb-1 flex items-center gap-1.5">
                <MapPin size={16} className="text-cyan-400" />
                <span>Retail Counter Address</span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">
                Main Market Road, Near City Bus Stand & Clock Tower, Maur Mandi, Bathinda District, Punjab - 151509
              </p>
            </div>

            <div className="bg-[#131b2b] p-3.5 sm:p-4 rounded-xl border border-white/5">
              <div className="text-white font-bold mb-1 flex items-center gap-1.5">
                <Phone size={16} className="text-cyan-400" />
                <span>Call & WhatsApp Helpline</span>
              </div>
              <p className="text-gray-400 text-xs mb-2">
                Talk directly to store owner Gagan for orders, stock inquiry, or live repair updates:
              </p>
              <div className="flex flex-wrap gap-2">
                <a
                  href="tel:9872622624"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-400 text-black px-3 py-1.5 font-bold text-xs shadow-md"
                >
                  <Phone size={13} /> Call 98726-22624
                </a>
                <a
                  href="https://wa.me/919872622624"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 text-white px-3 py-1.5 font-bold text-xs shadow-md"
                >
                  💬 WhatsApp Us
                </a>
              </div>
            </div>

            <div className="bg-[#131b2b] p-3.5 sm:p-4 rounded-xl border border-white/5">
              <div className="text-white font-bold mb-1 flex items-center gap-1.5">
                <Clock size={16} className="text-cyan-400" />
                <span>Working Hours</span>
              </div>
              <p className="text-gray-400 text-xs">
                Monday to Sunday: <strong>9:30 AM - 9:00 PM</strong> (Open 7 Days a week)
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Repair Status Tracker */}
        {activeTab === 'repair' && (
          <div className="space-y-4">
            <form onSubmit={handleCheckRepair} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Enter Repair Job Sheet / Token Number:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. REP-7731 or Mobile Number"
                    value={repairCode}
                    onChange={(e) => setRepairCode(e.target.value)}
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs sm:text-sm text-white focus:border-cyan-400 focus:outline-none"
                    required
                  />
                  <button type="submit" className="btn-primary px-4 py-2 text-xs font-bold shrink-0">
                    Track Status
                  </button>
                </div>
              </div>
            </form>

            {repairStatusResult && (
              <div className="bg-[#131b2b] p-4 rounded-xl border border-cyan-400/30 text-xs sm:text-sm animate-in fade-in">
                <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
                  <CheckCircle size={16} />
                  <span>Job #{repairStatusResult.code} Found</span>
                </div>
                <div className="space-y-1 text-gray-300 text-xs">
                  <div>📱 Device: <strong>{repairStatusResult.device}</strong></div>
                  <div>🔧 Status: <strong className="text-cyan-300">{repairStatusResult.status}</strong></div>
                  <div>💰 Service Estimate: <strong>{repairStatusResult.cost}</strong></div>
                  <div>📅 Updated: <strong>{repairStatusResult.date}</strong></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Warranty Checker */}
        {activeTab === 'warranty' && (
          <div className="bg-[#131b2b] p-4 rounded-xl border border-white/5 text-xs sm:text-sm space-y-2">
            <div className="text-white font-bold flex items-center gap-1.5">
              <Shield size={16} className="text-amber-400" />
              <span>GMC Genuine Warranty Shield</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              All smartphones sold at Gagan Mobile Care include 1-Year Official Brand Manufacturer Warranty with GST invoice.
            </p>
            <div className="pt-2 text-xs text-gray-300">
              Need assistance with official brand service centers in Bathinda / Mansa? Bring your GMC tax bill to our store for priority support!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

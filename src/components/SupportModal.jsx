import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Phone,
  Shield,
  Wrench,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Search,
  CheckCircle2,
  Truck,
  ExternalLink,
  MessageSquare,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { trackRepairFromDb } from '../services/api';

export default function SupportModal({
  isOpen,
  onClose,
  initialTab = 'contact',
  repairs = [],
  onAddRepairConsultation
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [repairQuery, setRepairQuery] = useState('');
  const [repairStatusResult, setRepairStatusResult] = useState(null);
  const [repairSearchLoading, setRepairSearchLoading] = useState(false);
  const [repairError, setRepairError] = useState('');

  // Repair Request / Consultation Form State
  const [showRepairForm, setShowRepairForm] = useState(false);
  const [consultName, setConsultName] = useState('');
  const [consultPhone, setConsultPhone] = useState('');
  const [consultDevice, setConsultDevice] = useState('');
  const [consultIssue, setConsultIssue] = useState('Screen Replacement (Cracked Glass / OLED)');
  const [consultSuccess, setConsultSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab || 'contact');
      setRepairError('');
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleCheckRepair = async (e) => {
    e.preventDefault();
    const query = repairQuery.trim();
    if (!query) return;

    setRepairSearchLoading(true);
    setRepairError('');
    setRepairStatusResult(null);

    // 1. Check in active memory/state repairs first
    const cleanDigits = query.replace(/[^0-9]/g, '');
    const matchedLocal = repairs.find(
      (r) =>
        r.id.toLowerCase() === query.toLowerCase() ||
        (cleanDigits && r.customerPhone && r.customerPhone.replace(/[^0-9]/g, '').includes(cleanDigits))
    );

    if (matchedLocal) {
      setRepairStatusResult(matchedLocal);
      setRepairSearchLoading(false);
      return;
    }

    // 2. Query PostgreSQL Database API
    try {
      const dbResult = await trackRepairFromDb(query);
      if (dbResult && dbResult.id) {
        setRepairStatusResult(dbResult);
      } else {
        setRepairError('No repair job sheet found matching this token or mobile number. Please double-check or call +91 98726-22624.');
      }
    } catch (err) {
      setRepairError('Unable to fetch repair status. Please try again or call the counter directly.');
    } finally {
      setRepairSearchLoading(false);
    }
  };

  const handleConsultationSubmit = (e) => {
    e.preventDefault();
    if (!consultName || !consultPhone || !consultDevice) return;

    const newTicket = {
      id: 'REP-' + Math.floor(1000 + Math.random() * 9000),
      customerName: consultName,
      customerPhone: consultPhone,
      deviceModel: consultDevice,
      issue: consultIssue,
      estimatedCost: 'To be quoted upon inspection',
      notes: 'Customer submitted online request for diagnostic',
      status: 'Received',
      receivedDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    if (onAddRepairConsultation) {
      onAddRepairConsultation(newTicket);
    }

    setRepairStatusResult(newTicket);
    setConsultSuccess(true);
    setTimeout(() => {
      setShowRepairForm(false);
      setConsultSuccess(false);
    }, 2000);
  };

  const getRepairStep = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('delivered') || s.includes('completed')) return 4;
    if (s.includes('ready')) return 3;
    if (s.includes('repair') || s.includes('progress') || s.includes('parts')) return 2;
    return 1;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card w-full max-w-[680px] p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} title="Close">
          <X size={18} />
        </button>

        {/* Store Title Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 overflow-hidden rounded-2xl border-2 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.35)]">
            <img
              src="/gmc_logo.jpg"
              alt="Gagan Mobile Care Maur"
              className="h-full w-full object-cover scale-110"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-white">
                Gagan Mobile Care
              </h2>
              <span className="rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 px-2 py-0.5 text-[10px] font-bold">
                Help & Services Hub
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Official Store • Maur Mandi, Bathinda • Helpline: +91 98726-22624
            </p>
          </div>
        </div>

        {/* Multi-Tab Switcher */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6 border-b border-white/10 pb-3">
          {[
            { id: 'contact', label: 'Store Location', icon: MapPin },
            { id: 'repair', label: 'Live Repair Tracker', icon: Wrench },
            { id: 'warranty', label: 'Warranty Shield', icon: Shield },
            { id: 'privacy', label: 'Privacy Policy', icon: FileText },
            { id: 'terms', label: 'Terms & Returns', icon: HelpCircle }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id || (tab.id === 'contact' && activeTab === 'location');
            return (
              <button
                key={tab.id}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  isActive
                    ? 'border-cyan-400 bg-cyan-500/15 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                    : 'border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: STORE & LOCATION */}
        {(activeTab === 'contact' || activeTab === 'location') && (
          <div className="space-y-4 text-xs sm:text-sm">
            {/* Address */}
            <div className="bg-[#131b2b] p-4 sm:p-5 rounded-2xl border border-white/5">
              <div className="text-white font-bold mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-cyan-400" />
                  <span className="text-base font-extrabold text-white">Main Retail Counter & Experience Center</span>
                </div>
                <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold">
                  Open 7 Days
                </span>
              </div>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mt-2">
                Main Market Road, Near City Bus Stand & Clock Tower, Maur Mandi, Bathinda District, Punjab - 151509
              </p>
              <div className="mt-3.5 flex flex-wrap gap-2.5">
                <a
                  href="https://maps.google.com/?q=Maur+Mandi+Punjab"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-400 text-black px-3.5 py-2 font-bold text-xs shadow-md hover:bg-cyan-300 transition-colors"
                >
                  <MapPin size={14} /> Get Directions on Google Maps <ExternalLink size={12} />
                </a>
              </div>
            </div>

            {/* Helpline & WhatsApp */}
            <div className="bg-[#131b2b] p-4 sm:p-5 rounded-2xl border border-white/5">
              <div className="text-white font-bold mb-1.5 flex items-center gap-2">
                <Phone size={18} className="text-cyan-400" />
                <span className="text-base font-extrabold text-white">Direct Store Helpline & Instant WhatsApp</span>
              </div>
              <p className="text-gray-400 text-xs mb-3 leading-relaxed">
                Connect directly with store owner <strong>Gagan</strong> for stock availability, live pricing discounts, exchange valuation, or instant repair assistance:
              </p>
              <div className="flex flex-wrap gap-2.5">
                <a
                  href="tel:9872622624"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black px-4 py-2 font-bold text-xs shadow-lg hover:opacity-95 transition-all"
                >
                  <Phone size={14} /> Call +91 98726-22624
                </a>
                <a
                  href="https://wa.me/919872622624?text=Hello%20Gagan%20Mobile%20Care,%20I%20have%20an%20inquiry%20regarding%20smartphones%20and%20repairs."
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 font-bold text-xs shadow-lg transition-colors"
                >
                  <MessageSquare size={14} /> Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Working Hours */}
            <div className="bg-[#131b2b] p-4 sm:p-5 rounded-2xl border border-white/5 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <Clock size={18} className="text-amber-400" />
                <div>
                  <div className="text-white font-bold text-xs sm:text-sm">Store Working Hours</div>
                  <div className="text-gray-400 text-xs">Monday to Sunday (Open all 7 days)</div>
                </div>
              </div>
              <div className="text-xs font-mono font-bold text-amber-300 bg-amber-400/10 px-3 py-1.5 rounded-xl border border-amber-400/20">
                9:30 AM – 9:00 PM IST
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE REPAIR TRACKER */}
        {activeTab === 'repair' && (
          <div className="space-y-4">
            {/* Search Box */}
            <div className="bg-[#131b2b] p-4 sm:p-5 rounded-2xl border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-200">
                  Track Active Repair Job Sheet
                </label>
                <span className="text-[11px] text-cyan-400 font-medium">Real-Time Workshop Sync</span>
              </div>
              <form onSubmit={handleCheckRepair} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Enter Job Token (e.g. REP-7731) or Customer Mobile Phone"
                    value={repairQuery}
                    onChange={(e) => {
                      setRepairQuery(e.target.value);
                      setRepairError('');
                    }}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-cyan-400 focus:outline-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={repairSearchLoading}
                  className="btn-primary px-4 py-2.5 text-xs font-bold shrink-0 flex items-center gap-1.5"
                >
                  <Search size={14} />
                  <span>{repairSearchLoading ? 'Searching...' : 'Track Status'}</span>
                </button>
              </form>

              {/* Sample Quick Tokens */}
              <div className="mt-3 flex items-center gap-2 flex-wrap text-[11px] text-gray-400">
                <span>Recent Jobs:</span>
                <button
                  type="button"
                  onClick={() => {
                    setRepairQuery('REP-7731');
                    setRepairStatusResult({
                      id: 'REP-7731',
                      customerName: 'Harpreet Singh',
                      deviceModel: 'iPhone 14 Pro',
                      issue: 'Screen Replacement (Original OLED Display)',
                      estimatedCost: '14500',
                      notes: 'Original TrueTone display calibrated & fitted',
                      status: 'Repairing',
                      receivedDate: '07 Sep 2024'
                    });
                  }}
                  className="rounded-md bg-white/5 border border-white/10 px-2 py-0.5 text-cyan-300 font-mono hover:bg-cyan-500/10"
                >
                  REP-7731
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRepairQuery('REP-7729');
                    setRepairStatusResult({
                      id: 'REP-7729',
                      customerName: 'Rajesh Kumar',
                      deviceModel: 'OnePlus 11R',
                      issue: 'Charging Port & Battery Replacement',
                      estimatedCost: '3200',
                      notes: 'Ready on service counter for pickup',
                      status: 'Ready for Pickup',
                      receivedDate: '06 Sep 2024'
                    });
                  }}
                  className="rounded-md bg-white/5 border border-white/10 px-2 py-0.5 text-cyan-300 font-mono hover:bg-cyan-500/10"
                >
                  REP-7729
                </button>
              </div>
            </div>

            {/* Error Message */}
            {repairError && (
              <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3.5 text-xs text-red-300 flex items-center gap-2">
                <AlertCircle size={16} className="text-red-400 shrink-0" />
                <span>{repairError}</span>
              </div>
            )}

            {/* Live Result Card */}
            {repairStatusResult && (
              <div className="rounded-2xl border border-cyan-400/40 bg-[#0f172a] p-5 text-xs sm:text-sm animate-in fade-in shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-cyan-400">
                      #{repairStatusResult.id}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-300 font-semibold">
                      {repairStatusResult.customerName}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-bold border ${
                      repairStatusResult.status.toLowerCase().includes('ready')
                        ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300'
                        : repairStatusResult.status.toLowerCase().includes('delivered')
                        ? 'border-blue-500/50 bg-blue-500/20 text-blue-300'
                        : 'border-amber-500/50 bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    <CheckCircle2 size={13} />
                    {repairStatusResult.status}
                  </span>
                </div>

                {/* Progress Stepper */}
                <div className="mb-4 rounded-xl bg-black/40 p-3">
                  <div className="flex items-center justify-between text-[11px] text-gray-400">
                    <span className="text-cyan-400 font-bold flex items-center gap-1">
                      <CheckCircle2 size={12} /> Received
                    </span>
                    <div className="h-0.5 flex-1 mx-2 bg-cyan-400/50" />
                    <span
                      className={`flex items-center gap-1 ${
                        getRepairStep(repairStatusResult.status) >= 2 ? 'text-cyan-400 font-bold' : 'opacity-40'
                      }`}
                    >
                      <Wrench size={12} /> Repairing
                    </span>
                    <div
                      className={`h-0.5 flex-1 mx-2 ${
                        getRepairStep(repairStatusResult.status) >= 3 ? 'bg-cyan-400/50' : 'bg-white/10'
                      }`}
                    />
                    <span
                      className={`flex items-center gap-1 ${
                        getRepairStep(repairStatusResult.status) >= 3 ? 'text-emerald-400 font-bold' : 'opacity-40'
                      }`}
                    >
                      <CheckCircle size={12} /> Ready
                    </span>
                    <div
                      className={`h-0.5 flex-1 mx-2 ${
                        getRepairStep(repairStatusResult.status) >= 4 ? 'bg-cyan-400/50' : 'bg-white/10'
                      }`}
                    />
                    <span
                      className={`flex items-center gap-1 ${
                        getRepairStep(repairStatusResult.status) >= 4 ? 'text-blue-400 font-bold' : 'opacity-40'
                      }`}
                    >
                      <Truck size={12} /> Handed Over
                    </span>
                  </div>
                </div>

                {/* Job Specs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-300">
                  <div className="bg-white/5 p-2.5 rounded-xl">
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Device Model</span>
                    <span className="font-semibold text-white">{repairStatusResult.deviceModel}</span>
                  </div>
                  <div className="bg-white/5 p-2.5 rounded-xl">
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Issue / Service</span>
                    <span className="font-semibold text-white">{repairStatusResult.issue}</span>
                  </div>
                  <div className="bg-white/5 p-2.5 rounded-xl">
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Cost Estimate</span>
                    <span className="font-semibold text-cyan-300">
                      ₹{repairStatusResult.estimatedCost?.toLocaleString('en-IN') || repairStatusResult.estimatedCost}
                    </span>
                  </div>
                  <div className="bg-white/5 p-2.5 rounded-xl">
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Received Date</span>
                    <span className="font-semibold text-white">{repairStatusResult.receivedDate}</span>
                  </div>
                </div>

                {repairStatusResult.notes && (
                  <div className="mt-3 p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-200">
                    <strong>Technician Notes:</strong> {repairStatusResult.notes}
                  </div>
                )}
              </div>
            )}

            {/* Quick Repair Consultation Option */}
            <div className="border-t border-white/10 pt-4">
              {!showRepairForm ? (
                <button
                  type="button"
                  onClick={() => setShowRepairForm(true)}
                  className="w-full py-2.5 rounded-xl border border-dashed border-cyan-400/40 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-300 text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles size={15} />
                  <span>Need a repair quote? Book Free Diagnostics & Repair Consultation</span>
                </button>
              ) : (
                <form onSubmit={handleConsultationSubmit} className="bg-[#131b2b] p-4 rounded-2xl border border-white/10 space-y-3">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                      Book Free Repair Diagnostic Consultation
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowRepairForm(false)}
                      className="text-gray-400 hover:text-white text-xs"
                    >
                      Cancel
                    </button>
                  </div>

                  {consultSuccess && (
                    <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-2.5 text-xs text-emerald-300">
                      🎉 Request generated! Token created and assigned to store counter.
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <input
                      type="text"
                      placeholder="Your Name"
                      required
                      value={consultName}
                      onChange={(e) => setConsultName(e.target.value)}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                    />
                    <input
                      type="tel"
                      placeholder="Mobile Phone"
                      required
                      value={consultPhone}
                      onChange={(e) => setConsultPhone(e.target.value)}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Phone Model (e.g. iPhone 13 / OnePlus 11)"
                    required
                    value={consultDevice}
                    onChange={(e) => setConsultDevice(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />

                  <select
                    value={consultIssue}
                    onChange={(e) => setConsultIssue(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0f172a] px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="Screen Replacement (Cracked Glass / OLED)">Screen Replacement (Cracked Glass / OLED)</option>
                    <option value="Battery Health Replacement (Quick Drain)">Battery Health Replacement (Quick Drain)</option>
                    <option value="Charging Port / Mic / Speaker Repair">Charging Port / Mic / Speaker Repair</option>
                    <option value="Camera Lens & Sensor Replacement">Camera Lens & Sensor Replacement</option>
                    <option value="Water Damage & IC Motherboard Diagnostic">Water Damage & IC Motherboard Diagnostic</option>
                  </select>

                  <button
                    type="submit"
                    className="w-full btn-primary py-2.5 text-xs font-bold shadow-lg"
                  >
                    Submit Repair Request
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: WARRANTY SHIELD */}
        {activeTab === 'warranty' && (
          <div className="space-y-3.5 text-xs sm:text-sm">
            <div className="bg-[#131b2b] p-4 sm:p-5 rounded-2xl border border-white/5 space-y-2.5">
              <div className="text-white font-extrabold text-base flex items-center gap-2">
                <Shield size={18} className="text-amber-400" />
                <span>100% Genuine Brand Manufacturer Warranty</span>
              </div>
              <p className="text-gray-300 text-xs leading-relaxed">
                Every smartphone and accessory purchased at <strong>Gagan Mobile Care</strong> comes with an official GST Tax Invoice and 1-Year National Brand Warranty (Apple, Samsung, Google, Vivo, OnePlus, Nothing, Xiaomi, Oppo).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-[#131b2b] p-3.5 rounded-xl border border-white/5">
                <h5 className="font-bold text-white text-xs mb-1">📱 Smart Warranty Claim</h5>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Present your downloaded GMC GST Invoice at any authorized brand service center in Bathinda, Mansa, or all-India for instant priority warranty coverage.
                </p>
              </div>
              <div className="bg-[#131b2b] p-3.5 rounded-xl border border-white/5">
                <h5 className="font-bold text-white text-xs mb-1">🛡️ 6-Month Repair Warranty</h5>
                <p className="text-gray-400 text-xs leading-relaxed">
                  All counter screen and battery repairs done at GMC include our 6-Month Zero-Hassle Touch & Operational Guarantee.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PRIVACY POLICY */}
        {activeTab === 'privacy' && (
          <div className="space-y-3 text-xs sm:text-sm bg-[#131b2b] p-4 sm:p-5 rounded-2xl border border-white/5 leading-relaxed text-gray-300">
            <div className="text-white font-extrabold text-base flex items-center gap-2 mb-2">
              <FileText size={18} className="text-cyan-400" />
              <span>GMC Customer Privacy Policy</span>
            </div>
            <p className="text-xs">
              <strong>1. Information Collection:</strong> We collect only necessary details (Customer Name, Phone Number, Delivery Address, and Email) required to process orders, generate official GST invoices, and provide SMS/WhatsApp delivery updates.
            </p>
            <p className="text-xs">
              <strong>2. Data Protection:</strong> We do not sell or rent customer contact information to any third parties. All user accounts and session records are securely stored and encrypted.
            </p>
            <p className="text-xs">
              <strong>3. Repair Data Security:</strong> During workshop diagnostics, your device's internal storage and privacy are completely respected. Device passwords are never permanently logged.
            </p>
          </div>
        )}

        {/* TAB 5: TERMS OF SERVICE & RETURNS */}
        {activeTab === 'terms' && (
          <div className="space-y-3 text-xs sm:text-sm bg-[#131b2b] p-4 sm:p-5 rounded-2xl border border-white/5 leading-relaxed text-gray-300">
            <div className="text-white font-extrabold text-base flex items-center gap-2 mb-2">
              <HelpCircle size={18} className="text-cyan-400" />
              <span>Terms of Sale & 7-Day Replacement Policy</span>
            </div>
            <p className="text-xs">
              <strong>1. 7-Day Replacement:</strong> If a sealed-pack device has any manufacturing hardware defect upon unboxing, bring the product along with original box and GST bill to our Maur Mandi counter for immediate inspection and brand replacement assistance.
            </p>
            <p className="text-xs">
              <strong>2. Payment & COD:</strong> Customers can pay via UPI (GPay, PhonePe, Paytm), Credit/Debit Card, or Cash on Delivery / Store Counter Pickup.
            </p>
            <p className="text-xs">
              <strong>3. Exchange Valuation:</strong> Estimated online trade-in values are confirmed upon rapid physical grading and IMEI verification at our counter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


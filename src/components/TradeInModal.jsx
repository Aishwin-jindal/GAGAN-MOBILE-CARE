import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Smartphone, ArrowRight, Sparkles, Send, Tag } from 'lucide-react';
import { OLD_PHONE_MODELS } from '../data/products';

export default function TradeInModal({
  isOpen,
  onClose,
  onApplyDiscount,
  currentUser,
  onSubmitTradeInLead
}) {
  const [selectedDeviceIndex, setSelectedDeviceIndex] = useState(0);
  const [condition, setCondition] = useState('good');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [targetDevice, setTargetDevice] = useState('New Smartphone Upgrade');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.name) setCustomerName(currentUser.name);
      if (currentUser.phone) setCustomerPhone(currentUser.phone);
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const currentDevice = OLD_PHONE_MODELS[selectedDeviceIndex] || OLD_PHONE_MODELS[0];

  // Calculate value multiplier based on condition
  const multiplier = condition === 'flawless' ? 1.0 : condition === 'good' ? 0.85 : 0.65;
  const estimatedValue = Math.round(currentDevice.maxValue * multiplier);

  const handleApplyToCart = () => {
    onApplyDiscount(estimatedValue, `${currentDevice.brand} ${currentDevice.model}`);
    onClose();
  };

  const handleSubmitLead = (e) => {
    e.preventDefault();
    const lead = {
      id: 'EXC-' + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      customerName: customerName || currentUser?.name || 'Customer',
      customerPhone: customerPhone || currentUser?.phone || '+91 98726-22624',
      deviceName: `${currentDevice.brand} ${currentDevice.model}`,
      condition: condition === 'flawless' ? 'Flawless (Mint)' : condition === 'good' ? 'Good (Minor Scratches)' : 'Fair (Scuffed / Dented)',
      estimatedValue: estimatedValue,
      targetDevice: targetDevice || 'Store Purchase',
      status: 'Pending Review'
    };

    if (onSubmitTradeInLead) {
      onSubmitTradeInLead(lead);
    }

    setIsSubmitted(true);
    setTimeout(() => {
      onApplyDiscount(estimatedValue, `${currentDevice.brand} ${currentDevice.model}`);
      setIsSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card w-full max-w-xl p-5 sm:p-7 rounded-3xl" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} title="Close">
          <X size={18} />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
            <Smartphone size={22} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">
              Instant Device Exchange Valuation
            </h2>
            <p className="text-xs text-gray-400">
              Get the highest market trade-in credit for your old phone at GMC
            </p>
          </div>
        </div>

        {isSubmitted && (
          <div className="my-3 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-3.5 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
            <span>Exchange lead submitted! Your ₹{estimatedValue.toLocaleString('en-IN')} credit is now applied to cart.</span>
          </div>
        )}

        <form onSubmit={handleSubmitLead} className="space-y-4 mt-4">
          {/* Device Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
              1. Select Your Existing Device Model
            </label>
            <select
              className="w-full rounded-xl border border-white/10 bg-[#0f172a] px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-cyan-400 focus:outline-none"
              value={selectedDeviceIndex}
              onChange={(e) => setSelectedDeviceIndex(Number(e.target.value))}
            >
              {OLD_PHONE_MODELS.map((item, idx) => (
                <option key={idx} value={idx}>
                  {item.brand} - {item.model} (Max Up to ₹{item.maxValue.toLocaleString('en-IN')})
                </option>
              ))}
            </select>
          </div>

          {/* Condition Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
              2. Physical & Working Condition
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { id: 'flawless', label: 'Flawless', desc: 'No scratches, 100% working' },
                { id: 'good', label: 'Good', desc: 'Minor scuffs, fully functional' },
                { id: 'fair', label: 'Fair', desc: 'Screen scratches / body scuffs' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`rounded-2xl border p-2.5 sm:p-3 text-left transition-all ${
                    condition === item.id
                      ? 'border-cyan-400 bg-cyan-500/15 text-white shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                      : 'border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                  onClick={() => setCondition(item.id)}
                >
                  <div className="text-xs font-bold text-white mb-0.5">{item.label}</div>
                  <div className="text-[10px] text-gray-400 leading-tight">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Valuation Result Box */}
          <div className="rounded-2xl border border-cyan-400/40 bg-gradient-to-r from-cyan-950/40 to-blue-950/40 p-4 sm:p-5 flex items-center justify-between shadow-lg">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-cyan-300">
                Estimated Trade-In Credit
              </div>
              <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono mt-0.5">
                ₹{estimatedValue.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-gray-400 mt-0.5">
                Instant discount on your cart total
              </div>
            </div>

            <button
              type="button"
              onClick={handleApplyToCart}
              className="btn-primary py-2.5 px-4 text-xs font-bold flex items-center gap-1.5 shadow-md hover:scale-105 transition-all"
            >
              <span>Apply to Cart</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Lead Contact Info for Store Followup */}
          <div className="border-t border-white/10 pt-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
              Reserve Exchange Price at Maur Mandi Counter:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Your Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div className="mt-2 flex gap-2">
              <button
                type="submit"
                className="w-full rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white py-2 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Send size={13} className="text-cyan-400" />
                <span>Submit Lead & Lock Exchange Rate</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}


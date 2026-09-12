import React, { useState } from 'react';
import { STORE_OFFERS, SPECIAL_PERKS } from '../data/offers';
import { Check, Copy, Tag, Sparkles, Flame, ArrowRight, Gift } from 'lucide-react';

export default function LatestOffers({ onApplyOffer, onOpenCart }) {
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopyCode = (code, offer) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).catch(() => {});
      }
    } catch (e) {}

    setCopiedCode(code);
    if (onApplyOffer) {
      onApplyOffer(offer);
    }
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  return (
    <section id="offers-section" className="mx-auto max-w-[1440px] px-container-padding-mobile py-16 md:px-container-padding-desktop">
      {/* Section Header */}
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
            <Flame size={16} className="text-amber-400 fill-amber-400" />
            <span>Store Discounts & Mega Carnival</span>
            <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] text-amber-400 border border-amber-500/30">
              Live Today
            </span>
          </div>
          <h2 className="mt-1 font-headline-lg text-2xl font-bold tracking-tight text-white md:text-3xl">
            Latest Offers & Instant Savings
          </h2>
          <p className="mt-1 text-sm text-on-surface-variant max-w-2xl">
            Take advantage of official bank cashbacks, store vouchers, and free accessory bundles currently running at Gagan Mobile Care.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-on-surface-variant">Click any code to apply automatically</span>
        </div>
      </div>

      {/* Featured Big Promotional Banner */}
      <div className="relative mb-8 overflow-hidden rounded-2xl border border-primary/40 bg-gradient-to-r from-surface-container-high via-surface-container to-surface-container-highest p-6 md:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
        {/* Glow ambient circle */}
        <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -left-16 -bottom-16 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/50 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary mb-3">
              <Sparkles size={14} /> GMC Mega Flagship Bonanza
            </span>
            <h3 className="font-headline-xl text-2xl md:text-4xl font-extrabold text-white leading-tight">
              Save Up to <span className="text-primary-container drop-shadow-[0_0_20px_rgba(0,240,255,0.4)]">₹15,000 Off</span> On Latest Smartphones
            </h3>
            <p className="mt-2 text-sm md:text-base text-on-surface-variant">
              Combine Instant Bank Cashback (up to ₹10,000) with GMC Store Coupon <strong className="text-white">GMCFESTIVE</strong> (₹3,000) and get a complimentary 1-Year Screen Protection plan!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:flex-shrink-0">
            <button
              onClick={() => handleCopyCode('GMCFESTIVE', STORE_OFFERS[1])}
              className="flex items-center justify-center gap-2 rounded-full bg-primary-container px-6 py-3 text-sm font-bold text-on-primary-container shadow-[0_0_20px_rgba(0,240,255,0.35)] transition-all hover:scale-105 hover:opacity-95"
            >
              <Gift size={16} />
              {copiedCode === 'GMCFESTIVE' ? 'Code Applied! (₹3,000 OFF)' : 'Apply ₹3,000 Voucher'}
            </button>
            <button
              onClick={onOpenCart}
              className="flex items-center justify-center gap-1.5 rounded-full border border-outline-variant bg-surface/50 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-primary/60 hover:bg-surface-container-high"
            >
              View Cart <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Active Store Offer Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
        {STORE_OFFERS.map((offer) => {
          const isCopied = copiedCode === offer.code;

          return (
            <div
              key={offer.id}
              className={`relative flex flex-col justify-between rounded-xl border bg-surface p-5 transition-all duration-300 hover:border-primary/60 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] ${offer.border}`}
            >
              <div>
                {/* Badge and Tag */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                    {offer.tag}
                  </span>
                  <span className="rounded-full bg-surface-container-high px-2 py-0.5 text-[10px] font-semibold text-on-surface-variant">
                    {offer.badge}
                  </span>
                </div>

                {/* Offer Title & Amount */}
                <h4 className="font-headline-md text-base font-bold text-white leading-snug">
                  {offer.title}
                </h4>

                <p className="mt-2 text-xs text-on-surface-variant min-h-[48px] leading-relaxed">
                  {offer.description}
                </p>
              </div>

              {/* Coupon Code Pill & Action */}
              <div className="mt-4 pt-3 border-t border-outline-variant/20">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 rounded-lg border border-dashed border-primary/50 bg-primary/5 px-2.5 py-1 text-xs font-mono font-bold text-primary">
                    <Tag size={12} />
                    <span>{offer.code}</span>
                  </div>

                  <button
                    onClick={() => handleCopyCode(offer.code, offer)}
                    className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                      isCopied
                        ? 'bg-emerald-500 text-white'
                        : 'bg-surface-container-high text-primary hover:bg-primary-container hover:text-on-primary-container'
                    }`}
                    title="Click to copy and apply discount to cart"
                  >
                    {isCopied ? (
                      <>
                        <Check size={12} /> Applied
                      </>
                    ) : (
                      <>
                        <Copy size={12} /> Apply
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px] text-on-surface-variant/70">
                  <span>{offer.expiry}</span>
                  <span className="text-emerald-400 font-medium">Save ₹{offer.discount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Special Store Perks Bar (Replacing old eco block with comprehensive customer advantages) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 rounded-xl border border-outline-variant/30 bg-surface-container-low p-6">
        {SPECIAL_PERKS.map((perk, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-primary border border-outline-variant/30">
              <span className="material-symbols-outlined text-[22px]">
                {perk.icon}
              </span>
            </div>
            <div>
              <h5 className="text-sm font-bold text-white">{perk.title}</h5>
              <p className="mt-0.5 text-xs text-on-surface-variant leading-relaxed">
                {perk.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

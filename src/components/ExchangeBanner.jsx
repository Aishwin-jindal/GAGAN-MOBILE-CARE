import React from 'react';

export default function ExchangeBanner({ onOpenTradeIn }) {
  return (
    <section className="mx-auto max-w-[1440px] px-container-padding-mobile py-2xl md:px-container-padding-desktop">
      <div className="grid h-auto grid-cols-1 gap-lg lg:h-[400px] lg:grid-cols-3">
        {/* Main Promo Block */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-outline-variant/30 bg-gradient-to-br from-surface-container to-surface-container-highest p-xl lg:col-span-2">
          {/* Decorative Glow Circle */}
          <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl mix-blend-screen" />

          <div className="relative z-10">
            <span className="mb-sm block font-label-md text-label-md uppercase tracking-widest text-primary">
              Device Exchange
            </span>
            <h2 className="mb-md max-w-lg font-headline-xl text-headline-xl leading-tight text-on-surface">
              Get up to ₹20,000 for your old phone.
            </h2>
            <p className="max-w-md font-body-lg text-body-lg text-on-surface-variant">
              Upgrade seamlessly. Trade in your current device and apply the value instantly to your new flagship.
            </p>
          </div>

          <div className="relative z-10 mt-xl flex items-center gap-md lg:mt-0">
            <button
              className="rounded-full bg-primary-container px-8 py-3 font-headline-sm text-headline-sm text-on-primary-container transition-opacity hover:opacity-90 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
              onClick={onOpenTradeIn}
            >
              Evaluate Now
            </button>
          </div>
        </div>

        {/* Secondary Eco Block */}
        <div className="flex flex-col items-center justify-center rounded-xl border border-outline-variant/30 bg-surface-container-low p-lg text-center">
          <span className="material-symbols-outlined mb-md text-[48px] font-light text-primary">
            autorenew
          </span>
          <h3 className="mb-sm font-headline-md text-headline-md text-on-surface">
            Eco-Friendly
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            We responsibly recycle or refurbish every exchanged device, contributing to a greener planet.
          </p>
        </div>
      </div>
    </section>
  );
}


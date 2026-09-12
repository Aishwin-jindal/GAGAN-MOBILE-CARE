import React from 'react';

export default function HeroBanner({ onBuyNowClick, onLearnMoreClick }) {
  return (
    <section className="relative flex h-[380px] md:h-[440px] w-full items-center justify-center overflow-hidden bg-[#000000] mt-16">
      {/* Abstract shader background for "Tech Noir" feel */}
      <div className="absolute inset-0 bg-gradient-to-tr from-surface-container-lowest via-surface-container/60 to-surface-container-highest opacity-50 mix-blend-screen" />

      {/* Hero Image Overlay */}
      <div
        className="absolute inset-0 h-full w-full bg-cover bg-center opacity-45"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=2000&q=80')`
        }}
      />

      {/* Subtle radial glow in the center */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-surface-container-lowest/90" />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center justify-center px-4 text-center md:px-8">
        {/* Official Store Badge with Logo */}
        <div className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-amber-400/40 bg-black/70 px-4 py-1.5 backdrop-blur-md shadow-[0_0_20px_rgba(251,191,36,0.25)]">
          <img
            src="/gmc_logo.jpg"
            alt="Gagan Mobile Care"
            className="h-6 w-6 rounded-full object-cover border border-amber-400/80"
          />
          <span className="text-xs font-semibold text-white tracking-wide">
            Official Retailer • <span className="text-amber-400 font-bold">Maur Mandi</span>
          </span>
          <span className="hidden sm:inline text-xs text-on-surface-variant font-mono">Ph: 98726-22624</span>
        </div>

        <h1 className="mb-3 font-headline-lg text-2xl font-bold tracking-tight text-white md:text-4xl drop-shadow-md">
          Upgrade to the latest flagship.
        </h1>
        <p className="mb-6 max-w-xl text-sm font-normal text-on-surface-variant md:text-base">
          Experience the pinnacle of mobile technology with unprecedented performance and stunning design.
        </p>
        <div className="flex flex-row items-center gap-3">
          <button
            className="rounded-full bg-primary-container px-6 py-2.5 text-sm font-semibold text-on-primary-container shadow-[0_0_15px_rgba(0,240,255,0.25)] transition-all hover:opacity-90 hover:scale-105"
            onClick={onBuyNowClick}
          >
            Buy Now
          </button>
          <button
            className="rounded-full border border-primary/60 bg-surface/40 px-6 py-2.5 text-sm font-semibold text-primary backdrop-blur-sm transition-all hover:bg-primary/10 hover:border-primary"
            onClick={onLearnMoreClick}
          >
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}


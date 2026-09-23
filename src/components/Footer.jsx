import React from 'react';

export default function Footer({ onOpenSupport }) {
  return (
    <footer className="mx-auto flex w-full max-w-[1440px] flex-col justify-between border-t border-outline-variant/30 bg-surface-container-lowest px-container-padding-mobile py-xl font-body-sm text-body-sm text-primary transition-all duration-200 md:flex-row md:px-container-padding-desktop">
      <div className="mb-lg flex flex-col md:mb-0">
        <div className="flex items-center gap-3 mb-2">
          <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-amber-400/80 shadow-[0_0_15px_rgba(251,191,36,0.3)]">
            <img
              src="/gmc_logo.jpg"
              alt="Gagan Mobile Care Maur"
              className="h-full w-full object-cover scale-110"
            />
          </div>
          <div>
            <div className="font-headline-md text-base font-extrabold tracking-tight text-white">
              GAGAN <span className="text-primary">MOBILE CARE</span>
            </div>
            <div className="text-xs text-amber-400 font-semibold tracking-wide">
              Maur Mandi, Punjab • Ph: +91 98726-22624
            </div>
          </div>
        </div>
        <p className="mt-2 max-w-xs font-body-sm text-xs text-on-surface-variant">
          © 2026 Gagan Mobile Care (Maur). All rights reserved. Genuine Smartphones & Certified Repairs.
        </p>
      </div>

      <div className="flex max-w-2xl flex-wrap items-center gap-x-6 gap-y-3 md:justify-end text-xs font-semibold">
        <button
          onClick={() => onOpenSupport && onOpenSupport('location')}
          className="text-on-surface-variant transition-colors hover:text-cyan-400"
        >
          📍 Store Locator
        </button>
        <button
          onClick={() => onOpenSupport && onOpenSupport('repair')}
          className="text-on-surface-variant transition-colors hover:text-cyan-400"
        >
          🔧 Service Center & Repair Desk
        </button>
        <button
          onClick={() => onOpenSupport && onOpenSupport('warranty')}
          className="text-on-surface-variant transition-colors hover:text-cyan-400"
        >
          🛡️ Warranty Shield
        </button>
        <button
          onClick={() => onOpenSupport && onOpenSupport('privacy')}
          className="text-on-surface-variant transition-colors hover:text-cyan-400"
        >
          🔒 Privacy Policy
        </button>
        <button
          onClick={() => onOpenSupport && onOpenSupport('terms')}
          className="text-on-surface-variant transition-colors hover:text-cyan-400"
        >
          📄 Terms & Returns
        </button>
        <button
          onClick={() => onOpenSupport && onOpenSupport('contact')}
          className="text-on-surface-variant transition-colors hover:text-cyan-400"
        >
          📞 Contact Us
        </button>
      </div>
    </footer>
  );
}


import React, { useState, useMemo } from 'react';
import { handleImageError } from '../utils/imageFallback';

export default function PremiumAccessories({
  accessories,
  wishlist = [],
  onToggleWishlist,
  onSelectAccessory
}) {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return accessories;
    return accessories.filter((item) => item.accessoryCategory === activeCategory);
  }, [accessories, activeCategory]);

  return (
    <section id="accessories-section" className="mb-2xl border-t border-outline-variant/20 bg-surface-container-lowest py-xl scroll-mt-20">
      <div className="mx-auto max-w-[1440px] px-container-padding-mobile md:px-container-padding-desktop">
        {/* Section Header */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-headline-lg text-headline-lg tracking-tight text-primary">
                Premium Accessories & Audio
              </h2>
              <span className="rounded-full border border-primary/30 bg-surface-container-high px-3 py-1 font-label-md text-xs font-semibold text-primary">
                {filteredItems.length} Items
              </span>
            </div>
            <p className="mt-1 text-sm text-on-surface-variant">
              Genuine wireless audio, high-speed GaN chargers, military-grade cases & tempered glass.
            </p>
          </div>

          {/* Quick Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All' },
              { id: 'earbuds', label: 'Audio & ANC' },
              { id: 'watches', label: 'Smart Watches' },
              { id: 'chargers', label: 'Fast Chargers' },
              { id: 'cases', label: 'Cases & Covers' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-primary text-on-primary shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                    : 'bg-surface-container text-on-surface-variant hover:text-white hover:bg-surface-container-high'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accessories Grid */}
        <div className="grid grid-cols-2 gap-md md:grid-cols-4 lg:grid-cols-5 md:gap-lg">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectAccessory(item)}
              className="group relative flex cursor-pointer flex-col justify-between rounded-xl border border-outline-variant/25 bg-surface-container p-4 text-center transition-all duration-300 hover:border-primary/50 hover:bg-surface-container-high hover:shadow-[0_8px_25px_rgba(0,0,0,0.5)]"
            >
              {/* Badge */}
              {item.badge && (
                <div className="absolute left-2.5 top-2.5 z-10 rounded-full border border-outline-variant/40 bg-surface-container-highest/90 px-2 py-0.5 text-[10px] font-bold text-primary">
                  {item.badge}
                </div>
              )}

              {/* Wishlist toggle button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleWishlist(item);
                }}
                className={`absolute right-2.5 top-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full border backdrop-blur-md transition-all ${
                  wishlist.includes(item.id)
                    ? 'border-red-500/50 bg-red-500/20 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                    : 'border-outline-variant/30 bg-surface-container-high/80 text-on-surface-variant hover:border-red-500/40 hover:text-red-400'
                }`}
                title={wishlist.includes(item.id) ? "Remove from wishlist" : "Save to wishlist"}
              >
                <span className="material-symbols-outlined text-[15px]">
                  {wishlist.includes(item.id) ? 'favorite' : 'favorite_border'}
                </span>
              </button>

              <div>
                <div className="mx-auto mb-3 mt-4 flex h-28 w-28 items-center justify-center overflow-hidden rounded-xl bg-slate-900/80 border border-outline-variant/20 p-2 transition-transform duration-300 group-hover:scale-105">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain rounded-lg"
                    loading="lazy"
                    onError={(e) => handleImageError(e, item.name, 'accessories')}
                  />
                </div>

                <h4 className="font-headline-sm text-sm font-bold text-on-surface transition-colors group-hover:text-primary line-clamp-1">
                  {item.name}
                </h4>
                <p className="mt-1 text-[11px] text-on-surface-variant line-clamp-1">
                  {item.subtitle}
                </p>
              </div>

              <div className="mt-3 border-t border-outline-variant/20 pt-2.5 flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-primary-container">
                  {item.formattedPrice}
                </span>
                <span className="text-[10px] font-semibold text-primary uppercase tracking-wider group-hover:underline">
                  View →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


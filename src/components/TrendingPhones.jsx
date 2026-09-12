import React from 'react';

export default function TrendingPhones({
  products,
  selectedBrand = 'all',
  wishlist = [],
  onToggleWishlist,
  onSelectProduct,
  onAddToCart,
  onViewAll
}) {
  const getBrandTitle = () => {
    switch (selectedBrand) {
      case 'apple':
        return 'Apple iPhone Flagships';
      case 'samsung':
        return 'Samsung Galaxy & Foldables';
      case 'google':
        return 'Google Pixel Series';
      case 'oneplus':
        return 'OnePlus Flagships & Nord';
      case 'nothing':
        return 'Nothing & CMF Phones';
      case 'xiaomi':
        return 'Xiaomi & Leica Flagships';
      case 'vivo':
        return 'Vivo ZEISS & Fold Series';
      case 'oppo':
        return 'Oppo Find & Reno Series';
      default:
        return 'Curated Flagship Smartphones';
    }
  };

  return (
    <section id="smartphones-section" className="border-t border-outline-variant/20 bg-surface-container-lowest py-xl scroll-mt-20">
      <div className="mx-auto max-w-[1440px] px-container-padding-mobile md:px-container-padding-desktop">
        {/* Section Header */}
        <div className="mb-xl flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-headline-lg text-headline-lg tracking-tight text-primary">
                {getBrandTitle()}
              </h2>
              <span className="rounded-full border border-primary/30 bg-surface-container-high px-3 py-1 font-label-md text-xs font-semibold text-primary">
                {products.length} {products.length === 1 ? 'Model' : 'Models'}
              </span>
            </div>
            {selectedBrand !== 'all' && (
              <p className="mt-1 text-sm text-on-surface-variant">
                Showing all recent models for{' '}
                <span className="capitalize font-semibold text-primary">{selectedBrand}</span>.
              </p>
            )}
          </div>

          <button
            onClick={onViewAll}
            className="flex items-center gap-1 font-label-md text-label-md uppercase text-on-surface-variant transition-colors hover:text-primary"
          >
            {selectedBrand === 'all' ? 'All Models' : 'Show All Brands'}{' '}
            <span className="material-symbols-outlined text-[16px]">
              arrow_forward
            </span>
          </button>
        </div>

        {/* Empty state if no products found */}
        {products.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-outline-variant/30 bg-surface p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/60 mb-3">
              search_off
            </span>
            <h3 className="text-xl font-bold text-on-surface">No smartphones found</h3>
            <p className="mt-1 text-sm text-on-surface-variant max-w-sm">
              We couldn't find any models matching your criteria.
            </p>
            <button
              onClick={onViewAll}
              className="mt-6 rounded-full bg-primary-container px-6 py-2 text-sm font-semibold text-on-primary-container"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-outline-variant/30 bg-surface transition-all duration-300 hover:border-primary/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
            >
              {/* Badge */}
              {product.badge && (
                <div className="absolute left-4 top-4 z-10 rounded-full border border-outline-variant/50 bg-surface-container-high/90 px-3 py-1 font-label-md text-[11px] font-semibold text-primary backdrop-blur-md shadow-[0_0_12px_rgba(0,240,255,0.25)]">
                  {product.badge}
                </div>
              )}

              {/* Wishlist Heart Toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleWishlist(product);
                }}
                className={`absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur-md transition-all ${
                  wishlist.includes(product.id)
                    ? 'border-red-500/50 bg-red-500/20 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                    : 'border-outline-variant/40 bg-surface-container-high/80 text-on-surface-variant hover:border-red-500/40 hover:text-red-400'
                }`}
                title={wishlist.includes(product.id) ? "Remove from wishlist" : "Add to wishlist"}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {wishlist.includes(product.id) ? 'favorite' : 'favorite_border'}
                </span>
              </button>

              {/* Product Showcase Image Container */}
              <div
                className="relative flex h-72 w-full cursor-pointer items-center justify-center overflow-hidden bg-surface-container-low p-6"
                onClick={() => onSelectProduct(product)}
              >
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-surface/80" />
                <img
                  src={product.image}
                  alt={product.name}
                  className="relative z-10 max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Product Info */}
              <div className="flex flex-1 flex-col justify-between gap-sm p-5">
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary/70">
                      {product.brand}
                    </span>
                    {product.specs?.processor && (
                      <span className="truncate max-w-[150px] text-[11px] text-on-surface-variant/80">
                        {product.specs.processor.split('+')[0].trim()}
                      </span>
                    )}
                  </div>
                  <h3
                    className="cursor-pointer font-headline-md text-lg font-bold text-on-surface transition-colors group-hover:text-primary line-clamp-1"
                    onClick={() => onSelectProduct(product)}
                  >
                    {product.name}
                  </h3>
                  <p className="font-body-sm text-xs text-on-surface-variant min-h-[36px] line-clamp-2 mt-1">
                    {product.subtitle}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-outline-variant/20 pt-3">
                  <div>
                    <span className="block text-[10px] uppercase text-on-surface-variant/70">Price</span>
                    <span className="font-headline-sm text-base font-bold text-primary-container">
                      {product.formattedPrice}
                    </span>
                  </div>
                  <button
                    className="rounded-full border border-outline-variant bg-surface-container-high px-4 py-1.5 font-label-md text-xs font-semibold uppercase text-primary transition-all hover:border-primary/50 hover:bg-primary-container hover:text-on-primary-container hover:shadow-[0_0_12px_rgba(0,240,255,0.3)]"
                    onClick={() => onAddToCart(product)}
                  >
                    Buy
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


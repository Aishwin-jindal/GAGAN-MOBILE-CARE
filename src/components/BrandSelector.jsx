import React from 'react';
import { BRANDS } from '../data/products';

export default function BrandSelector({ selectedBrand, onSelectBrand }) {
  return (
    <section className="mx-auto max-w-[1440px] px-container-padding-mobile py-8 md:py-10 md:px-container-padding-desktop">
      <h2 className="mb-4 text-center font-headline-md text-xs font-bold uppercase tracking-wider text-on-surface-variant opacity-70">
        Curated Brands
      </h2>
      <div className="grid grid-cols-2 items-center justify-items-center gap-4 opacity-90 md:grid-cols-4 lg:grid-cols-5">
        {BRANDS.map((brand) => {
          const isSelected = selectedBrand === brand.id;
          return (
            <div
              key={brand.id}
              onClick={() => onSelectBrand(brand.id)}
              className={`group flex h-24 w-full cursor-pointer items-center justify-center rounded-lg border transition-all ${
                isSelected
                  ? 'border-primary bg-surface-container-high shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                  : 'border-outline-variant/30 bg-surface-container hover:border-primary/50 hover:bg-surface-container-high'
              }`}
            >
              <span
                className={`font-headline-md text-headline-md font-bold transition-colors ${
                  isSelected
                    ? 'text-primary'
                    : 'text-on-surface group-hover:text-primary'
                }`}
              >
                {brand.name}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}


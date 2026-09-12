import React from 'react';
import { X, ShieldCheck, Truck, RefreshCw, ShoppingBag, Heart } from 'lucide-react';

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onOpenTradeIn,
  wishlist = [],
  onToggleWishlist
}) {
  if (!isOpen || !product) return null;

  const isWishlisted = product ? wishlist.includes(product.id) : false;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card w-full max-w-[780px] p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} title="Close">
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 md:gap-8 mt-2 sm:mt-0">
          {/* Left Column: Image */}
          <div className="flex flex-col">
            <div
              className="w-full h-56 sm:h-72 md:h-80 rounded-2xl p-4 border border-white/10 flex items-center justify-center"
              style={{
                background: 'radial-gradient(circle at center, #1e293b 0%, #0d121d 100%)'
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                className="max-h-full max-w-full object-contain drop-shadow-2xl"
              />
            </div>

            {/* Badges / Guarantees */}
            <div className="grid grid-cols-3 gap-2 mt-3 sm:mt-4">
              <div className="bg-[#131b2b] p-2 sm:p-2.5 rounded-xl text-center border border-white/5">
                <ShieldCheck size={16} className="text-cyan-400 mx-auto mb-1" />
                <div className="text-[10px] sm:text-xs text-gray-400 font-medium leading-tight">100% Genuine</div>
              </div>
              <div className="bg-[#131b2b] p-2 sm:p-2.5 rounded-xl text-center border border-white/5">
                <Truck size={16} className="text-cyan-400 mx-auto mb-1" />
                <div className="text-[10px] sm:text-xs text-gray-400 font-medium leading-tight">Fast Delivery</div>
              </div>
              <div className="bg-[#131b2b] p-2 sm:p-2.5 rounded-xl text-center border border-white/5">
                <RefreshCw size={16} className="text-cyan-400 mx-auto mb-1" />
                <div className="text-[10px] sm:text-xs text-gray-400 font-medium leading-tight">Easy Exchange</div>
              </div>
            </div>
          </div>

          {/* Right Column: Information & Actions */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="text-[11px] sm:text-xs uppercase tracking-widest text-cyan-400 font-bold mb-1">
                {product.brand}
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-1.5 leading-tight">
                {product.name}
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">
                {product.subtitle}
              </p>

              <div className="text-2xl sm:text-3xl font-black text-cyan-400 mb-3 sm:mb-4 flex flex-wrap items-baseline gap-2">
                <span>{product.formattedPrice}</span>
                <span className="text-[11px] text-gray-400 font-normal">
                  (GST Bill Included)
                </span>
              </div>

              {/* Specs Table if smartphone */}
              {product.specs && (
                <div className="bg-[#131b2b] rounded-xl p-3 sm:p-4 mb-4 border border-white/5">
                  <div className="text-[11px] sm:text-xs font-bold uppercase text-gray-300 mb-2 tracking-wider">
                    Key Specifications
                  </div>
                  <div className="text-xs text-gray-400 space-y-1.5">
                    {product.specs.display && <div>📱 <strong>Display:</strong> {product.specs.display}</div>}
                    {product.specs.processor && <div>⚡ <strong>Processor:</strong> {product.specs.processor}</div>}
                    {product.specs.camera && <div>📸 <strong>Camera:</strong> {product.specs.camera}</div>}
                    {product.specs.battery && <div>🔋 <strong>Battery:</strong> {product.specs.battery}</div>}
                    {product.specs.warranty && <div>🛡️ <strong>Warranty:</strong> {product.specs.warranty}</div>}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2.5 mt-2">
              <div className="flex gap-2.5">
                <button
                  className="btn-primary flex-1 flex items-center justify-center gap-2 py-3 text-xs sm:text-sm font-bold shadow-lg"
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                >
                  <ShoppingBag size={16} /> Add to Cart & Checkout
                </button>

                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl border transition-all ${
                    isWishlisted
                      ? 'border-red-500/60 bg-red-500/20 text-red-400'
                      : 'border-white/15 bg-white/5 text-gray-400 hover:text-white'
                  }`}
                  title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart size={18} className={isWishlisted ? "fill-red-400" : ""} />
                </button>
              </div>

              <button
                className="btn-secondary w-full text-xs sm:text-sm py-2.5 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 transition-colors rounded-xl"
                onClick={() => {
                  onClose();
                  onOpenTradeIn();
                }}
              >
                🔄 Trade-in Old Phone For Instant Credit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

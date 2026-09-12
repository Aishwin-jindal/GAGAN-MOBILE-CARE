import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export default function WishlistModal({
  isOpen,
  onClose,
  wishlistProducts,
  onAddToCart,
  onRemoveFromWishlist,
  onMoveAllToCart
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fadeIn" onClick={onClose}>
      <div
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-outline-variant/40 bg-surface-container-low shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-outline-variant/30 bg-surface-container/60 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
              <Heart size={22} className="fill-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                My Wishlist
                <span className="rounded-full bg-surface-container-high px-2.5 py-0.5 text-xs font-semibold text-primary">
                  {wishlistProducts.length}
                </span>
              </h2>
              <p className="text-xs text-on-surface-variant">
                Items you've saved for later. Check back anytime or move them to cart!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {wishlistProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant/40 mb-3">
                <Heart size={32} />
              </div>
              <h3 className="text-lg font-bold text-white">Your wishlist is empty</h3>
              <p className="text-xs text-on-surface-variant max-w-xs mt-1">
                Explore our flagship smartphones & premium accessories, and tap the heart icon to save your favorites!
              </p>
              <button
                onClick={onClose}
                className="mt-6 rounded-full bg-primary-container px-6 py-2 text-xs font-semibold text-on-primary-container transition-opacity hover:opacity-90"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            wishlistProducts.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-outline-variant/30 bg-surface-container p-4 transition-all hover:border-primary/40 hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
              >
                {/* Product Thumbnail & Details */}
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-outline-variant/30 bg-surface-container-high p-2">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary/70">
                      {product.brand}
                    </span>
                    <h4 className="text-sm font-bold text-white line-clamp-1">
                      {product.name}
                    </h4>
                    <p className="text-xs text-on-surface-variant line-clamp-1 mt-0.5">
                      {product.subtitle}
                    </p>
                    <div className="mt-2 font-mono text-sm font-bold text-primary-container">
                      {product.formattedPrice || `₹${product.price?.toLocaleString('en-IN')}`}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2.5 sm:flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-outline-variant/20">
                  <button
                    onClick={() => {
                      onAddToCart(product);
                      onRemoveFromWishlist(product.id);
                    }}
                    className="flex items-center gap-1.5 rounded-full bg-primary-container px-4 py-1.5 text-xs font-semibold text-on-primary-container transition-all hover:opacity-90 hover:shadow-[0_0_12px_rgba(0,240,255,0.3)]"
                  >
                    <ShoppingBag size={13} />
                    Move to Cart
                  </button>

                  <button
                    onClick={() => onRemoveFromWishlist(product.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant/40 text-on-surface-variant transition-colors hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
                    title="Remove from wishlist"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {wishlistProducts.length > 0 && (
          <div className="flex items-center justify-between border-t border-outline-variant/30 bg-surface-container/60 px-6 py-3">
            <span className="text-xs text-on-surface-variant">
              {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved
            </span>

            <div className="flex items-center gap-3">
              <button
                onClick={onMoveAllToCart}
                className="flex items-center gap-1.5 rounded-full border border-primary/50 bg-surface-container-high px-4 py-1.5 text-xs font-semibold text-primary transition-all hover:bg-primary-container hover:text-on-primary-container"
              >
                Move All to Cart <ArrowRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px' }}>
        <button className="modal-close" onClick={onClose}>
          <X size={18} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Left Column: Image */}
          <div>
            <div
              style={{
                background: 'radial-gradient(circle at center, #1e293b 0%, #0d121d 100%)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '320px'
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
              />
            </div>

            {/* Badges / Guarantees */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '1rem' }}>
              <div style={{ background: '#131b2b', padding: '0.6rem', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <ShieldCheck size={18} style={{ color: 'var(--accent-cyan)', marginBottom: 2 }} />
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>100% Genuine</div>
              </div>
              <div style={{ background: '#131b2b', padding: '0.6rem', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <Truck size={18} style={{ color: 'var(--accent-cyan)', marginBottom: 2 }} />
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Same Day Delivery</div>
              </div>
              <div style={{ background: '#131b2b', padding: '0.6rem', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <RefreshCw size={18} style={{ color: 'var(--accent-cyan)', marginBottom: 2 }} />
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Easy Exchange</div>
              </div>
            </div>
          </div>

          {/* Right Column: Information & Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: '0.3rem' }}>
                {product.brand}
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
                {product.name}
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                {product.subtitle}
              </p>

              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-cyan)', marginBottom: '1.25rem' }}>
                {product.formattedPrice}
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 400, marginLeft: '0.5rem' }}>
                  (Incl. all taxes & GMC GST Bill)
                </span>
              </div>

              {/* Specs Table if smartphone */}
              {product.specs && (
                <div style={{ background: '#131b2b', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
                    KEY SPECIFICATIONS
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <div>📱 <strong>Display:</strong> {product.specs.display}</div>
                    <div>⚡ <strong>Processor:</strong> {product.specs.processor}</div>
                    <div>📸 <strong>Camera:</strong> {product.specs.camera}</div>
                    <div>🔋 <strong>Battery:</strong> {product.specs.battery}</div>
                    <div>🛡️ <strong>Warranty:</strong> {product.specs.warranty}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  className="btn-primary"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                >
                  <ShoppingBag size={18} /> Add to Cart & Checkout
                </button>

                <button
                  onClick={() => onToggleWishlist(product)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-md)',
                    border: isWishlisted ? '1px solid rgba(239, 68, 68, 0.6)' : '1px solid var(--border-color)',
                    background: isWishlisted ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg-card)',
                    color: isWishlisted ? '#f87171' : 'var(--text-muted)',
                    transition: 'all 0.2s'
                  }}
                  title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart size={20} className={isWishlisted ? "fill-red-400" : ""} />
                </button>
              </div>

              <button
                className="btn-secondary"
                style={{ width: '100%', fontSize: '0.85rem', padding: '0.6rem' }}
                onClick={() => {
                  onClose();
                  onOpenTradeIn();
                }}
              >
                Trade-in Old Phone For Extra Discount
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

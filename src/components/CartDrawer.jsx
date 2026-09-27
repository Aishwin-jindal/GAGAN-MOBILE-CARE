import React, { useState, useEffect } from 'react';
import { X, Trash2, Plus, Minus, CheckCircle, ArrowRight, Tag, Check, FileText, Lock, UserCheck } from 'lucide-react';
import { STORE_OFFERS } from '../data/offers';
import { handleImageError } from '../utils/imageFallback';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  tradeInDiscount,
  tradeInDevice,
  onClearCart,
  onPlaceOrder,
  onOpenOrders,
  appliedOffer,
  onApplyOffer,
  onViewInvoice,
  currentUser,
  onOpenAuthModal
}) {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');
  const [placedOrderObj, setPlacedOrderObj] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    if (currentUser) {
      if (currentUser.name && !customerName) setCustomerName(currentUser.name);
      if (currentUser.phone && !customerPhone) setCustomerPhone(currentUser.phone);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const rawSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  // Calculate discounts and check minimum eligibility
  const isOfferEligible = appliedOffer ? (rawSubtotal >= (appliedOffer.minCartValue || 0)) : false;
  const rawOfferDiscount = (appliedOffer && isOfferEligible) ? appliedOffer.discount : 0;
  
  // Total discount cannot exceed cart subtotal
  const totalDiscount = Math.min(rawSubtotal, (tradeInDiscount || 0) + rawOfferDiscount);
  const netTotal = Math.max(0, rawSubtotal - totalDiscount);

  const handleApplyCoupon = (codeToApply) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    if (!code) return;

    const matched = STORE_OFFERS.find((o) => o.code.toUpperCase() === code);
    if (!matched) {
      setCouponError('Invalid coupon code. Try GMCFESTIVE, FIRSTGMC or GMCCOMBO.');
      return;
    }

    if (matched.minCartValue && rawSubtotal < matched.minCartValue) {
      setCouponError(`Code ${matched.code} requires minimum cart total of ₹${matched.minCartValue.toLocaleString('en-IN')}. (Current: ₹${rawSubtotal.toLocaleString('en-IN')})`);
      return;
    }

    if (onApplyOffer) onApplyOffer(matched);
    setCouponError('');
    setCouponInput('');
  };

  const handleRemoveCoupon = () => {
    if (onApplyOffer) onApplyOffer(null);
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
      if (onOpenAuthModal) {
        onOpenAuthModal('Please Sign In or Create an Account to complete your order! 🛍️');
      }
      return;
    }

    const orderId = `GMC-${Math.floor(1000 + Math.random() * 9000)}`;
    setPlacedOrderId(orderId);

    const newOrder = {
      id: orderId,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Confirmed',
      statusStep: 1,
      customerName: customerName || currentUser?.name || 'Valued Customer',
      customerPhone: customerPhone || currentUser?.phone || '',
      deliveryAddress: currentUser?.address || 'Store Pickup / Priority Delivery, Maur Mandi',
      paymentMethod: 'Pay on Store Counter / COD',
      trackingNumber: `GMC-EXP-${Math.floor(100000 + Math.random() * 900000)}`,
      discount: totalDiscount,
      appliedOfferName: appliedOffer ? appliedOffer.title : null,
      tradeInDevice: tradeInDevice,
      total: netTotal,
      items: [...cartItems]
    };

    setPlacedOrderObj(newOrder);
    if (onPlaceOrder) {
      onPlaceOrder(newOrder);
    }

    setOrderPlaced(true);
  };

  const handleReset = () => {
    setOrderPlaced(false);
    setPlacedOrderObj(null);
    onClearCart();
    onClose();
  };

  const handleViewOrders = () => {
    handleReset();
    if (onOpenOrders) onOpenOrders();
  };

  const handleDownloadReceipt = () => {
    if (onViewInvoice && placedOrderObj) {
      onViewInvoice(placedOrderObj);
    }
  };

  return (
    <div className="cart-drawer-overlay" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-header">
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
            Shopping Cart ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
          </h2>
          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {orderPlaced ? (
          <div style={{ padding: '2rem 1rem', textAlign: 'center', my: 'auto' }}>
            <div style={{ color: 'var(--accent-cyan)', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
              <CheckCircle size={64} />
            </div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
              Order Placed Successfully!
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Thank you, <strong>{customerName || currentUser?.name || 'Valued Customer'}</strong>! Your order has been registered in the GMC database. Order ID: <strong style={{ color: 'var(--accent-cyan)' }}>#{placedOrderId}</strong>.
            </p>

            {/* Admin Notification Status Banner */}
            <div style={{ background: 'rgba(37, 211, 102, 0.12)', border: '1px solid rgba(37, 211, 102, 0.35)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', marginBottom: '1.25rem', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.82rem', color: '#86efac' }}>
              <span style={{ fontSize: '1.2rem' }}>🔔</span>
              <div>
                <div style={{ fontWeight: 800, color: '#ffffff' }}>Admin Mobile Connected (+91 98726-22624)</div>
                <div style={{ fontSize: '0.75rem', color: '#86efac' }}>Real-time order alert dispatched to store management.</div>
              </div>
            </div>

            <div style={{ background: '#131b2b', padding: '1.25rem', borderRadius: 'var(--radius-md)', textAlign: 'left', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
              <div style={{ color: '#fff', fontWeight: 700, marginBottom: '0.5rem' }}>Gagan Mobile Care Store Pickup & Delivery:</div>
              <div>📍 Store Address: Main Market, Gagan Mobile Care Hub, Maur Mandi</div>
              <div>📞 Helpline / Admin: +91 98726-22624</div>
              <div>⏱️ Status: Confirmed & Saved to My Orders</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {/* WhatsApp Direct Message to Admin */}
              <a
                href={(() => {
                  if (!placedOrderObj) return 'https://wa.me/919872622624';
                  const itemsList = (placedOrderObj.items || [])
                    .map((it, idx) => `${idx + 1}. ${it.name} (Qty: ${it.quantity}) - ₹${(it.price * it.quantity).toLocaleString('en-IN')}`)
                    .join('\n');
                  const msg = `📦 *NEW ORDER ALERT - GAGAN MOBILE CARE*\n` +
                    `━━━━━━━━━━━━━━━━━━\n` +
                    `🆔 *Order ID*: #${placedOrderObj.id}\n` +
                    `📅 *Date*: ${placedOrderObj.date}\n` +
                    `👤 *Customer*: ${placedOrderObj.customerName}\n` +
                    `📞 *Customer Phone*: ${placedOrderObj.customerPhone}\n` +
                    `📍 *Delivery*: ${placedOrderObj.deliveryAddress || 'Maur Mandi'}\n` +
                    `💳 *Payment*: ${placedOrderObj.paymentMethod}\n` +
                    `💰 *Total Amount*: ₹${Number(placedOrderObj.total || 0).toLocaleString('en-IN')}\n\n` +
                    `🛒 *Ordered Items*:\n${itemsList}\n` +
                    `━━━━━━━━━━━━━━━━━━\n` +
                    `⚡ Order logged in GMC System. Ready for packing & dispatch!`;
                  return `https://wa.me/919872622624?text=${encodeURIComponent(msg)}`;
                })()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  border: 'none',
                  textDecoration: 'none',
                  boxShadow: '0 4px 16px rgba(37, 211, 102, 0.4)'
                }}
              >
                <span>💬 Send WhatsApp Alert to Admin (+91 98726-22624)</span>
              </a>

              <button
                className="btn-primary"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                onClick={handleDownloadReceipt}
              >
                <FileText size={16} /> Download Tax Invoice / Bill
              </button>
              <button className="btn-secondary" style={{ width: '100%' }} onClick={handleViewOrders}>
                View in My Orders
              </button>
              <button
                style={{ background: 'transparent', color: 'var(--text-muted)', fontSize: '0.8rem', padding: '0.25rem', border: 'none', cursor: 'pointer' }}
                onClick={handleReset}
              >
                Done & Return to Store
              </button>
            </div>
          </div>
        ) : cartItems.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', padding: '2rem 1rem', textAlign: 'center' }}>
            <p style={{ marginBottom: '1rem', color: '#fff', fontSize: '1rem' }}>Your shopping cart is currently empty.</p>
            {appliedOffer && (
              <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 'var(--radius-md)', padding: '0.85rem', marginBottom: '1.5rem', maxWidth: '320px' }}>
                <div style={{ color: '#34d399', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                  🏷️ Offer Active: {appliedOffer.code}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  ₹{appliedOffer.discount.toLocaleString('en-IN')} discount will be automatically applied when you add any item!
                </div>
              </div>
            )}
            <button className="btn-secondary" onClick={onClose}>Browse Catalog & Add Items</button>
          </div>
        ) : (
          <>
            {/* List of items */}
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-img">
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(e) => handleImageError(e, item.name, item.category || 'phone')}
                    />
                  </div>
                  <div className="cart-item-details">
                    <div className="cart-item-title">{item.name}</div>
                    <div className="cart-item-price">
                      ₹{item.price.toLocaleString('en-IN')}
                    </div>
                    {/* Quantity controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem' }}>
                      <button
                        style={{ background: '#172033', color: '#fff', width: 24, height: 24, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{item.quantity}</span>
                      <button
                        style={{ background: '#172033', color: '#fff', width: 24, height: 24, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  <button
                    style={{ background: 'transparent', color: 'var(--text-dim)' }}
                    onClick={() => onRemoveItem(item.id)}
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Checkout Breakdown Footer */}
            <div className="cart-footer">
              {/* Promo Code / Store Offer Input */}
              <div style={{ marginBottom: '1rem', background: '#0e1726', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                {appliedOffer ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                      <span style={{ color: isOfferEligible ? '#10b981' : '#f59e0b', display: 'flex' }}><Check size={16} /></span>
                      <div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: isOfferEligible ? '#10b981' : '#f59e0b' }}>
                          {isOfferEligible ? `Offer Applied: ${appliedOffer.code}` : `Offer Pending: ${appliedOffer.code}`}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: isOfferEligible ? 'var(--text-muted)' : '#f59e0b' }}>
                          {isOfferEligible 
                            ? `${appliedOffer.title} (-₹${rawOfferDiscount.toLocaleString('en-IN')})`
                            : `Add ₹${((appliedOffer.minCartValue || 0) - rawSubtotal).toLocaleString('en-IN')} more to unlock ₹${appliedOffer.discount.toLocaleString('en-IN')} off!`
                          }
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      style={{ background: 'transparent', color: 'var(--text-dim)', fontSize: '0.75rem', textDecoration: 'underline', border: 'none', cursor: 'pointer' }}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem' }}>
                      <div style={{ position: 'relative', flex: 1 }}>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Enter Promo Code"
                          value={couponInput}
                          onChange={(e) => {
                            setCouponInput(e.target.value);
                            setCouponError('');
                          }}
                          style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem', textTransform: 'uppercase', backgroundColor: '#0b111e', color: '#fff' }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon()}
                        className="btn-secondary"
                        style={{ padding: '0.5rem 0.9rem', fontSize: '0.75rem', fontWeight: 700 }}
                      >
                        Apply
                      </button>
                    </div>

                    {couponError && (
                      <div style={{ fontSize: '0.7rem', color: '#f87171', marginBottom: '0.3rem' }}>
                        {couponError}
                      </div>
                    )}

                    {/* Quick Suggestions */}
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Popular:</span>
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon('GMCFESTIVE')}
                        style={{ background: 'rgba(0,240,255,0.1)', color: 'var(--accent-cyan)', border: '1px dashed var(--accent-cyan)', borderRadius: 4, padding: '2px 6px', fontSize: '0.68rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        GMCFESTIVE (-₹3k)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon('FIRSTGMC')}
                        style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px dashed #34d399', borderRadius: 4, padding: '2px 6px', fontSize: '0.68rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        FIRSTGMC (-₹1.5k)
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Breakdown Rows */}
              <div className="cart-summary-row">
                <span>Subtotal:</span>
                <span>₹{rawSubtotal.toLocaleString('en-IN')}</span>
              </div>

              {appliedOffer && isOfferEligible && (
                <div className="cart-summary-row" style={{ color: '#10b981' }}>
                  <span>Store Offer ({appliedOffer.code}):</span>
                  <span>- ₹{rawOfferDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              {tradeInDiscount > 0 && (
                <div className="cart-summary-row" style={{ color: 'var(--accent-cyan)' }}>
                  <span>Trade-in Credit ({tradeInDevice}):</span>
                  <span>- ₹{tradeInDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="cart-summary-row" style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '0.5rem' }}>
                <span className="cart-summary-total">Total Amount:</span>
                <span className="cart-summary-total" style={{ color: 'var(--accent-cyan)' }}>
                  ₹{netTotal.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Quick Checkout Area */}
              {currentUser ? (
                <form onSubmit={handleCheckoutSubmit} style={{ marginTop: '0.75rem' }}>
                  <div style={{ background: 'rgba(0,240,255,0.06)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: 'var(--radius-sm)', padding: '0.5rem 0.75rem', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#93c5fd' }}>
                    <UserCheck size={15} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      Logged in as <strong>{currentUser.name}</strong> ({currentUser.email})
                    </span>
                  </div>

                  <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.25rem' }}>
                      Receiver Name
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Receiver Name"
                      required
                      value={customerName || currentUser.name || ''}
                      onChange={(e) => setCustomerName(e.target.value)}
                      style={{
                        backgroundColor: '#0f172a',
                        color: '#ffffff',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '6px',
                        padding: '0.6rem 0.85rem',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.25rem' }}>
                      Delivery Mobile Phone
                    </label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="Delivery Mobile Phone"
                      required
                      value={customerPhone || currentUser.phone || ''}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      style={{
                        backgroundColor: '#0f172a',
                        color: '#ffffff',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '6px',
                        padding: '0.6rem 0.85rem',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    Confirm Order & Reserve <ArrowRight size={16} style={{ marginLeft: 6 }} />
                  </button>
                </form>
              ) : (
                <div style={{ marginTop: '0.75rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', padding: '0.85rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#facc15', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                    <Lock size={15} />
                    <span>Login or Sign Up to Order</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    Please sign in or create an account to place this order and track real-time delivery status.
                  </p>
                  <button
                    type="button"
                    onClick={() => onOpenAuthModal && onOpenAuthModal('Please sign in or create an account to place your order! 🛍️')}
                    className="btn-primary"
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                  >
                    <span>Sign In / Sign Up to Order</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

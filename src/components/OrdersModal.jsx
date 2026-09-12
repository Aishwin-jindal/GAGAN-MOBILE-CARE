import React, { useState } from 'react';
import { X, Package, CheckCircle2, Clock, Truck, ChevronRight, RotateCcw, FileText, PhoneCall, ExternalLink } from 'lucide-react';

export default function OrdersModal({ isOpen, onClose, orders, onReorder, onOpenSupport, onViewInvoice }) {
  const [filter, setFilter] = useState('all'); // 'all', 'delivered', 'processing'
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  if (!isOpen) return null;

  const filteredOrders = orders.filter((order) => {
    if (filter === 'delivered') return order.status.toLowerCase() === 'delivered';
    if (filter === 'processing') return order.status.toLowerCase() !== 'delivered';
    return true;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'dispatched':
      case 'in transit':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'confirmed':
      default:
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fadeIn" onClick={onClose}>
      <div
        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl border border-outline-variant/40 bg-surface-container-low shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-outline-variant/30 bg-surface-container/60 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container/20 text-primary border border-primary/30">
              <Package size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                My Previous Orders
                <span className="rounded-full bg-surface-container-high px-2.5 py-0.5 text-xs font-semibold text-primary">
                  {orders.length}
                </span>
              </h2>
              <p className="text-xs text-on-surface-variant">
                History of all your mobile devices & accessories purchased from GMC
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

        {/* Filters */}
        <div className="flex items-center justify-between border-b border-outline-variant/20 bg-surface-container-lowest/50 px-6 py-3">
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'All Orders' },
              { id: 'delivered', label: 'Delivered' },
              { id: 'processing', label: 'In Progress' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
                  filter === tab.id
                    ? 'bg-primary text-on-primary shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                    : 'bg-surface-container text-on-surface-variant hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-on-surface-variant hidden sm:inline">
            Official Store Verified Orders
          </span>
        </div>

        {/* Orders List Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Package size={48} className="text-on-surface-variant/40 mb-3" />
              <h3 className="text-lg font-bold text-white">No orders found</h3>
              <p className="text-xs text-on-surface-variant max-w-xs mt-1">
                You don't have any orders in this category yet.
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const itemCount = order.items.reduce((acc, i) => acc + i.quantity, 0);

              return (
                <div
                  key={order.id}
                  className="rounded-xl border border-outline-variant/30 bg-surface-container p-5 transition-all hover:border-primary/40 hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
                >
                  {/* Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-outline-variant/20 pb-3 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold text-primary tracking-wide">
                        #{order.id}
                      </span>
                      <span className="text-xs text-on-surface-variant">
                        Placed on {order.date}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-semibold ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status === 'Delivered' ? (
                          <CheckCircle2 size={13} />
                        ) : (
                          <Truck size={13} className="animate-pulse" />
                        )}
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Delivery Stepper */}
                  <div className="mb-4 rounded-lg bg-surface-container-low/70 p-3">
                    <div className="flex items-center justify-between text-xs text-on-surface-variant">
                      <span className="flex items-center gap-1 text-primary font-medium">
                        <CheckCircle2 size={13} /> Order Placed
                      </span>
                      <div className="h-0.5 flex-1 mx-2 bg-primary/40" />
                      <span className={`flex items-center gap-1 ${order.statusStep >= 2 ? 'text-primary font-medium' : 'opacity-40'}`}>
                        <CheckCircle2 size={13} /> Quality Check
                      </span>
                      <div className={`h-0.5 flex-1 mx-2 ${order.statusStep >= 3 ? 'bg-primary/40' : 'bg-outline-variant/20'}`} />
                      <span className={`flex items-center gap-1 ${order.statusStep >= 3 ? 'text-primary font-medium' : 'opacity-40'}`}>
                        <Truck size={13} /> Dispatched
                      </span>
                      <div className={`h-0.5 flex-1 mx-2 ${order.statusStep >= 4 ? 'bg-primary/40' : 'bg-outline-variant/20'}`} />
                      <span className={`flex items-center gap-1 ${order.statusStep >= 4 ? 'text-emerald-400 font-semibold' : 'opacity-40'}`}>
                        <CheckCircle2 size={13} /> Delivered
                      </span>
                    </div>
                  </div>

                  {/* Items in this order */}
                  <div className="space-y-3 mb-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-outline-variant/30 bg-surface-container-high p-1">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-contain"
                            />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-white line-clamp-1">
                              {item.name}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-on-surface-variant mt-0.5">
                              <span>Qty: {item.quantity}</span>
                              <span>•</span>
                              <span>₹{item.price.toLocaleString('en-IN')} each</span>
                            </div>
                          </div>
                        </div>

                        <span className="font-mono text-sm font-bold text-white flex-shrink-0">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Extra metadata */}
                  {order.tradeInDevice && (
                    <div className="mb-3 flex items-center justify-between text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-md border border-emerald-500/20">
                      <span>Exchange Device Value Applied: {order.tradeInDevice}</span>
                      <span>- ₹{order.discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {/* Bottom Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-outline-variant/20 pt-3">
                    <div>
                      <span className="text-xs text-on-surface-variant block">Total Paid ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                      <span className="text-base font-bold text-primary">
                        ₹{order.total.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onReorder(order.items)}
                        className="flex items-center gap-1.5 rounded-full border border-primary/40 bg-surface-container-high px-3.5 py-1.5 text-xs font-semibold text-primary transition-all hover:bg-primary-container hover:text-on-primary-container"
                        title="Add these items to your cart again"
                      >
                        <RotateCcw size={13} />
                        Reorder
                      </button>

                      <button
                        onClick={() => {
                          if (onViewInvoice) onViewInvoice(order);
                        }}
                        className="flex items-center gap-1.5 rounded-full border border-primary/40 bg-surface-container-low px-3.5 py-1.5 text-xs font-semibold text-primary transition-all hover:bg-primary-container hover:text-on-primary-container"
                        title="View and download full GST invoice receipt"
                      >
                        <FileText size={13} />
                        Receipt
                      </button>

                      <button
                        onClick={() => onOpenSupport()}
                        className="flex items-center gap-1.5 rounded-full border border-outline-variant/50 bg-surface-container-low px-3.5 py-1.5 text-xs font-medium text-on-surface-variant transition-all hover:text-white hover:border-outline"
                      >
                        <PhoneCall size={13} />
                        Help
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-outline-variant/30 bg-surface-container/60 px-6 py-3 text-xs text-on-surface-variant">
          <span>Need help with an existing order? Visit GMC Care Counter or call 24/7.</span>
          <button
            onClick={onClose}
            className="rounded-full bg-primary-container px-4 py-1.5 font-semibold text-on-primary-container text-xs transition-opacity hover:opacity-90"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

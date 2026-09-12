import React, { useState } from 'react';

export default function Navbar({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  cartCount,
  onOpenCart,
  wishlistCount = 0,
  onOpenWishlist,
  ordersCount = 0,
  onOpenOrders,
  onOpenSupport,
  onOpenProfile,
  currentUser,
  onLogout,
  onOpenAdminDashboard,
  onOpenAuthModal
}) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleOrdersClick = () => {
    if (!currentUser) {
      if (onOpenAuthModal) {
        onOpenAuthModal('Sign in to view your previous orders & tracking status. 📦');
      }
      return;
    }
    if (onOpenOrders) onOpenOrders();
  };

  const scrollToSection = (sectionId, tabName) => {
    setActiveTab(tabName);
    setIsMobileMenuOpen(false);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav
      className="fixed top-0 z-50 flex h-16 w-full max-w-[1440px] items-center justify-between border-b border-outline-variant/20 bg-[#080d18]/90 px-3 sm:px-6 md:px-8 font-body-md text-body-md text-primary backdrop-blur-md transition-all duration-300 ease-in-out"
      style={{ left: '50%', transform: 'translateX(-50%)' }}
    >
      {/* Brand Logo & Mobile Menu Toggle */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white md:hidden"
          title="Toggle Navigation Menu"
        >
          <span className="material-symbols-outlined text-[20px]">
            {isMobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>

        {/* Brand Logo */}
        <div
          className="flex cursor-pointer items-center gap-2 group"
          onClick={() => {
            setActiveTab('smartphones');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <div className="relative h-9 w-9 sm:h-10 sm:w-10 shrink-0 overflow-hidden rounded-full border-2 border-amber-400/80 shadow-[0_0_12px_rgba(251,191,36,0.35)] transition-transform duration-300 group-hover:scale-105">
            <img
              src="/gmc_logo.jpg"
              alt="GMC Logo"
              className="h-full w-full object-cover scale-110"
            />
          </div>
          <span className="font-headline-sm text-lg sm:text-xl font-black tracking-tight text-primary group-hover:text-white transition-colors">
            GMC
          </span>
        </div>
      </div>

      {/* Desktop Nav Links */}
      <div className="hidden items-center gap-6 lg:gap-8 md:flex">
        <button
          className={`font-body-md text-sm transition-all hover:opacity-80 ${
            activeTab === 'smartphones'
              ? 'border-b-2 border-primary pb-1 font-bold text-primary'
              : 'text-on-surface-variant hover:text-primary'
          }`}
          onClick={() => scrollToSection('smartphones-section', 'smartphones')}
        >
          Smartphones
        </button>
        <button
          className={`font-body-md text-sm transition-all hover:opacity-80 ${
            activeTab === 'accessories'
              ? 'border-b-2 border-primary pb-1 font-bold text-primary'
              : 'text-on-surface-variant hover:text-primary'
          }`}
          onClick={() => scrollToSection('accessories-section', 'accessories')}
        >
          Accessories
        </button>
        <button
          className={`font-body-md text-sm transition-all hover:opacity-80 flex items-center gap-1 ${
            activeTab === 'offers'
              ? 'border-b-2 border-primary pb-1 font-bold text-primary'
              : 'text-on-surface-variant hover:text-primary'
          }`}
          onClick={() => scrollToSection('offers-section', 'offers')}
        >
          <span>Offers & Deals</span>
          <span className="rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 px-1.5 py-0.2 text-[9px] font-bold">
            HOT
          </span>
        </button>
        <button
          className="font-body-md text-sm text-on-surface-variant transition-all hover:text-primary hover:opacity-80 flex items-center gap-1.5"
          onClick={handleOrdersClick}
        >
          My Orders
          {ordersCount > 0 && (
            <span className="rounded-full bg-primary/20 text-primary border border-primary/30 px-1.5 py-0.2 text-[10px] font-bold">
              {ordersCount}
            </span>
          )}
        </button>
        <button
          className={`font-body-md text-sm transition-all hover:opacity-80 ${
            activeTab === 'customers'
              ? 'border-b-2 border-primary pb-1 font-bold text-primary'
              : 'text-on-surface-variant hover:text-primary'
          }`}
          onClick={() => scrollToSection('customer-experience-section', 'customers')}
        >
          Customer Diaries
        </button>
        <button
          className={`font-body-md text-sm transition-all hover:opacity-80 ${
            activeTab === 'support'
              ? 'border-b-2 border-primary pb-1 font-bold text-primary'
              : 'text-on-surface-variant hover:text-primary'
          }`}
          onClick={onOpenSupport}
        >
          Support
        </button>
      </div>

      {/* Nav Actions (Mobile & Desktop Responsive) */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Wishlist Button */}
        <button
          className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full hover:bg-white/10 transition-all text-on-surface-variant hover:text-red-400"
          onClick={onOpenWishlist}
          title="My Wishlist"
        >
          <span className="material-symbols-outlined text-[20px] sm:text-[22px]">favorite</span>
          {wishlistCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 font-headline-sm text-[9px] font-bold text-white shadow-[0_0_8px_rgba(239,68,68,0.5)]">
              {wishlistCount}
            </span>
          )}
        </button>

        {/* Orders Quick Button (visible on small screens too) */}
        <button
          className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full hover:bg-white/10 transition-all text-on-surface-variant hover:text-primary"
          onClick={handleOrdersClick}
          title="Previous Orders"
        >
          <span className="material-symbols-outlined text-[20px] sm:text-[22px]">receipt_long</span>
          {ordersCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary-container font-headline-sm text-[9px] font-bold text-on-primary-container">
              {ordersCount}
            </span>
          )}
        </button>

        {/* Shopping Cart Button */}
        <button
          className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full hover:bg-white/10 transition-all text-on-surface-variant hover:text-primary"
          onClick={onOpenCart}
          title="Shopping Cart"
        >
          <span className="material-symbols-outlined text-[20px] sm:text-[22px]">shopping_cart</span>
          {cartCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-cyan-400 font-headline-sm text-[10px] font-bold text-black shadow-[0_0_8px_rgba(0,240,255,0.5)]">
              {cartCount}
            </span>
          )}
        </button>

        {/* User Account / Profile or Sign In Button */}
        {currentUser ? (
          <div className="relative">
            <button
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 pl-1 pr-2 py-1 hover:bg-white/10 transition-all text-white"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              title="Account Menu"
            >
              <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center border border-primary/40 text-primary text-xs font-bold shrink-0">
                {currentUser?.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="h-full w-full object-cover" />
                ) : (
                  currentUser?.name?.charAt(0) || 'U'
                )}
              </div>
              <span className="text-[11px] sm:text-xs font-semibold max-w-[70px] sm:max-w-[90px] truncate hidden xs:inline">
                {currentUser?.name || 'User'}
              </span>
              <span className="material-symbols-outlined text-[14px] text-gray-400">
                {isUserMenuOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {/* User Menu Dropdown */}
            {isUserMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/10 bg-[#0f1523]/95 p-3 shadow-2xl backdrop-blur-xl z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="border-b border-white/10 pb-2.5 mb-2 px-1">
                    <p className="font-bold text-white truncate">{currentUser?.name || 'Customer'}</p>
                    <p className="text-[11px] text-gray-400 truncate">{currentUser?.email}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <div className="inline-flex items-center gap-1 rounded-full bg-cyan-400/10 border border-cyan-400/30 px-2 py-0.5 text-[9px] font-bold uppercase text-cyan-300">
                        {currentUser?.role === 'admin' ? '🛡️ Store Admin' : '👤 Customer'}
                      </div>
                    </div>
                  </div>

                  {currentUser?.role === 'admin' && (
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onOpenAdminDashboard && onOpenAdminDashboard();
                      }}
                      className="w-full flex items-center gap-2 rounded-xl px-2.5 py-2 text-amber-300 hover:bg-amber-400/10 font-bold transition-colors mb-1 text-left"
                    >
                      <span className="material-symbols-outlined text-[17px]">shield</span>
                      Admin Dashboard
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onOpenProfile && onOpenProfile();
                    }}
                    className="w-full flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-cyan-300 hover:bg-cyan-400/10 font-semibold transition-colors text-left mb-0.5"
                  >
                    <span className="material-symbols-outlined text-[17px]">manage_accounts</span>
                    My Profile & Address
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onOpenOrders && onOpenOrders();
                    }}
                    className="w-full flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-gray-300 hover:bg-white/5 transition-colors text-left"
                  >
                    <span className="material-symbols-outlined text-[17px]">receipt_long</span>
                    My Orders ({ordersCount})
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onOpenWishlist && onOpenWishlist();
                    }}
                    className="w-full flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-gray-300 hover:bg-white/5 transition-colors text-left"
                  >
                    <span className="material-symbols-outlined text-[17px]">favorite</span>
                    My Wishlist ({wishlistCount})
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onOpenSupport && onOpenSupport();
                    }}
                    className="w-full flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-gray-300 hover:bg-white/5 transition-colors text-left"
                  >
                    <span className="material-symbols-outlined text-[17px]">headset_mic</span>
                    Help & Support
                  </button>

                  <div className="border-t border-white/10 mt-2 pt-1.5">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onLogout && onLogout();
                      }}
                      className="w-full flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-red-400 hover:bg-red-500/10 font-semibold transition-colors text-left"
                    >
                      <span className="material-symbols-outlined text-[17px]">logout</span>
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <button
            onClick={() => onOpenAuthModal && onOpenAuthModal('Sign in to access your orders, saved addresses & exclusive discounts.')}
            className="flex items-center gap-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-black px-2.5 sm:px-3.5 py-1.5 text-[11px] sm:text-xs font-bold shadow-[0_0_12px_rgba(0,240,255,0.35)] hover:opacity-95 transition-all shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px] sm:text-[17px]">account_circle</span>
            <span>Sign In</span>
          </button>
        )}
      </div>

      {/* Mobile Slide-Down Menu for Phone Users */}
      {isMobileMenuOpen && (
        <div className="fixed top-16 left-0 right-0 bg-[#0b101c]/95 border-b border-white/15 p-4 backdrop-blur-xl shadow-2xl md:hidden z-50 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => scrollToSection('smartphones-section', 'smartphones')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'smartphones' ? 'bg-cyan-400 text-black' : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              <span>📱 Smartphones Catalog</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>

            <button
              onClick={() => scrollToSection('accessories-section', 'accessories')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'accessories' ? 'bg-cyan-400 text-black' : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              <span>🎧 Premium Accessories</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>

            <button
              onClick={() => scrollToSection('offers-section', 'offers')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'offers' ? 'bg-cyan-400 text-black' : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span>🔥 Offers & Deals</span>
                <span className="rounded-full bg-amber-500/20 text-amber-300 px-1.5 py-0.2 text-[9px] font-black">HOT</span>
              </div>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>

            <button
              onClick={() => scrollToSection('customer-experience-section', 'customers')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'customers' ? 'bg-cyan-400 text-black' : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              <span>📸 Customer Handover Diaries</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenSupport();
              }}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-gray-300 hover:bg-white/5 transition-colors"
            >
              <span>🛠️ Store Support & Repair Track</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

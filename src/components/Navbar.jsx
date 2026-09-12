import React from 'react';

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
  currentUser,
  onLogout,
  onOpenAdminDashboard
}) {
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);

  return (
    <nav
      className="fixed top-0 z-50 flex h-16 w-full max-w-[1440px] items-center justify-between border-b border-outline-variant/20 bg-surface-container/80 px-container-padding-mobile md:px-container-padding-desktop font-body-md text-body-md text-primary backdrop-blur-md transition-all duration-300 ease-in-out"
      style={{ left: '50%', transform: 'translateX(-50%)' }}
    >
      {/* Brand Logo with Official Signboard Image */}
      <div
        className="flex cursor-pointer items-center gap-2.5 sm:gap-3 group"
        onClick={() => {
          setActiveTab('smartphones');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        <div className="relative h-10 w-10 sm:h-11 sm:w-11 shrink-0 overflow-hidden rounded-full border-2 border-amber-400/70 shadow-[0_0_14px_rgba(251,191,36,0.35)] transition-transform duration-300 group-hover:scale-105">
          <img
            src="/gmc_logo.jpg"
            alt="GMC Logo"
            className="h-full w-full object-cover scale-110"
          />
        </div>
        <span className="font-headline-sm text-xl font-black tracking-tight text-primary group-hover:text-white transition-colors">
          GMC
        </span>
      </div>

      {/* Nav Links */}
      <div className="hidden items-center gap-lg md:flex">
        <button
          className={`font-body-md transition-all hover:opacity-80 ${
            activeTab === 'smartphones'
              ? 'border-b-2 border-primary pb-1 font-bold text-primary'
              : 'text-on-surface-variant hover:text-primary'
          }`}
          onClick={() => {
            setActiveTab('smartphones');
            const el = document.getElementById('smartphones-section');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          Smartphones
        </button>
        <button
          className={`font-body-md transition-all hover:opacity-80 ${
            activeTab === 'accessories'
              ? 'border-b-2 border-primary pb-1 font-bold text-primary'
              : 'text-on-surface-variant hover:text-primary'
          }`}
          onClick={() => {
            setActiveTab('accessories');
            const el = document.getElementById('accessories-section');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          Accessories
        </button>
        <button
          className={`font-body-md transition-all hover:opacity-80 flex items-center gap-1 ${
            activeTab === 'offers'
              ? 'border-b-2 border-primary pb-1 font-bold text-primary'
              : 'text-on-surface-variant hover:text-primary'
          }`}
          onClick={() => {
            setActiveTab('offers');
            const el = document.getElementById('offers-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span>Offers & Deals</span>
          <span className="rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 px-1.5 py-0.2 text-[9px] font-bold">
            HOT
          </span>
        </button>
        <button
          className="font-body-md text-on-surface-variant transition-all hover:text-primary hover:opacity-80 flex items-center gap-1.5"
          onClick={onOpenOrders}
        >
          My Orders
          {ordersCount > 0 && (
            <span className="rounded-full bg-primary/20 text-primary border border-primary/30 px-1.5 py-0.2 text-[10px] font-bold">
              {ordersCount}
            </span>
          )}
        </button>
        <button
          className={`font-body-md transition-all hover:opacity-80 ${
            activeTab === 'customers'
              ? 'border-b-2 border-primary pb-1 font-bold text-primary'
              : 'text-on-surface-variant hover:text-primary'
          }`}
          onClick={() => {
            setActiveTab('customers');
            const el = document.getElementById('customer-experience-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Customer Diaries
        </button>
        <button
          className={`font-body-md transition-all hover:opacity-80 ${
            activeTab === 'support'
              ? 'border-b-2 border-primary pb-1 font-bold text-primary'
              : 'text-on-surface-variant hover:text-primary'
          }`}
          onClick={onOpenSupport}
        >
          Support
        </button>
      </div>

      {/* Nav Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Wishlist Button */}
        <button
          className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface-container-highest hover:opacity-90 transition-all text-on-surface-variant hover:text-red-400"
          onClick={onOpenWishlist}
          title="My Wishlist"
        >
          <span className="material-symbols-outlined text-[22px]">favorite</span>
          {wishlistCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 font-headline-sm text-[10px] font-bold text-white shadow-[0_0_8px_rgba(239,68,68,0.5)]">
              {wishlistCount}
            </span>
          )}
        </button>

        {/* Orders Mobile/Quick Button */}
        <button
          className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface-container-highest hover:opacity-90 transition-all text-on-surface-variant hover:text-primary"
          onClick={onOpenOrders}
          title="Previous Orders"
        >
          <span className="material-symbols-outlined text-[22px]">receipt_long</span>
          {ordersCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-container font-headline-sm text-[10px] font-bold text-on-primary-container">
              {ordersCount}
            </span>
          )}
        </button>

        {/* Shopping Cart Button */}
        <button
          className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface-container-highest hover:opacity-90 transition-all text-on-surface-variant hover:text-primary"
          onClick={onOpenCart}
          title="Shopping Cart"
        >
          <span className="material-symbols-outlined text-[22px]">shopping_cart</span>
          {cartCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary-container font-headline-sm text-[10px] font-bold text-on-primary-container shadow-[0_0_8px_rgba(0,240,255,0.4)]">
              {cartCount}
            </span>
          )}
        </button>

        {/* User Account / Profile Dropdown */}
        <div className="relative">
          <button
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 pl-1 pr-2.5 py-1 hover:bg-surface-container-highest transition-all text-white"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            title="Account Menu"
          >
            <div className="h-7 w-7 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center border border-primary/40 text-primary text-xs font-bold">
              {currentUser?.avatar ? (
                <img src={currentUser.avatar} alt={currentUser.name} className="h-full w-full object-cover" />
              ) : (
                currentUser?.name?.charAt(0) || 'U'
              )}
            </div>
            <span className="text-xs font-semibold max-w-[90px] truncate hidden sm:inline">
              {currentUser?.name || 'User'}
            </span>
            <span className="material-symbols-outlined text-[16px] text-gray-400">
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
                    {currentUser?.isEmailVerified && (
                      <div className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 border border-emerald-400/30 px-2 py-0.5 text-[9px] font-bold text-emerald-300">
                        <span className="material-symbols-outlined text-[11px]">verified</span>
                        {currentUser?.provider === 'google' ? 'Google Auth' : 'OTP Verified'}
                      </div>
                    )}
                  </div>
                </div>

                {/* If Admin is previewing the store */}
                {currentUser?.role === 'admin' && (
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onOpenAdminDashboard && onOpenAdminDashboard();
                    }}
                    className="w-full flex items-center gap-2 rounded-xl px-2.5 py-2 text-amber-300 hover:bg-amber-400/10 font-bold transition-colors mb-1 text-left"
                  >
                    <span className="material-symbols-outlined text-[17px]">shield</span>
                    Open Admin Dashboard
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
                    onOpenOrders();
                  }}
                  className="w-full flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-gray-300 hover:bg-white/5 transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-[17px]">receipt_long</span>
                  My Orders ({ordersCount})
                </button>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onOpenWishlist();
                  }}
                  className="w-full flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-gray-300 hover:bg-white/5 transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-[17px]">favorite</span>
                  My Wishlist ({wishlistCount})
                </button>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onOpenSupport();
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
      </div>
    </nav>
  );
}


import React, { useState } from 'react';
import AddCustomerStoryModal from './AddCustomerStoryModal';

export default function AdminDashboard({
  adminUser,
  onLogout,
  onPreviewStore,
  products = [],
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  orders = [],
  onUpdateOrderStatus,
  onViewInvoice,
  stories = [],
  onAddStory,
  onDeleteStory,
  tradeInInquiries = [],
  onUpdateTradeInStatus,
  onDeleteTradeIn,
  repairs = [],
  onAddRepair,
  onUpdateRepairStatus,
  onDeleteRepair,
  users = [],
  loginSessions = [],
  onRefreshUsers
}) {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'inventory', 'trade-in', 'repairs', 'stories', 'users'
  const [orderFilter, setOrderFilter] = useState('all');
  const [productSearch, setProductSearch] = useState('');
  const [productBrandFilter, setProductBrandFilter] = useState('all');
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [isAddStoryOpen, setIsAddStoryOpen] = useState(false);

  // Form error state
  const [formError, setFormError] = useState('');

  // Add Product Form State
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProd, setNewProd] = useState({
    name: '',
    brand: 'apple',
    category: 'smartphones',
    price: '',
    subtitle: '',
    badge: 'In Stock',
    trending: false,
    image: '',
    specs: {
      display: '6.7" OLED 120Hz',
      processor: 'Flagship Processor',
      camera: '50MP Triple Camera',
      battery: '5000 mAh Fast Charge',
      storage: '128GB / 256GB',
      warranty: '1 Year Official Warranty'
    }
  });

  // Add Repair Ticket Modal State
  const [isAddRepairOpen, setIsAddRepairOpen] = useState(false);
  const [newRepair, setNewRepair] = useState({
    customerName: '',
    customerPhone: '',
    deviceModel: '',
    issue: 'Screen Replacement',
    estimatedCost: '3500',
    notes: 'Urgent turnaround requested'
  });

  // KPI Calculations
  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.total || 0), 0);
  const pendingOrders = orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled').length;

  const filteredOrders = orders.filter((ord) => {
    if (orderFilter === 'all') return true;
    return ord.status.toLowerCase() === orderFilter.toLowerCase();
  });

  const filteredProducts = products.filter((prod) => {
    const matchesSearch = prod.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      (prod.subtitle && prod.subtitle.toLowerCase().includes(productSearch.toLowerCase()));
    const matchesBrand = productBrandFilter === 'all' || prod.brand.toLowerCase() === productBrandFilter.toLowerCase();
    return matchesSearch && matchesBrand;
  });

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price) {
      setFormError('Please fill in product name and price.');
      return;
    }

    const priceNum = parseInt(newProd.price.toString().replace(/[^0-9]/g, ''), 10) || 19999;
    const created = {
      ...newProd,
      id: 'prod_' + Date.now(),
      price: priceNum,
      formattedPrice: `₹${priceNum.toLocaleString('en-IN')}`,
      image: newProd.image || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80'
    };

    onAddProduct(created);
    setFormError('');
    setIsAddProductOpen(false);
    setNewProd({
      name: '',
      brand: 'apple',
      category: 'smartphones',
      price: '',
      subtitle: '',
      badge: 'In Stock',
      trending: false,
      image: '',
      specs: {
        display: '6.7" OLED 120Hz',
        processor: 'Flagship Processor',
        camera: '50MP Triple Camera',
        battery: '5000 mAh Fast Charge',
        storage: '128GB / 256GB',
        warranty: '1 Year Official Warranty'
      }
    });
  };

  const handleCreateRepair = (e) => {
    e.preventDefault();
    if (!newRepair.customerName || !newRepair.deviceModel) {
      setFormError('Please provide customer name and device model.');
      return;
    }
    const created = {
      id: 'REP-' + Math.floor(1000 + Math.random() * 9000),
      ...newRepair,
      status: 'Received',
      receivedDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    onAddRepair(created);
    setFormError('');
    setIsAddRepairOpen(false);
    setNewRepair({
      customerName: '',
      customerPhone: '',
      deviceModel: '',
      issue: 'Screen Replacement',
      estimatedCost: '3500',
      notes: ''
    });
  };

  return (
    <div className="min-h-screen bg-[#080b11] text-white flex flex-col font-body-md">
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 border-b border-outline-variant/30 bg-[#0d121c]/95 px-4 sm:px-8 py-3.5 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Admin Title */}
        <div className="flex items-center gap-3.5">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border-2 border-amber-400/80 shadow-[0_0_15px_rgba(251,191,36,0.4)]">
            <img src="/gmc_logo.jpg" alt="GMC Admin" className="h-full w-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-headline-sm text-lg font-black tracking-tight text-white">
                GAGAN MOBILE CARE
              </span>
              <span className="rounded-md bg-amber-400/20 border border-amber-400/40 px-2 py-0.5 text-[10px] font-black uppercase text-amber-300 tracking-wider">
                Admin Console
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Logged in as <strong className="text-amber-200">{adminUser?.name || 'Gagan (Store Admin)'}</strong>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onPreviewStore}
            className="flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 px-3.5 py-2 text-xs font-bold text-cyan-300 transition-all hover:scale-[1.02] shadow-[0_0_15px_rgba(0,240,255,0.15)]"
          >
            <span className="material-symbols-outlined text-[17px]">visibility</span>
            <span>Preview User Store</span>
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 px-3.5 py-2 text-xs font-bold text-red-400 transition-all"
            title="Sign out of Admin Session"
          >
            <span className="material-symbols-outlined text-[17px]">logout</span>
            <span>Log Out</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6">
        
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 mb-8">
          {/* Revenue */}
          <div className="rounded-2xl border border-white/10 bg-[#0f1523] p-4 sm:p-5 shadow-lg relative overflow-hidden group hover:border-cyan-400/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Sales</span>
              <span className="material-symbols-outlined text-cyan-400 text-[20px]">payments</span>
            </div>
            <div className="mt-2 font-headline-sm text-xl sm:text-2xl font-black text-white">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </div>
            <p className="mt-1 text-[11px] text-cyan-400 font-medium">From {orders.length} orders recorded</p>
          </div>

          {/* Orders */}
          <div className="rounded-2xl border border-white/10 bg-[#0f1523] p-4 sm:p-5 shadow-lg relative overflow-hidden group hover:border-amber-400/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Orders</span>
              <span className="material-symbols-outlined text-amber-400 text-[20px]">inventory_2</span>
            </div>
            <div className="mt-2 font-headline-sm text-xl sm:text-2xl font-black text-white">
              {orders.length}
            </div>
            <p className="mt-1 text-[11px] text-amber-300 font-medium">{pendingOrders} active in pipeline</p>
          </div>

          {/* Products */}
          <div className="rounded-2xl border border-white/10 bg-[#0f1523] p-4 sm:p-5 shadow-lg relative overflow-hidden group hover:border-purple-400/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Catalog</span>
              <span className="material-symbols-outlined text-purple-400 text-[20px]">smartphone</span>
            </div>
            <div className="mt-2 font-headline-sm text-xl sm:text-2xl font-black text-white">
              {products.length}
            </div>
            <p className="mt-1 text-[11px] text-purple-300 font-medium">Smartphones & Accessories</p>
          </div>

          {/* Trade-Ins */}
          <div className="rounded-2xl border border-white/10 bg-[#0f1523] p-4 sm:p-5 shadow-lg relative overflow-hidden group hover:border-emerald-400/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Exchanges</span>
              <span className="material-symbols-outlined text-emerald-400 text-[20px]">published_with_changes</span>
            </div>
            <div className="mt-2 font-headline-sm text-xl sm:text-2xl font-black text-white">
              {tradeInInquiries.length}
            </div>
            <p className="mt-1 text-[11px] text-emerald-300 font-medium">Customer Trade-In Leads</p>
          </div>

          {/* Repairs */}
          <div className="col-span-2 sm:col-span-1 rounded-2xl border border-white/10 bg-[#0f1523] p-4 sm:p-5 shadow-lg relative overflow-hidden group hover:border-blue-400/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Repairs</span>
              <span className="material-symbols-outlined text-blue-400 text-[20px]">build</span>
            </div>
            <div className="mt-2 font-headline-sm text-xl sm:text-2xl font-black text-white">
              {repairs.length}
            </div>
            <p className="mt-1 text-[11px] text-blue-300 font-medium">Service & Diagnostics Desk</p>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex items-center border-b border-white/10 mb-6 overflow-x-auto scrollbar-none gap-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-amber-400 text-amber-300 font-bold'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[19px]">receipt_long</span>
            Customer Orders ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'inventory'
                ? 'border-cyan-400 text-cyan-300 font-bold'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[19px]">inventory</span>
            Manage Inventory ({products.length})
          </button>

          <button
            onClick={() => setActiveTab('trade-in')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'trade-in'
                ? 'border-emerald-400 text-emerald-300 font-bold'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[19px]">published_with_changes</span>
            Exchange Inquiries ({tradeInInquiries.length})
          </button>

          <button
            onClick={() => setActiveTab('repairs')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'repairs'
                ? 'border-blue-400 text-blue-300 font-bold'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[19px]">home_repair_service</span>
            Repair Desk ({repairs.length})
          </button>

          <button
            onClick={() => setActiveTab('stories')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'stories'
                ? 'border-pink-400 text-pink-300 font-bold'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[19px]">auto_stories</span>
            Customer Diaries ({stories.length})
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'users'
                ? 'border-purple-400 text-purple-300 font-bold'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[19px]">group</span>
            Users & Logins ({users.length})
          </button>
        </div>

        {/* TAB 1: ORDERS FULFILLMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Filter Sub-bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d131f] p-3.5 rounded-xl border border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 uppercase font-semibold">Filter Status:</span>
                {['all', 'Confirmed', 'Packed', 'Dispatched', 'Delivered'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      orderFilter.toLowerCase() === st.toLowerCase()
                        ? 'bg-amber-400 text-black font-bold'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {st === 'all' ? 'All Orders' : st}
                  </button>
                ))}
              </div>
              <span className="text-xs text-gray-400">
                Showing {filteredOrders.length} of {orders.length} records
              </span>
            </div>

            {/* Orders Cards Grid */}
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center rounded-2xl border border-white/5 bg-[#0f1523]">
                <span className="material-symbols-outlined text-4xl text-gray-500 mb-2">inbox</span>
                <p className="text-gray-400 text-sm">No orders matching the selected status.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-white/10 bg-[#0f1523] p-5 sm:p-6 shadow-md hover:border-amber-400/30 transition-all space-y-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/5 pb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-base font-bold text-amber-400">
                            {order.id}
                          </span>
                          <span className="text-xs text-gray-400">• {order.date}</span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                              order.status === 'Delivered'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : order.status === 'Dispatched'
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                : order.status === 'Packed'
                                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <div className="mt-1.5 text-sm text-gray-300">
                          Customer: <strong className="text-white">{order.customerName}</strong> • Phone:{' '}
                          <a href={`tel:${order.customerPhone}`} className="text-cyan-400 hover:underline">
                            {order.customerPhone}
                          </a>
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          Delivery: {order.deliveryAddress}
                        </div>
                      </div>

                      {/* Right: Actions & Total */}
                      <div className="text-right">
                        <div className="font-headline-sm text-xl font-black text-white">
                          ₹{order.total?.toLocaleString('en-IN')}
                        </div>
                        <div className="text-xs text-gray-400">{order.paymentMethod}</div>
                        <div className="mt-2 flex items-center justify-end gap-2">
                          <button
                            onClick={() => onViewInvoice && onViewInvoice(order)}
                            className="flex items-center gap-1 rounded-lg bg-white/5 hover:bg-white/10 px-2.5 py-1 text-xs text-gray-300 border border-white/10 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[15px]">description</span>
                            Tax Invoice
                          </button>
                          <a
                            href={`https://wa.me/91${order.customerPhone?.replace(/[^0-9]/g, '').slice(-10)}?text=Hello%20${encodeURIComponent(order.customerName)},%20update%20regarding%20your%20order%20${order.id}%20from%20Gagan%20Mobile%20Care:`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 px-2.5 py-1 text-xs text-emerald-300 border border-emerald-500/40 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[15px]">chat</span>
                            WhatsApp
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {order.items?.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 rounded-xl bg-black/30 p-2.5 border border-white/5"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-12 w-12 rounded-lg object-cover bg-white/5 shrink-0"
                          />
                          <div className="overflow-hidden">
                            <p className="text-xs font-semibold text-white truncate">{item.name}</p>
                            <p className="text-xs text-gray-400">
                              Qty: {item.quantity} × ₹{item.price?.toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Status Advance Controls */}
                    <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <span className="text-gray-400 font-semibold uppercase">Update Fulfillment Status:</span>
                      <div className="flex items-center gap-2">
                        {['Confirmed', 'Packed', 'Dispatched', 'Delivered'].map((stepStatus) => (
                          <button
                            key={stepStatus}
                            onClick={() => onUpdateOrderStatus && onUpdateOrderStatus(order.id, stepStatus)}
                            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                              order.status === stepStatus
                                ? 'bg-amber-400 text-black font-bold'
                                : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                            }`}
                          >
                            Mark {stepStatus}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INVENTORY & CATALOG */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d131f] p-4 rounded-xl border border-white/5">
              <div className="flex flex-wrap items-center gap-3 flex-1">
                {/* Search Bar */}
                <div className="relative min-w-[200px] flex-1 max-w-sm">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-[18px]">
                    search
                  </span>
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search model or specs..."
                    className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                {/* Brand Filter */}
                <select
                  value={productBrandFilter}
                  onChange={(e) => setProductBrandFilter(e.target.value)}
                  className="rounded-xl border border-white/10 bg-[#161d2d] px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="all">All Brands</option>
                  <option value="apple">Apple</option>
                  <option value="samsung">Samsung</option>
                  <option value="google">Google</option>
                  <option value="oneplus">OnePlus</option>
                  <option value="nothing">Nothing</option>
                  <option value="vivo">Vivo</option>
                  <option value="oppo">Oppo</option>
                </select>
              </div>

              {/* Add New Product Button */}
              <button
                onClick={() => setIsAddProductOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black px-4 py-2 text-xs font-bold shadow-md hover:scale-[1.02] transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                Add New Product
              </button>
            </div>

            {/* Products Table / Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="rounded-2xl border border-white/10 bg-[#0f1523] p-4 flex flex-col justify-between hover:border-cyan-400/40 transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="h-16 w-16 rounded-xl object-cover bg-white/5 border border-white/10 shrink-0"
                        />
                        <div>
                          <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                            {prod.brand}
                          </span>
                          <h4 className="font-bold text-white text-sm line-clamp-1">{prod.name}</h4>
                          <p className="font-headline-sm text-sm font-black text-amber-300">
                            ₹{prod.price?.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                      <span className="rounded-md bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] font-semibold text-gray-300">
                        {prod.badge || 'Active'}
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 mt-3 line-clamp-2">{prod.subtitle}</p>

                    {prod.specs && (
                      <div className="mt-2.5 rounded-lg bg-black/40 p-2 text-[11px] text-gray-400 space-y-1">
                        <div>📱 {prod.specs.display}</div>
                        <div>⚡ {prod.specs.processor}</div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                    <button
                      onClick={() =>
                        onUpdateProduct &&
                        onUpdateProduct(prod.id, { trending: !prod.trending })
                      }
                      className={`flex items-center gap-1 rounded-lg px-2.5 py-1 font-semibold transition-all ${
                        prod.trending
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                          : 'bg-white/5 text-gray-400 hover:text-white'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {prod.trending ? 'star' : 'star_border'}
                      </span>
                      {prod.trending ? 'Trending' : 'Normal'}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const newPrice = prompt(`Enter new price for ${prod.name}:`, prod.price);
                          if (newPrice && !isNaN(newPrice)) {
                            const val = parseInt(newPrice, 10);
                            onUpdateProduct &&
                              onUpdateProduct(prod.id, {
                                price: val,
                                formattedPrice: `₹${val.toLocaleString('en-IN')}`
                              });
                          }
                        }}
                        className="rounded-lg bg-white/5 hover:bg-white/10 px-2.5 py-1 text-gray-300 border border-white/10"
                        title="Quick Edit Price"
                      >
                        Edit Price
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Remove ${prod.name} from catalog?`)) {
                            onDeleteProduct && onDeleteProduct(prod.id);
                          }
                        }}
                        className="rounded-lg bg-red-500/10 hover:bg-red-500/20 px-2 py-1 text-red-400 border border-red-500/30"
                        title="Delete Product"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: TRADE-IN & EXCHANGES */}
        {activeTab === 'trade-in' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-[#0d131f] p-4 rounded-xl border border-white/5">
              <div>
                <h3 className="font-bold text-white text-base">Exchange & Trade-In Inquiries</h3>
                <p className="text-xs text-gray-400">
                  Customers who estimated their old phone value online and submitted an exchange request.
                </p>
              </div>
            </div>

            {tradeInInquiries.length === 0 ? (
              <div className="p-12 text-center rounded-2xl border border-white/5 bg-[#0f1523]">
                <span className="material-symbols-outlined text-4xl text-gray-500 mb-2">devices</span>
                <p className="text-gray-400 text-sm">No pending exchange requests at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tradeInInquiries.map((req) => (
                  <div
                    key={req.id}
                    className="rounded-2xl border border-white/10 bg-[#0f1523] p-5 space-y-3 hover:border-emerald-400/40 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-emerald-400">
                          {req.id} • {req.date}
                        </span>
                        <h4 className="font-bold text-white text-base mt-0.5">{req.deviceName}</h4>
                        <p className="text-xs text-gray-400">Condition: <strong className="text-gray-200">{req.condition}</strong></p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-400">Est. Exchange Value</span>
                        <div className="font-headline-sm text-lg font-black text-emerald-400">
                          ₹{req.estimatedValue?.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl bg-black/40 p-3 text-xs text-gray-300 border border-white/5 space-y-1">
                      <div>👤 Customer: <strong className="text-white">{req.customerName}</strong></div>
                      <div>📞 Phone: <strong className="text-cyan-400">{req.customerPhone}</strong></div>
                      {req.targetDevice && (
                        <div>🎯 Upgrading to: <span className="text-amber-300 font-semibold">{req.targetDevice}</span></div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          req.status === 'Completed'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : req.status === 'Contacted'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        }`}
                      >
                        {req.status || 'Pending Review'}
                      </span>

                      <div className="flex items-center gap-2">
                        <a
                          href={`https://wa.me/91${req.customerPhone?.replace(/[^0-9]/g, '').slice(-10)}?text=Hello%20${encodeURIComponent(req.customerName)},%20we%20received%20your%20Trade-In%20request%20for%20${encodeURIComponent(req.deviceName)}%20at%20Gagan%20Mobile%20Care.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 px-3 py-1.5 text-xs text-emerald-300 border border-emerald-500/40 font-semibold"
                        >
                          <span className="material-symbols-outlined text-[15px]">chat</span>
                          WhatsApp
                        </a>

                        <button
                          onClick={() =>
                            onUpdateTradeInStatus &&
                            onUpdateTradeInStatus(
                              req.id,
                              req.status === 'Contacted' ? 'Completed' : 'Contacted'
                            )
                          }
                          className="rounded-lg bg-white/5 hover:bg-white/10 px-3 py-1.5 text-gray-300 border border-white/10 font-semibold"
                        >
                          {req.status === 'Contacted' ? 'Mark Completed' : 'Mark Contacted'}
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Delete exchange inquiry #${req.id}?`)) {
                              onDeleteTradeIn && onDeleteTradeIn(req.id);
                            }
                          }}
                          className="rounded-lg bg-red-500/10 hover:bg-red-500/20 px-2 py-1.5 text-red-400 border border-red-500/30"
                          title="Delete inquiry"
                        >
                          <span className="material-symbols-outlined text-[15px]">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: REPAIR DESK */}
        {activeTab === 'repairs' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d131f] p-4 rounded-xl border border-white/5">
              <div>
                <h3 className="font-bold text-white text-base">Service & Diagnostics Desk</h3>
                <p className="text-xs text-gray-400">
                  Track in-store smartphone repairs, hardware parts replacement, and customer notifications.
                </p>
              </div>

              <button
                onClick={() => setIsAddRepairOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-400 to-cyan-500 text-black px-4 py-2 text-xs font-bold shadow-md hover:scale-[1.02] transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">build</span>
                Add Repair Ticket
              </button>
            </div>

            {repairs.length === 0 ? (
              <div className="p-12 text-center rounded-2xl border border-white/5 bg-[#0f1523]">
                <span className="material-symbols-outlined text-4xl text-gray-500 mb-2">build_circle</span>
                <p className="text-gray-400 text-sm">No active repair tickets logged.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {repairs.map((rep) => (
                  <div
                    key={rep.id}
                    className="rounded-2xl border border-white/10 bg-[#0f1523] p-5 space-y-3 hover:border-blue-400/40 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-blue-400">
                          {rep.id} • Received: {rep.receivedDate}
                        </span>
                        <h4 className="font-bold text-white text-base mt-0.5">{rep.deviceModel}</h4>
                        <p className="text-xs text-red-400 font-semibold flex items-center gap-1 mt-0.5">
                          <span className="material-symbols-outlined text-[14px]">warning</span>
                          {rep.issue}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-400">Est. Repair Cost</span>
                        <div className="font-headline-sm text-lg font-black text-white">
                          ₹{parseInt(rep.estimatedCost || 0, 10).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl bg-black/40 p-3 text-xs text-gray-300 border border-white/5 space-y-1">
                      <div>👤 Customer: <strong className="text-white">{rep.customerName}</strong></div>
                      <div>📞 Phone: <strong className="text-cyan-400">{rep.customerPhone}</strong></div>
                      {rep.notes && <div className="text-gray-400 italic">📝 Notes: {rep.notes}</div>}
                    </div>

                    {/* Progress Steps */}
                    <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5">
                        {['Received', 'Repairing', 'Ready', 'Delivered'].map((step) => (
                          <button
                            key={step}
                            onClick={() => onUpdateRepairStatus && onUpdateRepairStatus(rep.id, step)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                              rep.status === step
                                ? 'bg-blue-400 text-black font-bold shadow-[0_0_10px_rgba(96,165,250,0.4)]'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                          >
                            {step}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`https://wa.me/91${rep.customerPhone?.replace(/[^0-9]/g, '').slice(-10)}?text=Hello%20${encodeURIComponent(rep.customerName)},%20your%20device%20${encodeURIComponent(rep.deviceModel)}%20repair%20status%20is:%20${encodeURIComponent(rep.status)}%20at%20Gagan%20Mobile%20Care.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 px-2.5 py-1 text-xs text-emerald-300 border border-emerald-500/40"
                        >
                          <span className="material-symbols-outlined text-[14px]">chat</span>
                          Notify
                        </a>

                        <button
                          onClick={() => {
                            if (confirm(`Delete repair ticket #${rep.id}?`)) {
                              onDeleteRepair && onDeleteRepair(rep.id);
                            }
                          }}
                          className="rounded-lg bg-red-500/10 hover:bg-red-500/20 px-2 py-1 text-red-400 border border-red-500/30"
                          title="Delete ticket"
                        >
                          <span className="material-symbols-outlined text-[14px]">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: CUSTOMER DIARIES */}
        {activeTab === 'stories' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d131f] p-4 rounded-xl border border-white/5">
              <div>
                <h3 className="font-bold text-white text-base">Customer Diaries & Verified Purchases</h3>
                <p className="text-xs text-gray-400">
                  Customer reviews and photo handover moments displayed on the storefront.
                </p>
              </div>

              <button
                onClick={() => setIsAddStoryOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-pink-500/25 hover:from-pink-600 hover:to-rose-700 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">video_camera_back</span>
                Add Photo / Video Diary
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {stories.map((st) => {
                const isVideo =
                  st.mediaType === 'video' ||
                  st.videoUrl ||
                  (typeof st.image === 'string' &&
                    (st.image.startsWith('data:video') ||
                      st.image.endsWith('.mp4') ||
                      st.image.endsWith('.webm') ||
                      st.image.endsWith('.mov') ||
                      st.image.includes('.mp4')));

                return (
                  <div
                    key={st.id}
                    className="rounded-2xl border border-white/10 bg-[#0f1523] p-4 flex flex-col justify-between hover:border-pink-400/40 transition-all"
                  >
                    <div>
                      <div className="relative h-44 w-full rounded-xl overflow-hidden mb-3 bg-black flex items-center justify-center">
                        {isVideo ? (
                          <video
                            src={st.image || st.videoUrl}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <img
                            src={st.image}
                            alt={st.customerName}
                            className="h-full w-full object-cover"
                          />
                        )}

                        <span className="absolute top-2 left-2 rounded-full bg-black/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white border border-white/20 flex items-center gap-1">
                          {isVideo ? '🎥 Video' : '📷 Photo'}
                        </span>

                        <span className="absolute top-2 right-2 rounded-full bg-black/70 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-400/30">
                          {st.phoneBought}
                        </span>
                      </div>

                      <h4 className="font-bold text-white text-sm">{st.customerName}</h4>
                      <p className="text-xs text-gray-400">
                        {st.storeLocation || st.location || 'GMC Store'} • {st.date}
                      </p>
                      <p className="text-xs text-gray-300 mt-2 line-clamp-3 italic">
                        "{st.feedback || st.quote || 'Great buying experience at Gagan Mobile Care!'}"
                      </p>
                    </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">verified</span>
                      Live on Site
                    </span>

                    <button
                      onClick={() => {
                        if (confirm(`Remove diary entry for ${st.customerName}?`)) {
                          onDeleteStory && onDeleteStory(st.id);
                        }
                      }}
                      className="rounded-lg bg-red-500/10 hover:bg-red-500/20 px-2.5 py-1 text-red-400 border border-red-500/30"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        )}

        {/* TAB 6: USERS DIRECTORY & LOGIN AUDIT LOG */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Filter & Action Sub-bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d131f] p-3.5 rounded-xl border border-white/5">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Search by name, email, phone..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-64 sm:w-80 rounded-xl border border-white/10 bg-[#161d2d] pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-400 uppercase font-semibold">Role:</span>
                  {['all', 'user', 'admin'].map((role) => (
                    <button
                      key={role}
                      onClick={() => setUserRoleFilter(role)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                        userRoleFilter === role
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40'
                          : 'bg-white/5 text-gray-400 hover:text-white border border-transparent'
                      }`}
                    >
                      {role === 'all' ? 'All Roles' : role === 'admin' ? '🛡️ Admin' : '👤 Customers'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onRefreshUsers && onRefreshUsers()}
                  className="flex items-center gap-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 px-3 py-1.5 text-xs font-semibold text-purple-300 transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">sync</span>
                  Refresh Live Data
                </button>
              </div>
            </div>

            {/* 1. REGISTERED USERS DIRECTORY */}
            <div className="rounded-2xl border border-white/10 bg-[#0f1523] p-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple-400 text-[22px]">badge</span>
                  <h3 className="font-headline-sm text-base font-bold text-white">
                    Registered Accounts & Identity Profiles
                  </h3>
                </div>
                <span className="text-xs text-gray-400 font-mono">
                  {
                    users.filter((u) => {
                      const matchesSearch =
                        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                        u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
                        (u.phone && u.phone.includes(userSearch));
                      const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
                      return matchesSearch && matchesRole;
                    }).length
                  } Accounts
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-white/5 text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
                    <tr>
                      <th className="p-3">User / Identity</th>
                      <th className="p-3">Email Address</th>
                      <th className="p-3">Phone Number</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Address</th>
                      <th className="p-3">Joined On</th>
                      <th className="p-3">Last Active / Login</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {users
                      .filter((u) => {
                        const matchesSearch =
                          u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                          u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
                          (u.phone && u.phone.includes(userSearch));
                        const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
                        return matchesSearch && matchesRole;
                      })
                      .map((u) => (
                        <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-3">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={u.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(u.name)}`}
                                alt={u.name}
                                className="h-8 w-8 rounded-full object-cover border border-white/10 bg-black"
                              />
                              <div>
                                <div className="font-semibold text-white">{u.name}</div>
                                <div className="text-[10px] text-gray-500 font-mono">{u.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 font-mono text-cyan-300">{u.email}</td>
                          <td className="p-3 text-gray-200">{u.phone || '+91 98726-22624'}</td>
                          <td className="p-3">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                u.role === 'admin'
                                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                                  : 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/40'
                              }`}
                            >
                              {u.role === 'admin' ? '🛡️ Admin' : '👤 Customer'}
                            </span>
                          </td>
                          <td className="p-3 text-gray-400">{u.address || 'Maur Mandi, Punjab'}</td>
                          <td className="p-3 font-mono text-gray-400">
                            {u.createdAt || u.created_at
                              ? new Date(u.createdAt || u.created_at).toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                                })
                              : 'Verified'}
                          </td>
                          <td className="p-3 font-mono text-purple-300 font-medium">
                            {u.last_login_at
                              ? new Date(u.last_login_at).toLocaleString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              : 'Active now'}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 2. REAL-TIME LOGIN AUDIT TRAIL */}
            <div className="rounded-2xl border border-white/10 bg-[#0f1523] p-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-cyan-400 text-[22px]">history</span>
                  <h3 className="font-headline-sm text-base font-bold text-white">
                    Live Login Activity & PostgreSQL Audit Trail
                  </h3>
                </div>
                <span className="text-xs text-gray-400 font-mono">
                  {loginSessions.length} Login Events Logged
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-white/5 text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
                    <tr>
                      <th className="p-3">User Identity</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">IP Address</th>
                      <th className="p-3">Device / Client</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loginSessions.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="p-6 text-center text-gray-500">
                          No login session records in database yet.
                        </td>
                      </tr>
                    ) : (
                      loginSessions.map((sess) => (
                        <tr key={sess.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-3 font-semibold text-white">{sess.user_name}</td>
                          <td className="p-3 font-mono text-cyan-300">{sess.user_email}</td>
                          <td className="p-3">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                sess.role === 'admin'
                                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                                  : 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/40'
                              }`}
                            >
                              {sess.role}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-gray-400">{sess.ip_address || '127.0.0.1'}</td>
                          <td className="p-3 text-gray-400 truncate max-w-xs">{sess.device_info || 'Web Client'}</td>
                          <td className="p-3">
                            <span className="inline-flex items-center gap-1 rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                              ✓ {sess.status || 'Authenticated'}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-purple-300">
                            {sess.login_time
                              ? new Date(sess.login_time).toLocaleString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  second: '2-digit'
                                })
                              : 'Recent'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* MODAL: ADD PRODUCT */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#0f1523] p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <h3 className="font-headline-sm text-lg font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-cyan-400">add_box</span>
                Add New Product to GMC Catalog
              </h3>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              {formError && (
                <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-2.5 text-xs text-red-300 font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">error</span>
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={newProd.name}
                    onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                    placeholder="e.g. OnePlus 12 5G"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Price (₹ INR)</label>
                  <input
                    type="number"
                    required
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                    placeholder="e.g. 64999"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Brand</label>
                  <select
                    value={newProd.brand}
                    onChange={(e) => setNewProd({ ...newProd, brand: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#161d2d] px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="apple">Apple</option>
                    <option value="samsung">Samsung</option>
                    <option value="google">Google</option>
                    <option value="oneplus">OnePlus</option>
                    <option value="nothing">Nothing</option>
                    <option value="vivo">Vivo</option>
                    <option value="oppo">Oppo</option>
                    <option value="xiaomi">Xiaomi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Category</label>
                  <select
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#161d2d] px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="smartphones">Smartphones</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-semibold mb-1">Subtitle / Highlight Tagline</label>
                <input
                  type="text"
                  value={newProd.subtitle}
                  onChange={(e) => setNewProd({ ...newProd, subtitle: e.target.value })}
                  placeholder="e.g. Snapdragon 8 Gen 3, Hasselblad Camera"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-semibold mb-1">Image URL (Optional)</label>
                <input
                  type="url"
                  value={newProd.image}
                  onChange={(e) => setNewProd({ ...newProd, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Display Specs</label>
                  <input
                    type="text"
                    value={newProd.specs.display}
                    onChange={(e) =>
                      setNewProd({
                        ...newProd,
                        specs: { ...newProd.specs, display: e.target.value }
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Processor Specs</label>
                  <input
                    type="text"
                    value={newProd.specs.processor}
                    onChange={(e) =>
                      setNewProd({
                        ...newProd,
                        specs: { ...newProd.specs, processor: e.target.value }
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="trending-check"
                  checked={newProd.trending}
                  onChange={(e) => setNewProd({ ...newProd, trending: e.target.checked })}
                  className="rounded bg-white/10 text-cyan-400 focus:ring-0"
                />
                <label htmlFor="trending-check" className="text-gray-300 font-semibold">
                  Feature in "Trending Phones / Best Sellers" on Storefront
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="rounded-xl px-4 py-2 text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-2 font-bold text-black shadow-lg hover:scale-[1.02] transition-all"
                >
                  Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD REPAIR TICKET */}
      {isAddRepairOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0f1523] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <h3 className="font-headline-sm text-base font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-400">build</span>
                New Walk-In Repair Ticket
              </h3>
              <button
                onClick={() => setIsAddRepairOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateRepair} className="space-y-3.5 text-xs">
              {formError && (
                <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-2.5 text-xs text-red-300 font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">error</span>
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-gray-400 font-semibold mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={newRepair.customerName}
                  onChange={(e) => setNewRepair({ ...newRepair, customerName: e.target.value })}
                  placeholder="e.g. Gurpreet Singh"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-semibold mb-1">Customer Phone</label>
                <input
                  type="tel"
                  required
                  value={newRepair.customerPhone}
                  onChange={(e) => setNewRepair({ ...newRepair, customerPhone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-semibold mb-1">Device Model</label>
                <input
                  type="text"
                  required
                  value={newRepair.deviceModel}
                  onChange={(e) => setNewRepair({ ...newRepair, deviceModel: e.target.value })}
                  placeholder="e.g. iPhone 13 / Samsung A54"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Issue Type</label>
                  <select
                    value={newRepair.issue}
                    onChange={(e) => setNewRepair({ ...newRepair, issue: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#161d2d] px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="Screen Replacement">Screen Replacement</option>
                    <option value="Battery Replacement">Battery Replacement</option>
                    <option value="Charging Port Repair">Charging Port Repair</option>
                    <option value="Camera Lens Fix">Camera Lens Fix</option>
                    <option value="Water Damage Treatment">Water Damage Treatment</option>
                    <option value="Software / OS Issue">Software / OS Issue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Estimated Cost (₹)</label>
                  <input
                    type="number"
                    value={newRepair.estimatedCost}
                    onChange={(e) => setNewRepair({ ...newRepair, estimatedCost: e.target.value })}
                    placeholder="3500"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-semibold mb-1">Diagnostics Notes</label>
                <textarea
                  rows="2"
                  value={newRepair.notes}
                  onChange={(e) => setNewRepair({ ...newRepair, notes: e.target.value })}
                  placeholder="e.g. OEM display requested, customer collecting tomorrow 5 PM"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddRepairOpen(false)}
                  className="rounded-xl px-4 py-2 text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-blue-400 to-cyan-500 px-5 py-2 font-bold text-black shadow-lg hover:scale-[1.02] transition-all"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Customer Story / Diary Modal */}
      <AddCustomerStoryModal
        isOpen={isAddStoryOpen}
        onClose={() => setIsAddStoryOpen(false)}
        onAddStory={onAddStory}
      />
    </div>
  );
}

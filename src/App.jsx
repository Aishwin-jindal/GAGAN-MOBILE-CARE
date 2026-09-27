import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import BrandSelector from './components/BrandSelector';
import TrendingPhones from './components/TrendingPhones';
import LatestOffers from './components/LatestOffers';
import PremiumAccessories from './components/PremiumAccessories';
import ProductDetailModal from './components/ProductDetailModal';
import TradeInModal from './components/TradeInModal';
import CartDrawer from './components/CartDrawer';
import SupportModal from './components/SupportModal';
import Footer from './components/Footer';
import OrdersModal from './components/OrdersModal';
import WishlistModal from './components/WishlistModal';
import InvoiceReceiptModal from './components/InvoiceReceiptModal';
import CustomerExperience from './components/CustomerExperience';
import AddCustomerStoryModal from './components/AddCustomerStoryModal';
import StoryLightboxModal from './components/StoryLightboxModal';
import ProfileModal from './components/ProfileModal';

// Auth & Admin components
import AuthGate from './components/AuthGate';
import AdminDashboard from './components/AdminDashboard';

import { PRODUCTS } from './data/products';
import { INITIAL_ORDERS, INITIAL_WISHLIST } from './data/orders';
import { INITIAL_CUSTOMER_STORIES } from './data/customerStories';
import { INITIAL_REGISTERED_USERS, getRegisteredUsers, updateUserProfile } from './data/users';
import {
  getProductsFromDb,
  createProductInDb,
  updateProductInDb,
  deleteProductInDb,
  getOrdersFromDb,
  createOrderInDb,
  updateOrderStatusInDb,
  getStoriesFromDb,
  createStoryInDb,
  deleteStoryInDb,
  getUserCartFromDb,
  saveUserCartInDb,
  getUserWishlistFromDb,
  saveUserWishlistInDb,
  updateUserProfileInDb,
  getUsersFromDb,
  getLoginsFromDb,
  recordLoginInDb,
  getRepairsFromDb,
  createRepairInDb,
  updateRepairStatusInDb,
  deleteRepairInDb,
  getTradeInsFromDb,
  createTradeInInDb,
  updateTradeInStatusInDb,
  deleteTradeInInDb
} from './services/api';

export default function App() {
  // Authentication & Role state (persisted)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('gmc_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [adminPreviewMode, setAdminPreviewMode] = useState(false);
  const [users, setUsers] = useState(INITIAL_REGISTERED_USERS);
  const [loginSessions, setLoginSessions] = useState([]);

  // Auth Modal state for login / signup prompts
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authPromptMessage, setAuthPromptMessage] = useState('');
  const [authModalMode, setAuthModalMode] = useState('user-login');

  const openAuthModal = (message = '', mode = 'user-login') => {
    setAuthPromptMessage(message);
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  // Toast Notification state
  const [toast, setToast] = useState(null);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const refreshUsersAndLogins = async () => {
    try {
      const [dbUsers, dbLogins] = await Promise.all([
        getUsersFromDb(),
        getLoginsFromDb()
      ]);
      if (dbUsers && dbUsers.length > 0) {
        setUsers(dbUsers);
      } else {
        setUsers(getRegisteredUsers());
      }
      if (dbLogins && dbLogins.length > 0) {
        setLoginSessions(dbLogins);
      }
    } catch (e) {
      console.warn('Failed to sync users/logins:', e);
    }
  };

  const handleLogin = async (user, remember = true) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    if (remember) {
      try {
        localStorage.setItem('gmc_auth_user', JSON.stringify(user));
      } catch (e) {}
    }
    showToast(`Welcome back, ${user.name}! 🚀`);
    await recordLoginInDb(user);
    refreshUsersAndLogins();
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAdminPreviewMode(false);
    try {
      localStorage.removeItem('gmc_auth_user');
    } catch (e) {}
    showToast('Signed out successfully.');
  };

  // ----------------------------------------------------
  // PostgreSQL Database Real-time Sync
  // ----------------------------------------------------
  useEffect(() => {
    async function loadDataFromDb() {
      const dbProducts = await getProductsFromDb();
      if (dbProducts && dbProducts.length > 0) {
        setProducts(dbProducts);
      }
      const dbOrders = await getOrdersFromDb();
      if (dbOrders && dbOrders.length > 0) {
        setOrders(dbOrders);
      }
      const dbStories = await getStoriesFromDb();
      if (dbStories && dbStories.length > 0) {
        setStories(dbStories);
      }
      const dbRepairs = await getRepairsFromDb();
      if (dbRepairs && dbRepairs.length > 0) {
        setRepairs(dbRepairs);
      }
      const dbTradeIns = await getTradeInsFromDb();
      if (dbTradeIns && dbTradeIns.length > 0) {
        setTradeInInquiries(dbTradeIns);
      }
      refreshUsersAndLogins();
    }
    loadDataFromDb();
  }, []);

  // Products state (allows Admin to add, update price, delete products)
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('gmc_custom_products');
      return saved ? JSON.parse(saved) : PRODUCTS;
    } catch (e) {
      return PRODUCTS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('gmc_custom_products', JSON.stringify(products));
    } catch (e) {}
  }, [products]);

  const handleAddProduct = async (newProd) => {
    setProducts((prev) => [newProd, ...prev]);
    showToast(`Added ${newProd.name} to GMC catalog!`);
    await createProductInDb(newProd);
  };

  const handleUpdateProduct = async (id, updates) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    showToast('Product updated successfully.');
    await updateProductInDb(id, updates);
  };

  const handleDeleteProduct = async (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product removed from catalog.');
    await deleteProductInDb(id);
  };

  // Navigation & Filtering state
  const [activeTab, setActiveTab] = useState('smartphones'); // 'smartphones', 'accessories', 'offers'
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // User Profile modal state
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleUpdateProfile = async (updatedUser) => {
    setCurrentUser(updatedUser);
    try {
      localStorage.setItem('gmc_auth_user', JSON.stringify(updatedUser));
      updateUserProfile(updatedUser);
    } catch (e) {}
    showToast('Profile & delivery details saved permanently! ✨');
    await updateUserProfileInDb(updatedUser);
  };

  // Cart state (persisted per active user)
  const [cartItems, setCartItems] = useState(() => {
    try {
      const userKey = currentUser?.id || 'guest';
      const saved = localStorage.getItem(`gmc_cart_${userKey}`);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    if (currentUser?.id) {
      try {
        const saved = localStorage.getItem(`gmc_cart_${currentUser.id}`);
        setCartItems(saved ? JSON.parse(saved) : []);
      } catch (e) {}

      getUserCartFromDb(currentUser.id).then((dbCart) => {
        if (dbCart && Array.isArray(dbCart) && dbCart.length > 0) {
          setCartItems(dbCart);
        }
      });
    }
  }, [currentUser?.id]);

  useEffect(() => {
    if (currentUser?.id) {
      try {
        localStorage.setItem(`gmc_cart_${currentUser.id}`, JSON.stringify(cartItems));
      } catch (e) {}
      saveUserCartInDb(currentUser.id, cartItems);
    }
  }, [cartItems, currentUser?.id]);

  const [tradeInDiscount, setTradeInDiscount] = useState(0);
  const [tradeInDevice, setTradeInDevice] = useState('');
  const [appliedOffer, setAppliedOffer] = useState(null);

  // Previous Orders state (persisted globally & filtered per user)
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('gmc_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch (e) {
      return INITIAL_ORDERS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('gmc_orders', JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    showToast(`Order #${orderId} marked as ${newStatus}`);
    await updateOrderStatusInDb(orderId, newStatus);
  };

  // Wishlist state (persisted per active user)
  const [wishlist, setWishlist] = useState(() => {
    try {
      const userKey = currentUser?.id || 'guest';
      const saved = localStorage.getItem(`gmc_wishlist_${userKey}`);
      return saved ? JSON.parse(saved) : (currentUser?.role === 'admin' ? INITIAL_WISHLIST : []);
    } catch (e) {
      return INITIAL_WISHLIST;
    }
  });

  useEffect(() => {
    if (currentUser?.id) {
      try {
        const saved = localStorage.getItem(`gmc_wishlist_${currentUser.id}`);
        setWishlist(saved ? JSON.parse(saved) : (currentUser.role === 'admin' ? INITIAL_WISHLIST : []));
      } catch (e) {}

      getUserWishlistFromDb(currentUser.id).then((dbWishlist) => {
        if (dbWishlist && Array.isArray(dbWishlist) && dbWishlist.length > 0) {
          setWishlist(dbWishlist);
        }
      });
    }
  }, [currentUser?.id]);

  useEffect(() => {
    if (currentUser?.id) {
      try {
        localStorage.setItem(`gmc_wishlist_${currentUser.id}`, JSON.stringify(wishlist));
      } catch (e) {}
      saveUserWishlistInDb(currentUser.id, wishlist);
    }
  }, [wishlist, currentUser?.id]);

  // Customer Experience Stories state (persisted)
  const [stories, setStories] = useState(() => {
    try {
      const saved = localStorage.getItem('gmc_customer_stories');
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMER_STORIES;
    } catch (e) {
      return INITIAL_CUSTOMER_STORIES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('gmc_customer_stories', JSON.stringify(stories));
    } catch (e) {}
  }, [stories]);

  const [isAddStoryOpen, setIsAddStoryOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);

  const handleAddStory = async (newStory) => {
    setStories((prev) => [newStory, ...prev]);
    showToast(`🎉 New Customer Story for ${newStory.customerName} published!`);
    await createStoryInDb(newStory);
  };

  const handleDeleteStory = async (storyId) => {
    setStories((prev) => prev.filter((s) => s.id !== storyId));
    showToast('Customer story deleted.');
    await deleteStoryInDb(storyId);
  };

  // Trade-In inquiries state (persisted for Admin)
  const [tradeInInquiries, setTradeInInquiries] = useState(() => {
    try {
      const saved = localStorage.getItem('gmc_trade_inquiries');
      return saved ? JSON.parse(saved) : [
        {
          id: 'EXC-1092',
          date: '06 Sep 2024',
          customerName: 'Aman Sharma',
          customerPhone: '+91 98142 88219',
          deviceName: 'iPhone 13 128GB Blue',
          condition: 'Flawless',
          estimatedValue: 34500,
          targetDevice: 'iPhone 16 Pro Max',
          status: 'Pending Review'
        },
        {
          id: 'EXC-1088',
          date: '04 Sep 2024',
          customerName: 'Simran Kaur',
          customerPhone: '+91 94630 11928',
          deviceName: 'Samsung S21 FE 5G',
          condition: 'Good (Minor Scratches)',
          estimatedValue: 16800,
          targetDevice: 'Samsung S24 Ultra',
          status: 'Contacted'
        }
      ];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('gmc_trade_inquiries', JSON.stringify(tradeInInquiries));
    } catch (e) {}
  }, [tradeInInquiries]);

  const handleUpdateTradeInStatus = async (id, status) => {
    setTradeInInquiries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
    showToast(`Exchange inquiry #${id} status updated to ${status}`);
    await updateTradeInStatusInDb(id, status);
  };

  const handleDeleteTradeIn = async (id) => {
    setTradeInInquiries((prev) => prev.filter((item) => item.id !== id));
    showToast(`Trade-in inquiry #${id} deleted.`);
    await deleteTradeInInDb(id);
  };

  // Repairs desk state (persisted for Admin)
  const [repairs, setRepairs] = useState(() => {
    try {
      const saved = localStorage.getItem('gmc_repairs');
      return saved ? JSON.parse(saved) : [
        {
          id: 'REP-7731',
          receivedDate: '07 Sep 2024',
          customerName: 'Harpreet Singh',
          customerPhone: '+91 98789 22345',
          deviceModel: 'iPhone 14 Pro',
          issue: 'Screen Replacement (Original OLED)',
          estimatedCost: 14500,
          notes: 'Client needs original TrueTone calibration',
          status: 'Repairing'
        },
        {
          id: 'REP-7729',
          receivedDate: '06 Sep 2024',
          customerName: 'Rajesh Kumar',
          customerPhone: '+91 98881 77654',
          deviceModel: 'OnePlus 11R',
          issue: 'Charging Port & Battery Replacement',
          estimatedCost: 3200,
          notes: '160W SuperVOOC port connector damaged',
          status: 'Ready'
        }
      ];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('gmc_repairs', JSON.stringify(repairs));
    } catch (e) {}
  }, [repairs]);

  const handleAddRepair = async (repair) => {
    setRepairs((prev) => [repair, ...prev]);
    showToast(`Repair Ticket #${repair.id} logged successfully! 🔧`);
    await createRepairInDb(repair);
  };

  const handleUpdateRepairStatus = async (id, status, notes) => {
    setRepairs((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status, notes: notes !== undefined ? notes : r.notes } : r))
    );
    showToast(`Repair #${id} marked as ${status}`);
    await updateRepairStatusInDb(id, status, notes);
  };

  const handleDeleteRepair = async (id) => {
    setRepairs((prev) => prev.filter((r) => r.id !== id));
    showToast(`Repair ticket #${id} deleted.`);
    await deleteRepairInDb(id);
  };

  // Modal open states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isTradeInOpen, setIsTradeInOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [supportInitialTab, setSupportInitialTab] = useState('contact');

  const handleOpenSupport = (tab = 'contact') => {
    setSupportInitialTab(tab);
    setIsSupportOpen(true);
  };

  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);

  // Cart handlers
  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveItem = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
    setTradeInDiscount(0);
    setTradeInDevice('');
  };

  const handleApplyTradeInDiscount = async (valOrLead, deviceName) => {
    let val = 0;
    let dev = '';
    let newInquiry = null;

    if (typeof valOrLead === 'object' && valOrLead !== null) {
      newInquiry = valOrLead;
      val = newInquiry.estimatedValue || 0;
      dev = newInquiry.deviceName || '';
    } else {
      val = valOrLead || 0;
      dev = deviceName || '';
      newInquiry = {
        id: 'EXC-' + Math.floor(1000 + Math.random() * 9000),
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        customerName: currentUser?.name || 'Customer',
        customerPhone: currentUser?.phone || '+91 98765 43210',
        deviceName: dev,
        condition: 'Customer Evaluated',
        estimatedValue: val,
        targetDevice: 'Store Purchase',
        status: 'Pending Review'
      };
    }

    setTradeInDiscount(val);
    setTradeInDevice(dev);
    setTradeInInquiries((prev) => [newInquiry, ...prev]);
    showToast(`Applied ₹${val.toLocaleString('en-IN')} Trade-in Credit! 🏷️`);
    setIsCartOpen(true);
    await createTradeInInDb(newInquiry);
  };

  // Wishlist handlers
  const handleToggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.includes(product.id);
      if (exists) {
        showToast(`Removed "${product.name}" from Wishlist`);
        return prev.filter((id) => id !== product.id);
      } else {
        showToast(`Added "${product.name}" to Wishlist ❤️`);
        return [...prev, product.id];
      }
    });
  };

  const handleRemoveFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((id) => id !== productId));
    showToast('Item removed from Wishlist');
  };

  const handleMoveAllToCart = () => {
    const productsToAdd = products.filter((p) => wishlist.includes(p.id));
    if (productsToAdd.length === 0) return;
    setCartItems((prev) => {
      const updated = [...prev];
      productsToAdd.forEach((p) => {
        const existing = updated.find((item) => item.id === p.id);
        if (existing) {
          existing.quantity += 1;
        } else {
          updated.push({ ...p, quantity: 1 });
        }
      });
      return updated;
    });
    setWishlist([]);
    setIsWishlistOpen(false);
    setIsCartOpen(true);
    showToast(`Moved ${productsToAdd.length} items to Shopping Cart! 🛒`);
  };

  // Orders handlers (User-scoped)
  const handlePlaceOrder = async (newOrder) => {
    const fullOrder = {
      ...newOrder,
      userId: currentUser?.id,
      customerEmail: currentUser?.email,
      customerName: newOrder.customerName || currentUser?.name,
      customerPhone: newOrder.customerPhone || currentUser?.phone,
      shippingAddress: newOrder.shippingAddress || currentUser?.address || 'Maur Mandi, Bathinda District, Punjab'
    };
    setOrders((prev) => [fullOrder, ...prev]);
    showToast(`Order #${newOrder.id} confirmed & added to My Orders! 📦`);
    await createOrderInDb(fullOrder);
  };

  const userOrders = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'admin') return orders;
    const userEmail = currentUser.email?.toLowerCase();
    return orders.filter(
      (o) =>
        o.userId === currentUser.id ||
        (o.customerEmail && o.customerEmail.toLowerCase() === userEmail)
    );
  }, [orders, currentUser]);

  const handleReorder = (items) => {
    setCartItems((prev) => {
      const updated = [...prev];
      items.forEach((item) => {
        const existing = updated.find((i) => i.id === item.id);
        if (existing) {
          existing.quantity += item.quantity;
        } else {
          updated.push({ ...item });
        }
      });
      return updated;
    });
    setIsOrdersOpen(false);
    setIsCartOpen(true);
    showToast('Items added to Cart! Ready for checkout.');
  };

  // Wishlist products computation
  const wishlistProducts = useMemo(() => {
    return products.filter((p) => wishlist.includes(p.id));
  }, [wishlist, products]);

  // Filtered Products computation
  const filteredSmartphones = useMemo(() => {
    return products.filter((p) => {
      if (p.category !== 'smartphones') return false;
      if (selectedBrand !== 'all' && p.brand !== selectedBrand) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return p.name.toLowerCase().includes(q) || (p.subtitle && p.subtitle.toLowerCase().includes(q));
      }
      return true;
    });
  }, [selectedBrand, searchQuery, products]);

  const filteredAccessories = useMemo(() => {
    return products.filter((p) => {
      if (p.category !== 'accessories') return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return p.name.toLowerCase().includes(q) || (p.subtitle && p.subtitle.toLowerCase().includes(q));
      }
      return true;
    });
  }, [searchQuery, products]);

  const cartTotalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // ----------------------------------------------------
  // SCENARIO 1: Logged in as ADMIN (and not previewing store)
  // ----------------------------------------------------
  if (currentUser && currentUser.role === 'admin' && !adminPreviewMode) {
    return (
      <>
        <AdminDashboard
          adminUser={currentUser}
          onLogout={handleLogout}
          onPreviewStore={() => setAdminPreviewMode(true)}
          products={products}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          orders={orders}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onViewInvoice={(order) => setSelectedInvoiceOrder(order)}
          stories={stories}
          onAddStory={handleAddStory}
          onDeleteStory={handleDeleteStory}
          tradeInInquiries={tradeInInquiries}
          onUpdateTradeInStatus={handleUpdateTradeInStatus}
          onDeleteTradeIn={handleDeleteTradeIn}
          repairs={repairs}
          onAddRepair={handleAddRepair}
          onUpdateRepairStatus={handleUpdateRepairStatus}
          onDeleteRepair={handleDeleteRepair}
          users={users}
          loginSessions={loginSessions}
          onRefreshUsers={refreshUsersAndLogins}
        />

        {/* Tax Invoice Modal */}
        <InvoiceReceiptModal
          isOpen={!!selectedInvoiceOrder}
          order={selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />

        {/* Notification Toast */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full border border-amber-400/40 bg-[#161d2d]/95 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
            {toast}
          </div>
        )}
      </>
    );
  }

  // ----------------------------------------------------
  // SCENARIO 3: Logged in as USER (or Admin in Preview Mode)
  // -> Shows Customer Storefront
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md antialiased overflow-x-hidden">
      {/* Top Fixed Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        wishlistCount={wishlist.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        ordersCount={userOrders.length}
        onOpenOrders={() => {
          if (currentUser) {
            setIsOrdersOpen(true);
          } else {
            openAuthModal('Sign in to view your previous orders & tracking details.');
          }
        }}
        onOpenSupport={(tab) => handleOpenSupport(tab || 'contact')}
        onOpenProfile={() => {
          if (currentUser) {
            setIsProfileOpen(true);
          } else {
            openAuthModal('Sign in to view and manage your profile & addresses.');
          }
        }}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAdminDashboard={() => setAdminPreviewMode(false)}
        onOpenAuthModal={(msg, mode) => openAuthModal(msg, mode)}
      />

      {/* Admin Preview Mode Floating Banner */}
      {adminPreviewMode && (
        <div className="fixed top-16 left-0 right-0 z-40 flex items-center justify-between bg-amber-400 px-4 sm:px-8 py-2 text-black font-bold text-xs shadow-lg">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">visibility</span>
            <span>Admin Store Preview Mode • You are previewing GMC exactly as users experience it.</span>
          </div>
          <button
            onClick={() => setAdminPreviewMode(false)}
            className="flex items-center gap-1 rounded-lg bg-black text-amber-300 hover:text-white px-3 py-1 font-bold text-xs transition-colors"
          >
            <span>← Return to Admin Dashboard</span>
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className={`w-full ${adminPreviewMode ? 'pt-8' : ''}`}>
        {/* Hero Banner Section */}
        <HeroBanner
          onBuyNowClick={() => {
            const topPhone = products.find((p) => p.id === 's24-ultra') || products[0];
            if (topPhone) handleAddToCart(topPhone);
          }}
          onLearnMoreClick={() => {
            const topPhone = products.find((p) => p.id === 's24-ultra') || products[0];
            if (topPhone) setSelectedProduct(topPhone);
          }}
        />

        {/* Curated Brands Filter */}
        <BrandSelector
          selectedBrand={selectedBrand}
          onSelectBrand={setSelectedBrand}
        />

        {/* Trending Phones Section */}
        <TrendingPhones
          products={filteredSmartphones}
          selectedBrand={selectedBrand}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onSelectProduct={(product) => setSelectedProduct(product)}
          onAddToCart={handleAddToCart}
          onViewAll={() => setSelectedBrand('all')}
        />

        {/* Customer Diaries & Deliveries Experience (Real Buyer Photos) */}
        <CustomerExperience
          stories={stories}
          onOpenAddModal={() => {
            if (currentUser?.role === 'admin') {
              setIsAddStoryOpen(true);
            } else {
              openAuthModal('Store Owner credentials required to publish customer diaries.', 'admin-login');
            }
          }}
          onSelectStory={(story) => setSelectedStory(story)}
        />

        {/* Latest Offers, Store Discounts & Promo Coupons */}
        <LatestOffers
          onApplyOffer={(offer) => {
            setAppliedOffer(offer);
            if (offer) {
              showToast(`Coupon ${offer.code} Applied! Save ₹${offer.discount.toLocaleString('en-IN')} 🎉`);
            }
          }}
          onOpenCart={() => setIsCartOpen(true)}
        />

        {/* Premium Accessories Showcase Section */}
        <PremiumAccessories
          accessories={filteredAccessories}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onSelectAccessory={(item) => setSelectedProduct(item)}
        />
      </main>

      {/* GMC Footer */}
      <Footer onOpenSupport={(tab) => handleOpenSupport(tab || 'contact')} />

      {/* Modals & Overlays */}
      <OrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={userOrders}
        onReorder={handleReorder}
        onViewInvoice={(order) => setSelectedInvoiceOrder(order)}
        onOpenSupport={() => {
          setIsOrdersOpen(false);
          handleOpenSupport('repair');
        }}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={currentUser}
        onUpdateProfile={handleUpdateProfile}
      />

      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        onAddToCart={handleAddToCart}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onMoveAllToCart={handleMoveAllToCart}
      />

      <InvoiceReceiptModal
        isOpen={!!selectedInvoiceOrder}
        order={selectedInvoiceOrder}
        onClose={() => setSelectedInvoiceOrder(null)}
      />

      <SupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
        initialTab={supportInitialTab}
        repairs={repairs}
        onAddRepairConsultation={handleAddRepair}
      />

      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onOpenTradeIn={() => setIsTradeInOpen(true)}
        wishlist={wishlist}
        onToggleWishlist={handleToggleWishlist}
      />

      <TradeInModal
        isOpen={isTradeInOpen}
        onClose={() => setIsTradeInOpen(false)}
        onApplyDiscount={handleApplyTradeInDiscount}
        currentUser={currentUser}
        onSubmitTradeInLead={handleApplyTradeInDiscount}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        tradeInDiscount={tradeInDiscount}
        tradeInDevice={tradeInDevice}
        appliedOffer={appliedOffer}
        onApplyOffer={setAppliedOffer}
        onClearCart={handleClearCart}
        onPlaceOrder={handlePlaceOrder}
        onViewInvoice={(order) => setSelectedInvoiceOrder(order)}
        currentUser={currentUser}
        onOpenAuthModal={(msg) => openAuthModal(msg, 'user-login')}
        onOpenOrders={() => {
          setIsCartOpen(false);
          if (currentUser) {
            setIsOrdersOpen(true);
          } else {
            openAuthModal('Sign in to view your previous orders & tracking details.');
          }
        }}
      />

      {/* Owner Add Story Modal */}
      <AddCustomerStoryModal
        isOpen={isAddStoryOpen}
        onClose={() => setIsAddStoryOpen(false)}
        onAddStory={handleAddStory}
      />

      {/* Story High-Res Lightbox Modal */}
      <StoryLightboxModal
        isOpen={!!selectedStory}
        story={selectedStory}
        onClose={() => setSelectedStory(null)}
      />

      {/* Login / Sign Up Modal */}
      <AuthGate
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        promptMessage={authPromptMessage}
        initialMode={authModalMode}
      />

      {/* Notification Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full border border-primary/40 bg-surface-container-high/95 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
          {toast}
        </div>
      )}
    </div>
  );
}

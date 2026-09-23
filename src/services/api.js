// GAGAN MOBILE CARE - Unified Backend API & PostgreSQL Client

const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : 'http://localhost:5050/api';

/**
 * Generic Fetcher with Timeout & Error Handling
 */
async function fetchApi(endpoint, options = {}) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    // Return null if server is unreachable
    return null;
  }
}

// ----------------------------------------------------
// 1. PRODUCTS API
// ----------------------------------------------------
export async function getProductsFromDb() {
  return await fetchApi('/products');
}

export async function createProductInDb(product) {
  return await fetchApi('/products', {
    method: 'POST',
    body: JSON.stringify(product)
  });
}

export async function updateProductInDb(id, updates) {
  return await fetchApi(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  });
}

export async function deleteProductInDb(id) {
  return await fetchApi(`/products/${id}`, {
    method: 'DELETE'
  });
}

// ----------------------------------------------------
// 2. ORDERS API
// ----------------------------------------------------
export async function getOrdersFromDb(userId, email) {
  let url = '/orders';
  if (userId || email) {
    const params = new URLSearchParams();
    if (userId) params.append('user_id', userId);
    if (email) params.append('email', email);
    url += `?${params.toString()}`;
  }
  return await fetchApi(url);
}

export async function createOrderInDb(order) {
  return await fetchApi('/orders', {
    method: 'POST',
    body: JSON.stringify(order)
  });
}

export async function updateOrderStatusInDb(orderId, status) {
  return await fetchApi(`/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
}

// ----------------------------------------------------
// 3. CUSTOMER STORIES API
// ----------------------------------------------------
export async function getStoriesFromDb() {
  return await fetchApi('/stories');
}

export async function createStoryInDb(story) {
  return await fetchApi('/stories', {
    method: 'POST',
    body: JSON.stringify(story)
  });
}

export async function deleteStoryInDb(id) {
  return await fetchApi(`/stories/${id}`, {
    method: 'DELETE'
  });
}

// ----------------------------------------------------
// 4. USER CART & WISHLIST API
// ----------------------------------------------------
export async function getUserCartFromDb(userId) {
  if (!userId) return null;
  return await fetchApi(`/cart/${userId}`);
}

export async function saveUserCartInDb(userId, items) {
  if (!userId) return null;
  return await fetchApi(`/cart/${userId}`, {
    method: 'POST',
    body: JSON.stringify({ items })
  });
}

export async function getUserWishlistFromDb(userId) {
  if (!userId) return null;
  return await fetchApi(`/wishlist/${userId}`);
}

export async function saveUserWishlistInDb(userId, items) {
  if (!userId) return null;
  return await fetchApi(`/wishlist/${userId}`, {
    method: 'POST',
    body: JSON.stringify({ items })
  });
}

// ----------------------------------------------------
// 5. USER PROFILE & AUTH API
// ----------------------------------------------------
export async function getUsersFromDb() {
  return await fetchApi('/users');
}

export async function getLoginsFromDb() {
  return await fetchApi('/logins');
}

export async function recordLoginInDb(user, deviceInfo) {
  if (!user) return null;
  return await fetchApi('/auth/record-login', {
    method: 'POST',
    body: JSON.stringify({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      deviceInfo: deviceInfo || navigator.userAgent
    })
  });
}

export async function loginUserInDb(email, password) {
  return await fetchApi('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export async function registerUserInDb(userData) {
  return await fetchApi('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
}

export async function updateUserProfileInDb(profile) {
  return await fetchApi('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(profile)
  });
}

// ----------------------------------------------------
// 6. REPAIRS DESK API
// ----------------------------------------------------
export async function getRepairsFromDb() {
  return await fetchApi('/repairs');
}

export async function trackRepairFromDb(query) {
  if (!query) return null;
  return await fetchApi(`/repairs/track/${encodeURIComponent(query.trim())}`);
}

export async function createRepairInDb(repair) {
  return await fetchApi('/repairs', {
    method: 'POST',
    body: JSON.stringify(repair)
  });
}

export async function updateRepairStatusInDb(id, status, notes) {
  return await fetchApi(`/repairs/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, notes })
  });
}

export async function deleteRepairInDb(id) {
  return await fetchApi(`/repairs/${id}`, {
    method: 'DELETE'
  });
}

// ----------------------------------------------------
// 7. TRADE-IN EXCHANGE INQUIRIES API
// ----------------------------------------------------
export async function getTradeInsFromDb() {
  return await fetchApi('/trade-ins');
}

export async function createTradeInInDb(inquiry) {
  return await fetchApi('/trade-ins', {
    method: 'POST',
    body: JSON.stringify(inquiry)
  });
}

export async function updateTradeInStatusInDb(id, status) {
  return await fetchApi(`/trade-ins/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
}

export async function deleteTradeInInDb(id) {
  return await fetchApi(`/trade-ins/${id}`, {
    method: 'DELETE'
  });
}



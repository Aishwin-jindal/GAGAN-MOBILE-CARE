// Initial Previous Orders Data for Gagan Mobile Care
export const INITIAL_ORDERS = [
  {
    id: 'GMC-8492',
    date: '18 Aug 2024',
    status: 'Delivered',
    statusStep: 4, // 1: Confirmed, 2: Packed, 3: Dispatched, 4: Delivered
    customerName: 'Krish Jindal',
    customerPhone: '+91 98765 43210',
    deliveryAddress: 'Main Market, GMC Hub, Green Park, New Delhi',
    paymentMethod: 'UPI / NetBanking (Prepaid)',
    trackingNumber: 'GMC-DEL-892174',
    discount: 2500,
    tradeInDevice: 'iPhone 12 (Exchanged)',
    total: 122400,
    items: [
      {
        id: 'iphone-15-pro',
        name: 'iPhone 15 Pro (128GB Black Titanium)',
        price: 124900,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
        brand: 'apple'
      }
    ]
  },
  {
    id: 'GMC-6104',
    date: '12 Jul 2024',
    status: 'Delivered',
    statusStep: 4,
    customerName: 'Krish Jindal',
    customerPhone: '+91 98765 43210',
    deliveryAddress: 'Store Pickup - Gagan Mobile Care Counter #1',
    paymentMethod: 'Cash on Counter Pickup',
    trackingNumber: 'GMC-PU-610401',
    discount: 0,
    total: 17498,
    items: [
      {
        id: 'pro-earbuds',
        name: 'GMC Pro Earbuds ANC with Spatial Audio',
        price: 14999,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
        brand: 'apple'
      },
      {
        id: 'fast-chargers',
        name: 'GaN Fast Chargers 120W Dual Port',
        price: 2499,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
        brand: 'oneplus'
      }
    ]
  }
];

export const INITIAL_WISHLIST = [
  's24-ultra',
  'smart-watch'
];

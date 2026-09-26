// Active Store Offers, Deals & Promo Coupons for Gagan Mobile Care (GMC)

export const STORE_OFFERS = [
  {
    id: 'bank-cashback',
    title: 'Up to ₹10,000 Instant Bank Cashback',
    tag: 'BANK OFFER',
    badge: 'Limited Time',
    code: 'HDFCSAMSUNG',
    discount: 10000,
    minCartValue: 50000,
    description: 'Instant discount on HDFC, ICICI, and SBI Bank Cards on Flagship Smartphones (Min ₹50k order).',
    icon: 'credit_card',
    color: 'from-cyan-500/20 to-blue-600/10',
    border: 'border-cyan-500/40',
    expiry: 'Ends in 2 days'
  },
  {
    id: 'festive-bonanza',
    title: 'Flat ₹3,000 Store Festive Voucher',
    tag: 'COUPON DEAL',
    badge: 'Hot Offer',
    code: 'GMCFESTIVE',
    discount: 3000,
    minCartValue: 20000,
    description: 'Use coupon code GMCFESTIVE on any iPhone, Galaxy S-Series or Flagship purchase (Min ₹20k order).',
    icon: 'local_activity',
    color: 'from-amber-500/20 to-orange-600/10',
    border: 'border-amber-500/40',
    expiry: 'Valid this week'
  },
  {
    id: 'accessory-bundle',
    title: '₹1,000 Off On Pro Audio & Accessories',
    tag: 'COMBO DEAL',
    badge: 'Bundle & Save',
    code: 'GMCCOMBO',
    discount: 1000,
    minCartValue: 4000,
    description: 'Save ₹1,000 on premium GMC Pro Audio, Chargers & Smart Watch combos (Min ₹4k order).',
    icon: 'headphones',
    color: 'from-purple-500/20 to-pink-600/10',
    border: 'border-purple-500/40',
    expiry: 'Store Special'
  },
  {
    id: 'first-time-buyer',
    title: 'Flat ₹1,500 Off for New Customers',
    tag: 'WELCOME OFFER',
    badge: 'First Order',
    code: 'FIRSTGMC',
    discount: 1500,
    minCartValue: 10000,
    description: 'Exclusive welcome voucher for your smartphone order at GMC (Min ₹10k order).',
    icon: 'card_giftcard',
    color: 'from-emerald-500/20 to-teal-600/10',
    border: 'border-emerald-500/40',
    expiry: 'Ongoing'
  }
];

export const SPECIAL_PERKS = [
  {
    icon: 'verified_user',
    title: '1 Year GMC Damage Care',
    desc: 'Free screen protection & liquid damage warranty with all flagship phones.'
  },
  {
    icon: 'speed',
    title: 'Same Day 2-Hour Delivery',
    desc: 'Express courier delivery right to your doorstep across the city.'
  },
  {
    icon: 'currency_rupee',
    title: '0% No-Cost EMI up to 24 Mos',
    desc: 'Flexible monthly installments with 0 down payment on all top brands.'
  },
  {
    icon: 'redeem',
    title: 'Free Genuine Accessories Gift Box',
    desc: 'Complimentary 9H Tempered Glass + High-Speed Type-C Cable in box.'
  }
];

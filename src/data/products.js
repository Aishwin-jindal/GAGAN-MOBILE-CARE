// Product Data for Gagan Mobile Care (GMC)

export const BRANDS = [
  { id: 'all', name: 'ALL BRANDS' },
  { id: 'apple', name: 'APPLE' },
  { id: 'samsung', name: 'SAMSUNG' },
  { id: 'google', name: 'GOOGLE' },
  { id: 'oneplus', name: 'ONEPLUS' },
  { id: 'nothing', name: 'NOTHING' },
  { id: 'xiaomi', name: 'XIAOMI' },
  { id: 'vivo', name: 'VIVO' },
  { id: 'oppo', name: 'OPPO' },
];

export const PRODUCTS = [
  // --- APPLE ---
  {
    id: 'iphone-16-pro-max',
    name: 'iPhone 16 Pro Max',
    brand: 'apple',
    category: 'smartphones',
    price: 144900,
    formattedPrice: '₹1,44,900',
    subtitle: 'Desert Titanium. A18 Pro with Camera Control.',
    badge: 'Latest Launch',
    trending: true,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    specs: {
      display: '6.9" Super Retina XDR OLED ProMotion 120Hz',
      processor: 'Apple A18 Pro 3nm with 6-core GPU',
      camera: '48MP Fusion + 48MP Ultra-Wide + 12MP 5x Telephoto',
      battery: 'Up to 33 hrs video playback (Fast MagSafe)',
      storage: '256GB / 512GB / 1TB Desert Titanium',
      warranty: '1 Year Official Apple India Warranty'
    }
  },
  {
    id: 'iphone-16-pro',
    name: 'iPhone 16 Pro',
    brand: 'apple',
    category: 'smartphones',
    price: 119900,
    formattedPrice: '₹1,19,900',
    subtitle: 'Grade 5 Titanium, 48MP Fusion & Apple Intelligence.',
    badge: 'Apple Intelligence',
    trending: true,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
    specs: {
      display: '6.3" Super Retina XDR OLED ProMotion 120Hz',
      processor: 'Apple A18 Pro 3nm Chip',
      camera: '48MP Main + 48MP Ultrawide + 12MP 5x Telephoto',
      battery: 'Up to 27 hrs video playback',
      storage: '128GB / 256GB / 512GB Natural Titanium',
      warranty: '1 Year Official Apple Warranty'
    }
  },
  {
    id: 'iphone-16',
    name: 'iPhone 16',
    brand: 'apple',
    category: 'smartphones',
    price: 79900,
    formattedPrice: '₹79,900',
    subtitle: 'Action button, 48MP Fusion, Vibrant color-infused glass.',
    badge: 'New Release',
    trending: false,
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80',
    specs: {
      display: '6.1" Super Retina XDR OLED display',
      processor: 'Apple A18 Chip with 5-core GPU',
      camera: '48MP Fusion 2x Telephoto + 12MP Ultra-Wide',
      battery: 'Up to 22 hrs video playback',
      storage: '128GB / 256GB Ultramarine & Teal',
      warranty: '1 Year Apple Care Protection'
    }
  },
  {
    id: 'iphone-15-pro',
    name: 'iPhone 15 Pro',
    brand: 'apple',
    category: 'smartphones',
    price: 124900,
    formattedPrice: '₹1,24,900',
    subtitle: 'Forged in titanium. A17 Pro 3nm powerhouse.',
    badge: 'Best Seller',
    trending: true,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    specs: {
      display: '6.1" Super Retina XDR OLED ProMotion 120Hz',
      processor: 'A17 Pro Bionic 3nm Chip',
      camera: '48MP Main + 12MP Ultra-Wide + 12MP 3x Telephoto',
      battery: 'Up to 23 hrs video playback',
      storage: '128GB / 256GB Black Titanium',
      warranty: '1 Year Official Apple Warranty'
    }
  },

  // --- SAMSUNG ---
  {
    id: 's24-ultra',
    name: 'Galaxy S24 Ultra',
    brand: 'samsung',
    category: 'smartphones',
    price: 129999,
    formattedPrice: '₹1,29,999',
    subtitle: 'Titanium frame, Galaxy AI & 200MP Quad Tele.',
    badge: 'Galaxy AI',
    trending: true,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
    specs: {
      display: '6.8" Quad HD+ Dynamic AMOLED 2X 120Hz LTPO',
      processor: 'Snapdragon 8 Gen 3 for Galaxy',
      camera: '200MP Main + 50MP Periscope 5x + 12MP Ultra-Wide',
      battery: '5000 mAh (45W Fast Charging)',
      storage: '256GB / 512GB / 1TB Titanium Gray',
      warranty: '1 Year Brand Warranty + 1 Year GMC Damage Care'
    }
  },
  {
    id: 's24-plus',
    name: 'Galaxy S24+ 5G',
    brand: 'samsung',
    category: 'smartphones',
    price: 99999,
    formattedPrice: '₹99,999',
    subtitle: 'Armor Aluminum 2.0, QHD+ Dynamic AMOLED 2X.',
    badge: 'Flagship',
    trending: false,
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',
    specs: {
      display: '6.7" QHD+ Dynamic AMOLED 2X 120Hz',
      processor: 'Exynos 2400 / Snapdragon 8 Gen 3',
      camera: '50MP OIS Dual Pixel + 12MP Ultra-Wide + 10MP 3x',
      battery: '4900 mAh (45W Fast Charging)',
      storage: '12GB RAM + 256GB Cobalt Violet',
      warranty: '1 Year Samsung India Warranty'
    }
  },
  {
    id: 'z-fold-6',
    name: 'Galaxy Z Fold6',
    brand: 'samsung',
    category: 'smartphones',
    price: 164999,
    formattedPrice: '₹1,64,999',
    subtitle: 'Ultra-thin, light foldable with S-Pen support & AI.',
    badge: 'Foldable King',
    trending: true,
    image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80',
    specs: {
      display: '7.6" Dynamic AMOLED 2X Inner + 6.3" Outer 120Hz',
      processor: 'Snapdragon 8 Gen 3 for Galaxy',
      camera: '50MP OIS + 12MP Ultra-Wide + 10MP Telephoto 3x',
      battery: '4400 mAh Dual Battery',
      storage: '12GB RAM + 512GB Silver Shadow',
      warranty: '1 Year Samsung Care+ Screen Protection'
    }
  },
  {
    id: 'z-flip-6',
    name: 'Galaxy Z Flip6',
    brand: 'samsung',
    category: 'smartphones',
    price: 109999,
    formattedPrice: '₹1,09,999',
    subtitle: 'Compact iconic flip with 50MP FlexCam & Vapor Chamber.',
    badge: 'Compact Flip',
    trending: false,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
    specs: {
      display: '6.7" FHD+ Dynamic AMOLED 2X + 3.4" FlexWindow',
      processor: 'Snapdragon 8 Gen 3 for Galaxy',
      camera: '50MP OIS Main + 12MP Ultra-Wide',
      battery: '4000 mAh (Longest battery on Flip)',
      storage: '12GB RAM + 256GB Mint / Blue',
      warranty: '1 Year Samsung Care+ Included'
    }
  },

  // --- GOOGLE ---
  {
    id: 'pixel-9-pro-xl',
    name: 'Pixel 9 Pro XL',
    brand: 'google',
    category: 'smartphones',
    price: 124999,
    formattedPrice: '₹1,24,999',
    subtitle: 'Gemini Live, Super Actua display & 8K Zoom Enhance.',
    badge: 'Google AI',
    trending: true,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
    specs: {
      display: '6.8" Super Actua LTPO OLED (1-120Hz, 3000 nits)',
      processor: 'Google Tensor G4 + Titan M2 Security',
      camera: '50MP Octa PD + 48MP Quad PD Ultrawide + 48MP 5x',
      battery: '5060 mAh (37W Fast Charge, 70% in 30 mins)',
      storage: '16GB RAM + 256GB Obsidian / Porcelain',
      warranty: '1 Year Google Official Warranty + 7 Years OS Updates'
    }
  },
  {
    id: 'pixel-9-pro-fold',
    name: 'Pixel 9 Pro Fold',
    brand: 'google',
    category: 'smartphones',
    price: 172999,
    formattedPrice: '₹1,72,999',
    subtitle: "Google's thinnest foldable with immersive 8-inch Super Actua.",
    badge: 'Foldable AI',
    trending: false,
    image: 'https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=800&q=80',
    specs: {
      display: '8.0" Super Actua Flex Inner + 6.3" Outer 120Hz',
      processor: 'Google Tensor G4 with 16GB RAM',
      camera: '48MP Quad PD + 10.5MP Ultrawide + 10.8MP 5x Telephoto',
      battery: '4650 mAh Split Battery Architecture',
      storage: '16GB RAM + 256GB Obsidian',
      warranty: '1 Year Google Warranty'
    }
  },
  {
    id: 'pixel-9',
    name: 'Pixel 9',
    brand: 'google',
    category: 'smartphones',
    price: 79999,
    formattedPrice: '₹79,999',
    subtitle: 'Tensor G4, 50MP Dual camera with Magic Editor & Add Me.',
    badge: 'Pure Android',
    trending: false,
    image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=800&q=80',
    specs: {
      display: '6.3" Actua OLED 60-120Hz (2700 nits peak)',
      processor: 'Google Tensor G4 with Gemini AI',
      camera: '50MP Octa PD Main + 48MP Quad PD Ultrawide',
      battery: '4700 mAh (Fast charging + Qi wireless)',
      storage: '12GB RAM + 128GB Peony / Wintergreen',
      warranty: '1 Year Google India Warranty'
    }
  },
  {
    id: 'pixel-8-pro',
    name: 'Pixel 8 Pro',
    brand: 'google',
    category: 'smartphones',
    price: 94999,
    formattedPrice: '₹94,999',
    subtitle: 'The magic of Google AI. Temperature sensor & Best Take.',
    badge: 'AI Camera',
    trending: true,
    image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=800&q=80',
    specs: {
      display: '6.7" Super Actua LTPO OLED 120Hz',
      processor: 'Google Tensor G3 + Titan M2',
      camera: '50MP Main + 48MP Ultrawide + 48MP 5x Telephoto',
      battery: '5050 mAh (30W Fast Charging)',
      storage: '128GB / 256GB Bay Blue',
      warranty: '1 Year Google India Warranty'
    }
  },

  // --- ONEPLUS ---
  {
    id: 'oneplus-12',
    name: 'OnePlus 12 5G',
    brand: 'oneplus',
    category: 'smartphones',
    price: 64999,
    formattedPrice: '₹64,999',
    subtitle: 'Snapdragon 8 Gen 3, 4th Gen Hasselblad Camera.',
    badge: 'Fast Charger Incl.',
    trending: true,
    image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80',
    specs: {
      display: '6.82" 2K 120Hz ProXDR AMOLED (4500 nits)',
      processor: 'Snapdragon 8 Gen 3 + Cryo-velocity VC',
      camera: '50MP Sony LYT-808 + 64MP 3x Periscope + 48MP Ultra-Wide',
      battery: '5400 mAh (100W SUPERVOOC + 50W AIRVOOC)',
      storage: '16GB RAM + 512GB Flowy Emerald',
      warranty: '1 Year Brand Warranty'
    }
  },
  {
    id: 'oneplus-open',
    name: 'OnePlus Open',
    brand: 'oneplus',
    category: 'smartphones',
    price: 139999,
    formattedPrice: '₹1,39,999',
    subtitle: 'Dual ProXDR displays, Open Canvas multitasking, Hasselblad.',
    badge: 'Foldable Pro',
    trending: true,
    image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=800&q=80',
    specs: {
      display: '7.82" Flexi-fluid 120Hz Inner + 6.31" Outer 120Hz',
      processor: 'Snapdragon 8 Gen 2 Mobile Platform',
      camera: '48MP Sony LYT-T808 Pixel Stacked + 64MP 3x Telephoto',
      battery: '4805 mAh (67W SUPERVOOC)',
      storage: '16GB RAM + 512GB Voyager Black',
      warranty: '1 Year Brand Warranty'
    }
  },
  {
    id: 'oneplus-12r',
    name: 'OnePlus 12R 5G',
    brand: 'oneplus',
    category: 'smartphones',
    price: 39999,
    formattedPrice: '₹39,999',
    subtitle: 'Performance flagship, 4th Gen LTPO 1.5K & 5500mAh.',
    badge: 'Performance King',
    trending: false,
    image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=800&q=80',
    specs: {
      display: '6.78" 1.5K 1-120Hz LTPO 4.0 AMOLED',
      processor: 'Snapdragon 8 Gen 2',
      camera: '50MP Sony IMX890 OIS + 8MP Ultra-Wide + 2MP Macro',
      battery: '5500 mAh (Largest battery on OnePlus, 100W)',
      storage: '16GB RAM + 256GB Cool Blue',
      warranty: '1 Year Brand Warranty'
    }
  },
  {
    id: 'oneplus-nord-4',
    name: 'OnePlus Nord 4 5G',
    brand: 'oneplus',
    category: 'smartphones',
    price: 29999,
    formattedPrice: '₹29,999',
    subtitle: 'All-metal unibody design with Snapdragon 7+ Gen 3.',
    badge: 'Metal Unibody',
    trending: false,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
    specs: {
      display: '6.74" 1.5K 120Hz Ultra-bright AMOLED',
      processor: 'Snapdragon 7+ Gen 3',
      camera: '50MP Sony LYT-600 OIS + 8MP Ultra-Wide',
      battery: '5500 mAh (100W SUPERVOOC)',
      storage: '8GB/12GB RAM + 256GB Mercurial Silver',
      warranty: '1 Year Brand Warranty'
    }
  },

  // --- NOTHING ---
  {
    id: 'nothing-phone-2',
    name: 'Nothing Phone (2)',
    brand: 'nothing',
    category: 'smartphones',
    price: 39999,
    formattedPrice: '₹39,999',
    subtitle: 'Glyph Interface, Nothing OS 2.6, Flagship Snapdragon.',
    badge: 'Iconic Design',
    trending: true,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    specs: {
      display: '6.7" Flexible LTPO OLED 1-120Hz',
      processor: 'Snapdragon 8+ Gen 1',
      camera: '50MP Sony IMX890 OIS + 50MP Samsung JN1 Ultrawide',
      battery: '4700 mAh (45W wired + 15W wireless)',
      storage: '12GB RAM + 256GB Dark Grey',
      warranty: '1 Year Brand Warranty'
    }
  },
  {
    id: 'nothing-phone-2a-plus',
    name: 'Nothing Phone (2a) Plus',
    brand: 'nothing',
    category: 'smartphones',
    price: 27999,
    formattedPrice: '₹27,999',
    subtitle: 'Metallic aesthetic, Dimensity 7350 Pro 5G, Triple 50MP.',
    badge: 'New Launch',
    trending: false,
    image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80',
    specs: {
      display: '6.7" Flexible AMOLED 120Hz (1300 nits peak)',
      processor: 'MediaTek Dimensity 7350 Pro 5G',
      camera: '50MP OIS + 50MP Ultrawide + 50MP Selfie',
      battery: '5000 mAh (50W Fast Charging)',
      storage: '12GB RAM + 256GB Metallic Grey',
      warranty: '1 Year Brand Warranty'
    }
  },
  {
    id: 'nothing-phone-2a',
    name: 'Nothing Phone (2a)',
    brand: 'nothing',
    category: 'smartphones',
    price: 23999,
    formattedPrice: '₹23,999',
    subtitle: 'Fresh transparent look, Dimensity 7200 Pro, 50MP OIS.',
    badge: 'Popular',
    trending: false,
    image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=800&q=80',
    specs: {
      display: '6.7" Flexible AMOLED 120Hz',
      processor: 'Dimensity 7200 Pro (TSMC 4nm)',
      camera: '50MP Main OIS + 50MP Ultrawide',
      battery: '5000 mAh (45W Fast Charging)',
      storage: '8GB/12GB RAM + 128GB/256GB White / Black',
      warranty: '1 Year Brand Warranty'
    }
  },
  {
    id: 'cmf-phone-1',
    name: 'CMF Phone 1 by Nothing',
    brand: 'nothing',
    category: 'smartphones',
    price: 15999,
    formattedPrice: '₹15,999',
    subtitle: 'Modular design, interchangeable backs, Dimensity 7300.',
    badge: 'Modular Innovation',
    trending: false,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
    specs: {
      display: '6.67" Super AMOLED 120Hz (2000 nits peak)',
      processor: 'MediaTek Dimensity 7300 5G',
      camera: '50MP Sony Sensor + Portrait Sensor',
      battery: '5000 mAh (33W Fast Charging)',
      storage: '8GB RAM + 128GB Black / Orange',
      warranty: '1 Year Brand Warranty'
    }
  },

  // --- XIAOMI ---
  {
    id: 'xiaomi-14-ultra',
    name: 'Xiaomi 14 Ultra',
    brand: 'xiaomi',
    category: 'smartphones',
    price: 99999,
    formattedPrice: '₹99,999',
    subtitle: 'Leica Quad Camera System. 1-inch LYT-900 sensor.',
    badge: 'Leica Optics',
    trending: true,
    image: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&w=800&q=80',
    specs: {
      display: '6.73" WQHD+ All Around Liquid AMOLED 120Hz LTPO',
      processor: 'Snapdragon 8 Gen 3',
      camera: 'Leica 50MP 1" Main + 50MP 3.2x + 50MP 5x Periscope + 50MP UW',
      battery: '5000 mAh (90W HyperCharge + 80W Wireless)',
      storage: '16GB RAM + 512GB Titanium Black',
      warranty: '1 Year Brand Warranty'
    }
  },
  {
    id: 'xiaomi-14',
    name: 'Xiaomi 14',
    brand: 'xiaomi',
    category: 'smartphones',
    price: 69999,
    formattedPrice: '₹69,999',
    subtitle: 'Compact flagship, Leica Summilux lens, 90W HyperCharge.',
    badge: 'Compact Pro',
    trending: false,
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',
    specs: {
      display: '6.36" 1.5K 120Hz LTPO AMOLED (3000 nits)',
      processor: 'Snapdragon 8 Gen 3',
      camera: 'Leica 50MP Hunter 900 + 50MP Telephoto + 50MP UW',
      battery: '4610 mAh (90W HyperCharge + 50W Wireless)',
      storage: '12GB RAM + 512GB Jade Green',
      warranty: '1 Year Brand Warranty'
    }
  },
  {
    id: 'xiaomi-14-civi',
    name: 'Xiaomi 14 CIVI',
    brand: 'xiaomi',
    category: 'smartphones',
    price: 39999,
    formattedPrice: '₹39,999',
    subtitle: 'Dual 32MP selfie cameras, Leica cinematic mode, 7.4mm thin.',
    badge: 'Cinematic',
    trending: false,
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80',
    specs: {
      display: '6.55" 1.5K Quad Curved AMOLED 120Hz',
      processor: 'Snapdragon 8s Gen 3',
      camera: '50MP Leica Summilux + 50MP 2x Telephoto + 12MP UW',
      battery: '4700 mAh (67W Turbo Charge)',
      storage: '12GB RAM + 512GB Matcha Green Vegan Leather',
      warranty: '1 Year Brand Warranty'
    }
  },
  {
    id: 'redmi-note-13-pro-plus',
    name: 'Redmi Note 13 Pro+ 5G',
    brand: 'xiaomi',
    category: 'smartphones',
    price: 31999,
    formattedPrice: '₹31,999',
    subtitle: '200MP OIS Camera, IP68 Waterproof Curved AMOLED, 120W.',
    badge: 'Top Seller',
    trending: false,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
    specs: {
      display: '6.67" 1.5K 120Hz 3D Curved AMOLED',
      processor: 'MediaTek Dimensity 7200-Ultra (4nm)',
      camera: '200MP Samsung ISOCELL HP3 OIS + 8MP UW',
      battery: '5000 mAh (120W HyperCharge - 100% in 19 mins)',
      storage: '12GB RAM + 512GB Fusion Purple',
      warranty: '1 Year Brand Warranty'
    }
  },

  // --- VIVO ---
  {
    id: 'vivo-x100-pro',
    name: 'Vivo X100 Pro',
    brand: 'vivo',
    category: 'smartphones',
    price: 89999,
    formattedPrice: '₹89,999',
    subtitle: 'ZEISS APO Telephoto Camera + V3 Imaging Chip.',
    badge: 'ZEISS Pro',
    trending: true,
    image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=800&q=80',
    specs: {
      display: '6.78" 1.5K 120Hz LTPO AMOLED (3000 nits)',
      processor: 'MediaTek Dimensity 9300 + Vivo V3 Chip',
      camera: '50MP 1-inch ZEISS + 50MP ZEISS APO Floating Telephoto',
      battery: '5400 mAh (100W FlashCharge + 50W Wireless)',
      storage: '16GB RAM + 512GB Asteroid Black',
      warranty: '1 Year Brand Warranty'
    }
  },
  {
    id: 'vivo-x-fold-3-pro',
    name: 'Vivo X Fold3 Pro',
    brand: 'vivo',
    category: 'smartphones',
    price: 159999,
    formattedPrice: '₹1,59,999',
    subtitle: 'Carbon fiber hinge, IPX8 water resistance & ZEISS optics.',
    badge: 'Foldable Pro',
    trending: true,
    image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80',
    specs: {
      display: '8.03" 2K+ E7 AMOLED Inner + 6.53" Outer 120Hz',
      processor: 'Snapdragon 8 Gen 3 Mobile Platform',
      camera: '50MP Main OIS + 64MP ZEISS Periscope + 50MP Ultrawide',
      battery: '5700 mAh BlueOcean Silicon Battery (100W)',
      storage: '16GB RAM + 512GB Celestial Black',
      warranty: '1 Year Brand Warranty + Screen Protection'
    }
  },
  {
    id: 'vivo-v40-pro',
    name: 'Vivo V40 Pro 5G',
    brand: 'vivo',
    category: 'smartphones',
    price: 49999,
    formattedPrice: '₹49,999',
    subtitle: 'All ZEISS Multifocal Portraits, 5500mAh in 7.58mm body.',
    badge: 'Portrait Master',
    trending: false,
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80',
    specs: {
      display: '6.78" 1.5K 3D Curved AMOLED 120Hz',
      processor: 'MediaTek Dimensity 9200+',
      camera: '50MP ZEISS OIS Main + 50MP ZEISS Telephoto + 50MP ZEISS UW',
      battery: '5500 mAh BlueOcean Battery (80W FlashCharge)',
      storage: '12GB RAM + 512GB Ganges Blue / Titanium Grey',
      warranty: '1 Year Brand Warranty'
    }
  },
  {
    id: 'vivo-t3-ultra',
    name: 'Vivo T3 Ultra 5G',
    brand: 'vivo',
    category: 'smartphones',
    price: 31999,
    formattedPrice: '₹31,999',
    subtitle: 'Dimensity 9200+ flagship grade power with Sony IMX921.',
    badge: 'Speed Beast',
    trending: false,
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',
    specs: {
      display: '6.78" 1.5K 120Hz 3D Curved AMOLED',
      processor: 'MediaTek Dimensity 9200+ (4nm, Antutu 1.6M+)',
      camera: '50MP Sony IMX921 OIS + 8MP Ultrawide',
      battery: '5500 mAh (80W FlashCharge)',
      storage: '12GB RAM + 256GB Lunar Gray',
      warranty: '1 Year Brand Warranty'
    }
  },

  // --- OPPO ---
  {
    id: 'oppo-find-x7-ultra',
    name: 'Oppo Find X7 Ultra',
    brand: 'oppo',
    category: 'smartphones',
    price: 94999,
    formattedPrice: '₹94,999',
    subtitle: "World's First Dual Periscope Telephoto with Hasselblad.",
    badge: 'Dual Periscope',
    trending: true,
    image: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&w=800&q=80',
    specs: {
      display: '6.82" QHD+ LTPO Curved AMOLED (4500 nits)',
      processor: 'Snapdragon 8 Gen 3',
      camera: '50MP 1-inch LYT-900 + 50MP 3x + 50MP 6x Dual Periscope',
      battery: '5000 mAh (100W SUPERVOOC + 50W Wireless)',
      storage: '16GB RAM + 512GB Ocean Blue Leather',
      warranty: '1 Year Brand Warranty'
    }
  },
  {
    id: 'oppo-reno-12-pro',
    name: 'Oppo Reno12 Pro 5G',
    brand: 'oppo',
    category: 'smartphones',
    price: 36999,
    formattedPrice: '₹36,999',
    subtitle: 'AI LinkBoost, GenAI Portrait Studio & Sponge Bionic Cushioning.',
    badge: 'AI Flagship',
    trending: false,
    image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=800&q=80',
    specs: {
      display: '6.7" Quad-Curved Infinite View AMOLED 120Hz',
      processor: 'MediaTek Dimensity 7300-Energy (4nm)',
      camera: '50MP Sony LYT-600 OIS + 50MP 2x Telephoto + 8MP UW',
      battery: '5000 mAh (80W SUPERVOOC)',
      storage: '12GB RAM + 512GB Sunset Gold',
      warranty: '1 Year Brand Warranty'
    }
  },
  {
    id: 'oppo-find-n3-flip',
    name: 'Oppo Find N3 Flip',
    brand: 'oppo',
    category: 'smartphones',
    price: 74999,
    formattedPrice: '₹74,999',
    subtitle: 'Triple camera flip phone with Hasselblad Portrait & Alert Slider.',
    badge: 'Hasselblad Flip',
    trending: false,
    image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80',
    specs: {
      display: '6.8" 120Hz LTPO AMOLED Inner + 3.26" Vertical Outer Cover',
      processor: 'MediaTek Dimensity 9200',
      camera: '50MP Sony IMX890 OIS + 32MP 2x Telephoto + 48MP UW',
      battery: '4300 mAh (44W SUPERVOOC)',
      storage: '12GB RAM + 256GB Cream Gold',
      warranty: '1 Year Oppo Care Warranty'
    }
  },

  // Premium Accessories (matching reference section)
  {
    id: 'pro-earbuds',
    name: 'GMC Pro Earbuds ANC',
    brand: 'apple',
    category: 'accessories',
    accessoryCategory: 'earbuds',
    price: 14999,
    formattedPrice: 'From ₹14,999',
    subtitle: 'Active Noise Cancellation & Spatial Audio.',
    badge: 'High Fidelity',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'smart-watch',
    name: 'Smart Watch Ultra',
    brand: 'samsung',
    category: 'accessories',
    accessoryCategory: 'watches',
    price: 20000,
    formattedPrice: 'From ₹20,000',
    subtitle: 'Titanium case, Sapphire glass, Dual GPS.',
    badge: 'Fitness Tracker',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'leather-cases',
    name: 'Premium Leather & MagSafe Cases',
    brand: 'apple',
    category: 'accessories',
    accessoryCategory: 'cases',
    price: 4900,
    formattedPrice: 'From ₹4,900',
    subtitle: 'European full-grain leather with magnetic snap.',
    badge: 'Genuine Leather',
    image: 'https://images.unsplash.com/photo-1601593378449-20d265918790?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'fast-chargers',
    name: 'GaN Fast Chargers 120W / 65W',
    brand: 'oneplus',
    category: 'accessories',
    accessoryCategory: 'chargers',
    price: 2499,
    formattedPrice: 'From ₹2,499',
    subtitle: 'Ultra-compact Gallium Nitride multi-device charging.',
    badge: 'SuperFast',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'tempered-glass',
    name: '9H Armor Screen Protectors',
    brand: 'all',
    category: 'accessories',
    accessoryCategory: 'protection',
    price: 999,
    formattedPrice: 'From ₹999',
    subtitle: 'Shatter-proof oleophobic anti-fingerprint glass.',
    badge: 'Lifetime Swap',
    image: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'airpods-pro-2',
    name: 'Apple AirPods Pro (2nd Gen) USB-C',
    brand: 'apple',
    category: 'accessories',
    accessoryCategory: 'earbuds',
    price: 24900,
    formattedPrice: '₹24,900',
    subtitle: '2x Active Noise Cancellation, Adaptive Audio & MagSafe Case.',
    badge: 'Apple Original',
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'galaxy-watch-6',
    name: 'Galaxy Watch6 Classic 47mm LTE',
    brand: 'samsung',
    category: 'accessories',
    accessoryCategory: 'watches',
    price: 27999,
    formattedPrice: '₹27,999',
    subtitle: 'Rotating bezel, Sapphire Crystal, Advanced Sleep & ECG Coaching.',
    badge: 'Samsung Official',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'magsafe-stand',
    name: '3-in-1 MagSafe Fast Wireless Stand',
    brand: 'apple',
    category: 'accessories',
    accessoryCategory: 'chargers',
    price: 3999,
    formattedPrice: '₹3,999',
    subtitle: 'Simultaneously charge iPhone (15W), Apple Watch & AirPods.',
    badge: 'Fast Wireless',
    image: 'https://images.unsplash.com/photo-1622445268462-8e14674753ba?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'powerbank-65w',
    name: '20,000mAh 65W Power Delivery Bank',
    brand: 'oneplus',
    category: 'accessories',
    accessoryCategory: 'chargers',
    price: 4499,
    formattedPrice: '₹4,499',
    subtitle: 'Ultra-fast laptop and phone multi-device fast charge on the go.',
    badge: '65W Power',
    image: 'https://images.unsplash.com/photo-1609592424364-16a7f7267123?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'carbon-case',
    name: 'Aramid Carbon Fiber Sleek Armor Case',
    brand: 'all',
    category: 'accessories',
    accessoryCategory: 'cases',
    price: 2299,
    formattedPrice: '₹2,299',
    subtitle: 'Aerospace-grade 1500D Kevlar fiber with MagSafe ring embedded.',
    badge: 'Military Grade',
    image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80'
  }
];

export const OLD_PHONE_MODELS = [
  { brand: 'Apple', model: 'iPhone 14 Pro Max', maxValue: 35000 },
  { brand: 'Apple', model: 'iPhone 13 Pro', maxValue: 22000 },
  { brand: 'Apple', model: 'iPhone 12', maxValue: 15000 },
  { brand: 'Samsung', model: 'Galaxy S23 Ultra', maxValue: 32000 },
  { brand: 'Samsung', model: 'Galaxy S22 Ultra', maxValue: 20000 },
  { brand: 'Samsung', model: 'Galaxy Z Fold 4', maxValue: 26000 },
  { brand: 'OnePlus', model: 'OnePlus 11 5G', maxValue: 19000 },
  { brand: 'OnePlus', model: 'OnePlus 10 Pro', maxValue: 14000 },
  { brand: 'Google', model: 'Pixel 7 Pro', maxValue: 16500 },
  { brand: 'Google', model: 'Pixel 6a', maxValue: 9500 },
  { brand: 'Xiaomi', model: 'Xiaomi 13 Pro', maxValue: 18000 },
  { brand: 'Xiaomi', model: 'Xiaomi 12 Pro', maxValue: 12000 },
  { brand: 'Vivo', model: 'Vivo X90 Pro', maxValue: 17500 },
  { brand: 'Vivo', model: 'Vivo X80 Pro', maxValue: 13000 },
  { brand: 'Oppo', model: 'Oppo Reno 10 Pro+', maxValue: 15000 },
  { brand: 'Oppo', model: 'Oppo Find X5 Pro', maxValue: 14000 },
  { brand: 'Nothing', model: 'Nothing Phone (1)', maxValue: 11000 }
];

/**
 * Database Seed Script
 * Populates the database with sample data for SegzTech
 */

require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");

// Generate all IDs first to avoid circular references
const ids = {
  categories: [
    uuidv4(), // phones
    uuidv4(), // laptops
    uuidv4(), // tablets
    uuidv4(), // accessories
    uuidv4(), // wearables
    uuidv4(), // gaming
    uuidv4(), // monitors
    uuidv4(), // game_consoles
  ],
  brands: [
    uuidv4(), // Apple
    uuidv4(), // Samsung
    uuidv4(), // Sony
    uuidv4(), // Dell
    uuidv4(), // Google
    uuidv4(), // OnePlus
    uuidv4(), // ASUS
    uuidv4(), // Lenovo
    uuidv4(), // Anker
    uuidv4(), // Logitech
  ],
  users: [
    uuidv4(), // admin
    uuidv4(), // john
    uuidv4(), // jane
  ],
  products: Array.from({ length: 15 }, () => uuidv4()),
};

const seedData = {
  // Categories
  categories: [
    {
      id: ids.categories[0],
      name: "Phones",
      slug: "phones",
      icon: "smartphone",
      sort_order: 1,
    },
    {
      id: ids.categories[1],
      name: "Laptops",
      slug: "laptops",
      icon: "laptop",
      sort_order: 2,
    },
    {
      id: ids.categories[2],
      name: "Tablets",
      slug: "tablets",
      icon: "tablet",
      sort_order: 3,
    },
    {
      id: ids.categories[3],
      name: "Accessories",
      slug: "accessories",
      icon: "headphones",
      sort_order: 4,
    },
    {
      id: ids.categories[4],
      name: "Wearables",
      slug: "wearables",
      icon: "watch",
      sort_order: 5,
    },
    {
      id: ids.categories[5],
      name: "Gaming",
      slug: "gaming",
      icon: "gamepad",
      sort_order: 6,
    },
    {
      id: ids.categories[6],
      name: "Monitors",
      slug: "monitors",
      icon: "desktop",
      sort_order: 7,
    },
    {
      id: ids.categories[7],
      name: "Game Consoles",
      slug: "game_consoles",
      icon: "gamepad",
      sort_order: 8,
    },
  ],

  // Brands
  brands: [
    {
      id: ids.brands[0],
      name: "Apple",
      slug: "apple",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    },
    {
      id: ids.brands[1],
      name: "Samsung",
      slug: "samsung",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
    },
    {
      id: ids.brands[2],
      name: "Sony",
      slug: "sony",
      logo: "https://upload.wikimedia.org/wikipedia/commons/c/c2/Sony_logo_2.svg",
    },
    {
      id: ids.brands[3],
      name: "Dell",
      slug: "dell",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg",
    },
    {
      id: ids.brands[4],
      name: "Google",
      slug: "google",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    },
    {
      id: ids.brands[5],
      name: "OnePlus",
      slug: "oneplus",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/29/OnePlus_logo_2020.svg",
    },
    {
      id: ids.brands[6],
      name: "ASUS",
      slug: "asus",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg",
    },
    {
      id: ids.brands[7],
      name: "Lenovo",
      slug: "lenovo",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/03/Lenovo_Global_Corporate_Logo.png",
    },
    { id: ids.brands[8], name: "Anker", slug: "anker", logo: "" },
    {
      id: ids.brands[9],
      name: "Logitech",
      slug: "logitech",
      logo: "https://upload.wikimedia.org/wikipedia/commons/3/30/Logitech_logo.svg",
    },
  ],

  // Users
  users: [
    {
      id: ids.users[0],
      email: "support@segztech.com",
      password: bcrypt.hashSync("admin123", 10),
      first_name: "Admin",
      last_name: "User",
      phone: "+1987654321",
      avatar:
        "https://ui-avatars.com/api/?name=Admin+User&background=ff9900&color=fff&size=200",
      role: "admin",
      status: "active",
    },
    {
      id: ids.users[1],
      email: "john@example.com",
      password: bcrypt.hashSync("password123", 10),
      first_name: "John",
      last_name: "Doe",
      phone: "+1234567890",
      avatar:
        "https://ui-avatars.com/api/?name=John+Doe&background=ff9900&color=fff&size=200",
      role: "user",
      status: "active",
    },
    {
      id: ids.users[2],
      email: "jane@example.com",
      password: bcrypt.hashSync("password123", 10),
      first_name: "Jane",
      last_name: "Smith",
      phone: "+1987654321",
      avatar:
        "https://ui-avatars.com/api/?name=Jane+Smith&background=0984e3&color=fff&size=200",
      role: "user",
      status: "active",
    },
  ],

  // Products (with images)
  products: [
    {
      id: ids.products[0],
      name: "iPhone 15 Pro Max 256GB",
      slug: "iphone-15-pro-max-256gb",
      short_description: "Titanium design, A17 Pro chip, 5x optical zoom",
      description:
        "The iPhone 15 Pro Max features a titanium design, A17 Pro chip, and a pro camera system with 5x optical zoom. Experience the most powerful iPhone ever.",
      price: 1199.99,
      original_price: 1299.99,
      discount: 8,
      category_index: 0,
      subcategory: "apple",
      brand: "Apple",
      stock: 50,
      ratings: 4.8,
      review_count: 245,
      sold_count: 1850,
      is_featured: true,
      is_flash_sale: true,
      is_hot_pick: true,
      tags: JSON.stringify(["new", "trending", "premium"]),
      specs: JSON.stringify({
        display: "6.7-inch Super Retina XDR",
        processor: "A17 Pro chip",
        ram: "8GB",
        storage: "256GB",
        camera: "48MP Main + 12MP Ultra Wide + 12MP Telephoto",
        battery: "4422mAh",
        os: "iOS 17",
      }),
      images: [
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500",
        "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500",
        "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=500",
        "https://images.unsplash.com/photo-1580910051074-3eb694886f4b?w=500",
      ],
      videos: ["https://www.youtube.com/embed/dQw4w9WgXcQ"],
    },
    {
      id: ids.products[1],
      name: "Samsung Galaxy S24 Ultra 512GB",
      slug: "samsung-galaxy-s24-ultra-512gb",
      short_description: "Built-in S Pen, AI camera, Snapdragon 8 Gen 3",
      description:
        "Galaxy S24 Ultra with built-in S Pen, AI-powered camera, and Snapdragon 8 Gen 3 processor. The ultimate Galaxy experience.",
      price: 1299.99,
      original_price: 1419.99,
      discount: 8,
      category_index: 0,
      subcategory: "samsung",
      brand: "Samsung",
      stock: 35,
      ratings: 4.7,
      review_count: 189,
      sold_count: 1200,
      is_featured: true,
      is_flash_sale: true,
      is_hot_pick: false,
      tags: JSON.stringify(["new", "trending", "premium"]),
      specs: JSON.stringify({
        display: "6.8-inch Dynamic AMOLED 2X",
        processor: "Snapdragon 8 Gen 3",
        ram: "12GB",
        storage: "512GB",
        camera: "200MP Main + 12MP Ultra Wide + 50MP Telephoto",
        battery: "5000mAh",
        os: "Android 14, One UI 6.1",
      }),
      images: [
        "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500",
        "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=500",
        "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500",
      ],
      videos: [],
    },
    {
      id: ids.products[2],
      name: 'MacBook Pro 14" M3 Pro 512GB',
      slug: "macbook-pro-14-m3-pro-512gb",
      short_description: "M3 Pro chip, Liquid Retina XDR, 18hr battery",
      description:
        "MacBook Pro with M3 Pro chip delivers exceptional performance for pro workflows. Features Liquid Retina XDR display and up to 18 hours battery life.",
      price: 1999.99,
      original_price: 2199.99,
      discount: 9,
      category_index: 1,
      subcategory: "apple",
      brand: "Apple",
      stock: 25,
      ratings: 4.9,
      review_count: 156,
      sold_count: 890,
      is_featured: true,
      is_flash_sale: false,
      is_hot_pick: true,
      tags: JSON.stringify(["new", "premium", "bestseller"]),
      specs: JSON.stringify({
        display: "14.2-inch Liquid Retina XDR",
        processor: "Apple M3 Pro",
        ram: "18GB Unified Memory",
        storage: "512GB SSD",
        graphics: "12-core GPU",
        battery: "Up to 18 hours",
        weight: "1.61 kg",
      }),
      images: [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500",
        "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500",
      ],
      videos: [],
    },
    {
      id: ids.products[3],
      name: "Dell XPS 15 Intel i9 32GB 1TB",
      slug: "dell-xps-15-intel-i9-32gb-1tb",
      short_description: 'Intel i9, 32GB RAM, 15.6" OLED display',
      description:
        "Dell XPS 15 with 13th Gen Intel Core i9 processor, 32GB RAM, and stunning 15.6-inch OLED display. Perfect for creators and professionals.",
      price: 1799.99,
      original_price: 2099.99,
      discount: 14,
      category_index: 1,
      subcategory: "dell",
      brand: "Dell",
      stock: 20,
      ratings: 4.6,
      review_count: 98,
      sold_count: 456,
      is_featured: true,
      is_flash_sale: true,
      is_hot_pick: true,
      tags: JSON.stringify(["premium", "creator"]),
      specs: JSON.stringify({
        display: "15.6-inch 3.5K OLED",
        processor: "13th Gen Intel Core i9-13900H",
        ram: "32GB DDR5",
        storage: "1TB SSD",
        graphics: "NVIDIA RTX 4060 6GB",
        battery: "86Whr",
        weight: "1.86 kg",
      }),
      images: [
        "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=500",
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500",
        "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500",
      ],
      videos: [],
    },
    {
      id: ids.products[4],
      name: "AirPods Pro 2nd Generation",
      slug: "airpods-pro-2nd-generation",
      short_description: "Active noise cancellation, spatial audio",
      description:
        "AirPods Pro with active noise cancellation, adaptive audio, and personalized spatial audio. Up to 6 hours of listening time.",
      price: 229.99,
      original_price: 249.99,
      discount: 8,
      category_index: 3,
      subcategory: "earphones",
      brand: "Apple",
      stock: 100,
      ratings: 4.7,
      review_count: 567,
      sold_count: 4500,
      is_featured: false,
      is_flash_sale: true,
      is_hot_pick: true,
      tags: JSON.stringify(["trending", "bestseller"]),
      specs: JSON.stringify({
        type: "In-ear",
        noiseCancellation: "Active Noise Cancellation",
        battery: "Up to 6 hours (30 hours with case)",
        connectivity: "Bluetooth 5.3",
        features: "Adaptive Audio, Personalized Spatial Audio",
      }),
      images: [
        "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500",
        "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=500",
      ],
      videos: [],
    },
    {
      id: ids.products[5],
      name: "Sony WH-1000XM5 Headphones",
      slug: "sony-wh-1000xm5-headphones",
      short_description: "Industry-leading ANC, 30hr battery",
      description:
        "Industry-leading noise cancellation with Auto NC Optimizer. Crystal clear hands-free calling and up to 30 hours battery life.",
      price: 349.99,
      original_price: 399.99,
      discount: 12,
      category_index: 3,
      subcategory: "headphones",
      brand: "Sony",
      stock: 45,
      ratings: 4.8,
      review_count: 423,
      sold_count: 2100,
      is_featured: true,
      is_flash_sale: false,
      is_hot_pick: true,
      tags: JSON.stringify(["premium", "bestseller"]),
      specs: JSON.stringify({
        type: "Over-ear",
        noiseCancellation: "Industry-leading ANC",
        battery: "Up to 30 hours",
        connectivity: "Bluetooth 5.2, 3.5mm jack",
      }),
      images: [
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500",
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500",
      ],
      videos: [],
    },
    {
      id: ids.products[6],
      name: 'iPad Pro 12.9" M2 256GB WiFi',
      slug: "ipad-pro-12-9-m2-256gb-wifi",
      short_description: "M2 chip, Liquid Retina XDR, Apple Pencil support",
      description:
        "iPad Pro with M2 chip, Liquid Retina XDR display, and Apple Pencil hover. The ultimate iPad experience for professionals.",
      price: 1099.99,
      original_price: 1199.99,
      discount: 8,
      category_index: 2,
      subcategory: "apple",
      brand: "Apple",
      stock: 30,
      ratings: 4.8,
      review_count: 234,
      sold_count: 1560,
      is_featured: true,
      is_flash_sale: true,
      is_hot_pick: false,
      tags: JSON.stringify(["premium", "trending"]),
      specs: JSON.stringify({
        display: "12.9-inch Liquid Retina XDR",
        processor: "Apple M2 chip",
        ram: "8GB",
        storage: "256GB",
        camera: "12MP Wide + 10MP Ultra Wide",
        battery: "Up to 10 hours",
      }),
      images: [
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500",
        "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=500",
      ],
      videos: [],
    },
    {
      id: ids.products[7],
      name: "Apple Watch Ultra 2",
      slug: "apple-watch-ultra-2",
      short_description: "Rugged design, 36hr battery, 100m water resistant",
      description:
        "The most rugged and capable Apple Watch with precision dual-frequency GPS, 36-hour battery life, and water resistance to 100m.",
      price: 799.99,
      original_price: 849.99,
      discount: 6,
      category_index: 4,
      subcategory: "smartwatch",
      brand: "Apple",
      stock: 40,
      ratings: 4.9,
      review_count: 178,
      sold_count: 1200,
      is_featured: true,
      is_flash_sale: true,
      is_hot_pick: true,
      tags: JSON.stringify(["premium", "new"]),
      specs: JSON.stringify({
        display: "49mm Always-On Retina LTPO OLED",
        processor: "S9 SiP",
        battery: "Up to 36 hours",
        waterResistance: "100m",
      }),
      images: [
        "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=500",
        "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500",
      ],
      videos: [],
    },
    {
      id: ids.products[8],
      name: "OnePlus 12 256GB",
      slug: "oneplus-12-256gb",
      short_description:
        "Snapdragon 8 Gen 3, 100W fast charging, Hasselblad camera",
      description:
        "OnePlus 12 with Snapdragon 8 Gen 3, 100W SUPERVOOC charging, and 50MP Hasselblad camera system.",
      price: 799.99,
      original_price: 899.99,
      discount: 11,
      category_index: 0,
      subcategory: "oneplus",
      brand: "OnePlus",
      stock: 55,
      ratings: 4.5,
      review_count: 89,
      sold_count: 780,
      is_featured: false,
      is_flash_sale: true,
      is_hot_pick: false,
      tags: JSON.stringify(["value", "performance"]),
      specs: JSON.stringify({
        display: "6.82-inch LTPO AMOLED",
        processor: "Snapdragon 8 Gen 3",
        ram: "12GB",
        storage: "256GB",
        camera: "50MP Main + 48MP Ultra Wide",
        battery: "5400mAh",
        charging: "100W SUPERVOOC",
      }),
      images: [
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
      ],
      videos: [],
    },
    {
      id: ids.products[9],
      name: "Google Pixel 8 Pro 128GB",
      slug: "google-pixel-8-pro-128gb",
      short_description: "Tensor G3 chip, AI features, 7 years updates",
      description:
        "Pixel 8 Pro with Google Tensor G3 chip, the best Pixel camera yet, and 7 years of OS and security updates.",
      price: 899.99,
      original_price: 999.99,
      discount: 10,
      category_index: 0,
      subcategory: "google",
      brand: "Google",
      stock: 38,
      ratings: 4.6,
      review_count: 145,
      sold_count: 920,
      is_featured: true,
      is_flash_sale: false,
      is_hot_pick: true,
      tags: JSON.stringify(["ai", "camera"]),
      specs: JSON.stringify({
        display: "6.7-inch LTPO OLED",
        processor: "Google Tensor G3",
        ram: "12GB",
        storage: "128GB",
        camera: "50MP Main + 48MP Ultra Wide",
        battery: "5050mAh",
      }),
      images: [
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500",
        "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500",
      ],
      videos: [],
    },
    {
      id: ids.products[10],
      name: "ASUS ROG Zephyrus G14",
      slug: "asus-rog-zephyrus-g14",
      short_description: 'Ryzen 9, RTX 4090, 14" Nebula HDR display',
      description:
        "Ultra-thin gaming laptop with AMD Ryzen 9, RTX 4090, and 14-inch Nebula HDR display. Gaming power meets portability.",
      price: 2199.99,
      original_price: 2499.99,
      discount: 12,
      category_index: 1,
      subcategory: "gaming",
      brand: "ASUS",
      stock: 15,
      ratings: 4.7,
      review_count: 67,
      sold_count: 234,
      is_featured: true,
      is_flash_sale: true,
      is_hot_pick: true,
      tags: JSON.stringify(["gaming", "premium", "portable"]),
      specs: JSON.stringify({
        display: "14-inch 2.5K Nebula HDR 165Hz",
        processor: "AMD Ryzen 9 7940HS",
        ram: "32GB DDR5",
        storage: "1TB SSD",
        graphics: "NVIDIA RTX 4090 16GB",
        weight: "1.72 kg",
      }),
      images: [
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500",
        "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=500",
      ],
      videos: [],
    },
    {
      id: ids.products[11],
      name: "Sony PlayStation 5 Console",
      slug: "sony-playstation-5-console",
      short_description: "Next-gen gaming, 4K 120fps, ray tracing",
      description:
        "Experience lightning-fast loading, deeper immersion with haptic feedback, and an all-new generation of PlayStation games.",
      price: 499.99,
      original_price: 549.99,
      discount: 9,
      category_index: 7,
      subcategory: "consoles",
      brand: "Sony",
      stock: 25,
      ratings: 4.9,
      review_count: 2345,
      sold_count: 8900,
      is_featured: true,
      is_flash_sale: true,
      is_hot_pick: true,
      tags: JSON.stringify(["gaming", "bestseller", "trending"]),
      specs: JSON.stringify({
        cpu: "AMD Zen 2, 8 cores @ 3.5GHz",
        gpu: "10.28 TFLOPs, RDNA 2",
        storage: "825GB SSD",
        output: "4K 120fps, 8K support",
      }),
      images: [
        "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500",
        "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=500",
      ],
      videos: [],
    },
    {
      id: ids.products[12],
      name: "Logitech MX Master 3S",
      slug: "logitech-mx-master-3s",
      short_description: "8K DPI, quiet clicks, MagSpeed scroll",
      description:
        "Advanced wireless mouse with 8K DPI sensor, quiet clicks, and MagSpeed scroll wheel. Works on any surface.",
      price: 99.99,
      original_price: 109.99,
      discount: 9,
      category_index: 3,
      subcategory: "peripherals",
      brand: "Logitech",
      stock: 150,
      ratings: 4.8,
      review_count: 892,
      sold_count: 5600,
      is_featured: false,
      is_flash_sale: true,
      is_hot_pick: true,
      tags: JSON.stringify(["productivity", "bestseller"]),
      specs: JSON.stringify({
        sensor: "8000 DPI",
        connectivity: "Bluetooth, USB-C",
        battery: "Up to 70 days",
      }),
      images: [
        "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500",
        "https://images.unsplash.com/photo-1586953208270-767889f0a056?w=500",
      ],
      videos: [],
    },
    {
      id: ids.products[13],
      name: "Samsung Galaxy Watch 6 Classic",
      slug: "samsung-galaxy-watch-6-classic",
      short_description: "Rotating bezel, health monitoring, premium design",
      description:
        "Premium smartwatch with rotating bezel, advanced health monitoring, and sleek design.",
      price: 399.99,
      original_price: 429.99,
      discount: 7,
      category_index: 4,
      subcategory: "smartwatch",
      brand: "Samsung",
      stock: 60,
      ratings: 4.5,
      review_count: 134,
      sold_count: 890,
      is_featured: false,
      is_flash_sale: false,
      is_hot_pick: false,
      tags: JSON.stringify(["android", "health"]),
      specs: JSON.stringify({
        display: "1.5-inch Super AMOLED",
        processor: "Exynos W930",
        battery: "Up to 40 hours",
        waterResistance: "5ATM + IP68",
      }),
      images: [
        "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
      ],
      videos: [],
    },
    {
      id: ids.products[14],
      name: "Anker 737 Power Bank 24000mAh",
      slug: "anker-737-power-bank-24000mah",
      short_description: "24000mAh, 140W output, charges laptops",
      description:
        "Ultra-high capacity power bank with 140W max output. Charge your laptop, phone, and more at full speed.",
      price: 149.99,
      original_price: 169.99,
      discount: 12,
      category_index: 3,
      subcategory: "powerbanks",
      brand: "Anker",
      stock: 80,
      ratings: 4.7,
      review_count: 456,
      sold_count: 3400,
      is_featured: false,
      is_flash_sale: true,
      is_hot_pick: false,
      tags: JSON.stringify(["portable", "travel"]),
      specs: JSON.stringify({
        capacity: "24000mAh",
        output: "140W max",
        ports: "2x USB-C, 1x USB-A",
      }),
      images: [
        "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500",
        "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=500",
      ],
      videos: [],
    },
  ],
};

// User Addresses (after users are defined)
seedData.userAddresses = [
  {
    id: uuidv4(),
    user_id: ids.users[1],
    label: "Home",
    full_name: "John Doe",
    phone: "+1234567890",
    street: "123 Main Street",
    city: "New York",
    state: "NY",
    zip_code: "10001",
    country: "United States",
    is_default: true,
  },
  {
    id: uuidv4(),
    user_id: ids.users[1],
    label: "Office",
    full_name: "John Doe",
    phone: "+1234567890",
    street: "456 Business Ave, Suite 100",
    city: "New York",
    state: "NY",
    zip_code: "10002",
    country: "United States",
    is_default: false,
  },
];

// Orders (after products are defined)
seedData.orders = [
  {
    id: uuidv4(),
    order_number: "ST-20240115-001",
    user_id: ids.users[1],
    subtotal: 1199.99,
    shipping_cost: 0,
    shipping_label: "Free Shipping",
    tax: 120.0,
    total: 1319.99,
    status: "delivered",
    payment_status: "paid",
    payment_method: "Credit Card",
    shipping_carrier: "FedEx",
    tracking_number: "TRK123456789",
    estimated_delivery: new Date("2024-01-20"),
    delivered_at: new Date("2024-01-19"),
    created_at: new Date("2024-01-15"),
    product_index: 0,
    quantity: 1,
    address: {
      id: uuidv4(),
      full_name: "John Doe",
      phone: "+1234567890",
      email: "john@example.com",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zip_code: "10001",
      country: "United States",
    },
    timeline: [
      { status: "pending", note: "Order placed" },
      { status: "confirmed", note: "Payment confirmed" },
      { status: "processing", note: "Order processing" },
      { status: "shipped", note: "Order shipped via FedEx" },
      { status: "delivered", note: "Delivered" },
    ],
  },
  {
    id: uuidv4(),
    order_number: "ST-20240120-002",
    user_id: ids.users[1],
    subtotal: 559.97,
    shipping_cost: 0,
    shipping_label: "Free Shipping",
    tax: 56.0,
    total: 615.97,
    status: "shipped",
    payment_status: "paid",
    payment_method: "PayPal",
    shipping_carrier: "DHL",
    tracking_number: "TRK987654321",
    estimated_delivery: new Date("2024-01-25"),
    delivered_at: null,
    created_at: new Date("2024-01-20"),
    product_indices: [4, 12],
    quantities: [2, 1],
    address: {
      id: uuidv4(),
      full_name: "John Doe",
      phone: "+1234567890",
      email: "john@example.com",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zip_code: "10001",
      country: "United States",
    },
    timeline: [
      { status: "pending", note: "Order placed" },
      { status: "confirmed", note: "Payment confirmed" },
      { status: "processing", note: "Order processing" },
      { status: "shipped", note: "Order shipped via DHL" },
    ],
  },
  {
    id: uuidv4(),
    order_number: "ST-20240125-003",
    user_id: ids.users[1],
    subtotal: 499.99,
    shipping_cost: 9.99,
    shipping_label: "Standard Shipping",
    tax: 50.0,
    total: 559.98,
    status: "processing",
    payment_status: "paid",
    payment_method: "Credit Card",
    shipping_carrier: null,
    tracking_number: null,
    estimated_delivery: new Date("2024-02-01"),
    delivered_at: null,
    created_at: new Date("2024-01-25"),
    product_index: 11,
    quantity: 1,
    address: {
      id: uuidv4(),
      full_name: "John Doe",
      phone: "+1234567890",
      email: "john@example.com",
      street: "456 Business Ave, Suite 100",
      city: "New York",
      state: "NY",
      zip_code: "10002",
      country: "United States",
    },
    timeline: [
      { status: "pending", note: "Order placed" },
      { status: "confirmed", note: "Payment confirmed" },
      { status: "processing", note: "Order processing" },
    ],
  },
];

// Flash Sale Banners
seedData.flashSaleBanners = [
  {
    id: uuidv4(),
    title: "Flash Sale",
    subtitle: "Up to 50% OFF",
    description: "Limited time offer on top gadgets",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    link: "/products?sale=flash",
    is_active: true,
    sort_order: 1,
  },
  {
    id: uuidv4(),
    title: "New Arrivals",
    subtitle: "Latest Tech",
    description: "Discover the newest gadgets in town",
    image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800",
    link: "/products?sort=newest",
    is_active: true,
    sort_order: 2,
  },
  {
    id: uuidv4(),
    title: "Hot Deals",
    subtitle: "Best Prices",
    description: "Unbeatable prices on premium brands",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800",
    link: "/products",
    is_active: true,
    sort_order: 3,
  },
];

async function runSeed() {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || "segztech",
    });

    console.log("Connected to database. Starting seed...\n");

    console.log("Clearing existing data...");
    await connection.execute("SET FOREIGN_KEY_CHECKS = 0");
    await connection.execute("TRUNCATE TABLE reviews");
    await connection.execute("TRUNCATE TABLE wishlists");
    await connection.execute("TRUNCATE TABLE cart_items");
    await connection.execute("TRUNCATE TABLE order_timeline");
    await connection.execute("TRUNCATE TABLE order_addresses");
    await connection.execute("TRUNCATE TABLE order_items");
    await connection.execute("TRUNCATE TABLE orders");
    await connection.execute("TRUNCATE TABLE product_videos");
    await connection.execute("TRUNCATE TABLE product_images");
    await connection.execute("TRUNCATE TABLE products");
    await connection.execute("TRUNCATE TABLE brands");
    await connection.execute("TRUNCATE TABLE categories");
    await connection.execute("TRUNCATE TABLE user_addresses");
    await connection.execute("TRUNCATE TABLE users");
    await connection.execute("TRUNCATE TABLE flash_sale_banners");
    await connection.execute("SET FOREIGN_KEY_CHECKS = 1");
    console.log("✓ Existing data cleared\n");

    // Seed Categories
    console.log("Seeding categories...");
    for (const cat of seedData.categories) {
      await connection.execute(
        "INSERT INTO categories (id, name, slug, icon, sort_order) VALUES (?, ?, ?, ?, ?)",
        [cat.id, cat.name, cat.slug, cat.icon, cat.sort_order],
      );
      console.log(`  ✓ ${cat.name}`);
    }

    // Seed Brands
    console.log("\nSeeding brands...");
    for (const brand of seedData.brands) {
      await connection.execute(
        "INSERT INTO brands (id, name, slug, logo) VALUES (?, ?, ?, ?)",
        [brand.id, brand.name, brand.slug, brand.logo],
      );
      console.log(`  ✓ ${brand.name}`);
    }

    // Seed Users
    console.log("\nSeeding users...");
    for (const user of seedData.users) {
      await connection.execute(
        "INSERT INTO users (id, email, password, first_name, last_name, phone, avatar, role, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          user.id,
          user.email,
          user.password,
          user.first_name,
          user.last_name,
          user.phone,
          user.avatar,
          user.role,
          user.status,
        ],
      );
      console.log(`  ✓ ${user.email} (${user.role})`);
    }

    // Seed User Addresses
    console.log("\nSeeding user addresses...");
    for (const addr of seedData.userAddresses) {
      await connection.execute(
        "INSERT INTO user_addresses (id, user_id, label, full_name, phone, street, city, state, zip_code, country, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          addr.id,
          addr.user_id,
          addr.label,
          addr.full_name,
          addr.phone,
          addr.street,
          addr.city,
          addr.state,
          addr.zip_code,
          addr.country,
          addr.is_default,
        ],
      );
      console.log(`  ✓ ${addr.label} address`);
    }

    // Seed Products
    console.log("\nSeeding products...");
    for (const product of seedData.products) {
      await connection.execute(
        `INSERT INTO products (id, name, slug, short_description, description, price, original_price, discount, 
          category_id, subcategory, brand, stock, ratings, review_count, sold_count, is_featured, is_flash_sale, 
          is_hot_pick, tags, specs) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          product.id,
          product.name,
          product.slug,
          product.short_description,
          product.description,
          product.price,
          product.original_price,
          product.discount,
          ids.categories[product.category_index],
          product.subcategory,
          product.brand,
          product.stock,
          product.ratings,
          product.review_count,
          product.sold_count,
          product.is_featured,
          product.is_flash_sale,
          product.is_hot_pick,
          product.tags,
          product.specs,
        ],
      );

      // Insert images
      for (let i = 0; i < product.images.length; i++) {
        await connection.execute(
          "INSERT INTO product_images (id, product_id, image_url, sort_order, is_primary) VALUES (?, ?, ?, ?, ?)",
          [uuidv4(), product.id, product.images[i], i, i === 0],
        );
      }

      // Insert videos
      for (let i = 0; i < product.videos.length; i++) {
        await connection.execute(
          "INSERT INTO product_videos (id, product_id, video_url, sort_order) VALUES (?, ?, ?, ?)",
          [uuidv4(), product.id, product.videos[i], i],
        );
      }

      console.log(`  ✓ ${product.name}`);
    }

    // Seed Orders
    console.log("\nSeeding orders...");
    for (const order of seedData.orders) {
      await connection.execute(
        `INSERT INTO orders (id, order_number, user_id, subtotal, shipping_cost, shipping_label, tax, total, 
          status, payment_status, payment_method, shipping_carrier, tracking_number, estimated_delivery, 
          delivered_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          order.id,
          order.order_number,
          order.user_id,
          order.subtotal,
          order.shipping_cost,
          order.shipping_label,
          order.tax,
          order.total,
          order.status,
          order.payment_status,
          order.payment_method,
          order.shipping_carrier,
          order.tracking_number,
          order.estimated_delivery,
          order.delivered_at,
          order.created_at,
        ],
      );

      // Insert order address
      await connection.execute(
        "INSERT INTO order_addresses (id, order_id, full_name, phone, email, street, city, state, zip_code, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          order.address.id,
          order.id,
          order.address.full_name,
          order.address.phone,
          order.address.email,
          order.address.street,
          order.address.city,
          order.address.state,
          order.address.zip_code,
          order.address.country,
        ],
      );

      // Insert order items (handle both single product and multiple products)
      if (order.product_indices) {
        // Multiple products
        for (let i = 0; i < order.product_indices.length; i++) {
          const prod = seedData.products[order.product_indices[i]];
          await connection.execute(
            "INSERT INTO order_items (id, order_id, product_id, name, image, price, quantity, subtotal) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [
              uuidv4(),
              order.id,
              prod.id,
              prod.name,
              prod.images[0],
              prod.price,
              order.quantities[i],
              prod.price * order.quantities[i],
            ],
          );
        }
      } else {
        // Single product
        const prod = seedData.products[order.product_index];
        await connection.execute(
          "INSERT INTO order_items (id, order_id, product_id, name, image, price, quantity, subtotal) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [
            uuidv4(),
            order.id,
            prod.id,
            prod.name,
            prod.images[0],
            prod.price,
            order.quantity,
            prod.price * order.quantity,
          ],
        );
      }

      // Insert timeline
      for (const t of order.timeline) {
        await connection.execute(
          "INSERT INTO order_timeline (id, order_id, status, note) VALUES (?, ?, ?, ?)",
          [uuidv4(), order.id, t.status, t.note],
        );
      }

      console.log(`  ✓ ${order.order_number}`);
    }

    // Seed Flash Sale Banners
    console.log("\nSeeding flash sale banners...");
    for (const banner of seedData.flashSaleBanners) {
      await connection.execute(
        "INSERT INTO flash_sale_banners (id, title, subtitle, description, image, link, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          banner.id,
          banner.title,
          banner.subtitle,
          banner.description,
          banner.image,
          banner.link,
          banner.is_active,
          banner.sort_order,
        ],
      );
      console.log(`  ✓ ${banner.title}`);
    }

    console.log("\n========================================");
    console.log("Database seeded successfully!");
    console.log("========================================\n");
    console.log("Login credentials:");
    console.log("  Admin: admin@segztech.com / admin123");
    console.log("  User:  john@example.com / password123\n");
  } catch (error) {
    console.error("Seed failed:", error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

if (require.main === module) {
  runSeed();
}

module.exports = { seedData, runSeed };

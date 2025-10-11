// Mock data for testing without Firebase
export const mockProducts = [
  {
    id: '1',
    title: 'Golden Lotus Necklace',
    description: 'Elegant handcrafted necklace with lotus pendant',
    price: 25999,
    category: 'necklaces',
    imageUrl: '/products/necklace-1.jpg',
    markdownContent: '# Golden Lotus Necklace\n\n- 24K Gold plated\n- Handcrafted design\n- Adjustable chain length\n\n## Product Details\n\nThis elegant necklace features...',
  },
  {
    id: '2',
    title: 'Crystal Drop Earrings',
    description: 'Stunning crystal earrings with gold finish',
    price: 12999,
    category: 'earrings',
    imageUrl: '/products/earrings-1.jpg',
    markdownContent: '# Crystal Drop Earrings\n\n- Premium crystals\n- Gold-plated finish\n- Lightweight design\n\n## Product Details\n\nThese beautiful earrings...',
  },
  {
    id: '3',
    title: 'Decorative Wall Fragment',
    description: 'Antique-style wall decoration piece',
    price: 18999,
    category: 'home-fragments',
    imageUrl: '/products/fragment-1.jpg',
    markdownContent: '# Decorative Wall Fragment\n\n- Vintage design\n- Hand-painted details\n- Easy mounting\n\n## Product Details\n\nAdd elegance to your walls...',
  },
];

export const mockUser = {
  id: '1',
  email: 'sensaflora@gmail.com',
  displayName: 'Admin User',
  role: 'admin',
};

export const mockOrders = [
  {
    id: '1',
    userId: '1',
    items: [mockProducts[0]],
    total: 25999,
    status: 'shipped',
    shippingDetails: {
      name: 'Admin User',
      email: 'sensaflora@gmail.com',
      phone: '1234567890',
      address: '123 Test Street',
      city: 'Test City',
      state: 'Test State',
      pincode: '123456',
    },
    paymentMethod: 'google-pay',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
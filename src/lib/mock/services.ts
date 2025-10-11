import { mockProducts, mockUser, mockOrders } from './data';

// Mock auth service
export const mockAuth = {
  currentUser: null as typeof mockUser | null,
  
  async signIn(email: string, password: string) {
    if (email === 'sensaflora@gmail.com' && password === 'admin123') {
      this.currentUser = mockUser;
      return mockUser;
    }
    throw new Error('Invalid credentials');
  },

  async signUp(email: string, password: string) {
    if (email === 'sensaflora@gmail.com') {
      throw new Error('Email already in use');
    }
    const newUser = {
      id: Date.now().toString(),
      email,
      displayName: email.split('@')[0],
      role: 'user',
    };
    this.currentUser = newUser;
    return newUser;
  },

  async signOut() {
    this.currentUser = null;
  },
};

// Mock products service
export const mockProductService = {
  async getProducts(options: any = {}) {
    const { category, sortBy = 'createdAt', order = 'desc' } = options;
    let products = [...mockProducts];
    
    if (category) {
      products = products.filter(p => p.category === category);
    }
    
    return products.sort((a, b) => {
      if (sortBy === 'price') {
        return order === 'desc' ? b.price - a.price : a.price - b.price;
      }
      return order === 'desc' ? -1 : 1;
    });
  },

  async getProduct(id: string) {
    const product = mockProducts.find(p => p.id === id);
    if (!product) throw new Error('Product not found');
    return product;
  },

  async addProduct(data: any) {
    const newProduct = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockProducts.push(newProduct);
    return newProduct.id;
  },
};

// Mock orders service
export const mockOrderService = {
  async createOrder(data: any) {
    const newOrder = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockOrders.push(newOrder);
    return newOrder.id;
  },

  async getUserOrders(userId: string) {
    return mockOrders.filter(order => order.userId === userId);
  },

  async getOrder(id: string) {
    const order = mockOrders.find(o => o.id === id);
    if (!order) throw new Error('Order not found');
    return order;
  },
};
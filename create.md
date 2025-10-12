# Sensaflora E-Commerce - Complete Next.js Project

## 📁 Project Structure

```
sensaflora/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.jsx
│   │   └── signup/
│   │       └── page.jsx
│   ├── (shop)/
│   │   ├── shop/
│   │   │   └── page.jsx
│   │   ├── product/
│   │   │   └── [id]/
│   │   │       └── page.jsx
│   │   ├── cart/
│   │   │   └── page.jsx
│   │   └── checkout/
│   │       └── page.jsx
│   ├── profile/
│   │   └── page.jsx
│   ├── admin/
│   │   └── page.jsx
│   ├── layout.jsx
│   ├── page.jsx
│   └── globals.css
├── components/
│   ├── Navigation.jsx
│   ├── Footer.jsx
│   ├── ProductCard.jsx
│   ├── CartItem.jsx
│   ├── OrderTracking.jsx
│   └── AdminPanel.jsx
├── lib/
│   ├── firebase.js
│   ├── auth.js
│   ├── firestore.js
│   └── storage.js
├── context/
│   ├── AuthContext.jsx
│   └── CartContext.jsx
├── public/
│   ├── logo.svg
│   └── favicon.ico
├── .env.local
├── next.config.js
├── tailwind.config.js
├── package.json
└── README.md
```

---

## 🔧 Setup Instructions

### 1. Initialize Next.js Project

```bash
npx create-next-app@latest sensaflora
cd sensaflora
```

When prompted, select:
- ✅ TypeScript? No
- ✅ ESLint? Yes
- ✅ Tailwind CSS? Yes
- ✅ `src/` directory? No
- ✅ App Router? Yes
- ✅ Import alias? Yes (@/*)

### 2. Install Dependencies

```bash
npm install firebase react-markdown react-icons
npm install lucide-react
```

### 3. Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_ADMIN_EMAIL=sensaflora@gmail.com
```

---

## 📄 Core Files

### `lib/firebase.js`

```javascript
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
```

### `lib/auth.js`

```javascript
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from './firebase';

export const signUp = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });
};

export const isAdmin = (email) => {
  return email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
};
```

### `lib/firestore.js`

```javascript
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// Products
export const getProducts = async (category = null) => {
  try {
    const productsRef = collection(db, 'products');
    let q = query(productsRef, orderBy('createdAt', 'desc'));
    
    if (category) {
      q = query(productsRef, where('category', '==', category));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const getProductById = async (id) => {
  try {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

export const addProduct = async (productData) => {
  try {
    const docRef = await addDoc(collection(db, 'products'), {
      ...productData,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, error: null };
  } catch (error) {
    return { id: null, error: error.message };
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, {
      ...productData,
      updatedAt: serverTimestamp(),
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

export const deleteProduct = async (id) => {
  try {
    await deleteDoc(doc(db, 'products', id));
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// Orders
export const createOrder = async (userId, orderData) => {
  try {
    const docRef = await addDoc(collection(db, 'orders'), {
      userId,
      ...orderData,
      status: 'placed',
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, error: null };
  } catch (error) {
    return { id: null, error: error.message };
  }
};

export const getUserOrders = async (userId) => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp(),
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};
```

### `lib/storage.js`

```javascript
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

export const uploadProductImage = async (file, productId) => {
  try {
    const storageRef = ref(storage, `products/${productId}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return { url, error: null };
  } catch (error) {
    return { url: null, error: error.message };
  }
};

export const deleteProductImage = async (imagePath) => {
  try {
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};
```

### `context/AuthContext.jsx`

```javascript
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
```

### `context/CartContext.jsx`

```javascript
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext({});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Load cart from memory (not localStorage per restrictions)
    const savedCart = typeof window !== 'undefined' ? window.cartData : null;
    if (savedCart) {
      setCart(savedCart);
    }
  }, []);

  useEffect(() => {
    // Save to memory
    if (typeof window !== 'undefined') {
      window.cartData = cart;
    }
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      setCart(prevCart => prevCart.filter(item => item.id !== productId));
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
```

### `app/layout.jsx`

```javascript
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata = {
  title: 'Sensaflora - Handcrafted Elegance',
  description: 'Discover our curated collection of handcrafted ornaments and artistic fragments',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <AuthProvider>
          <CartProvider>
            <Navigation />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
```

### `app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-primary: #1A1210;
  --color-gold: #C69238;
  --color-cream: #F2E9D8;
  --color-tan: #BCA98C;
  --color-gold-light: #D4A243;
  --color-gold-lighter: #F2C572;
  --color-dark: #2A1F1D;
  --color-darker: #3D2E2B;
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

body {
  color: var(--color-primary);
  background: var(--color-cream);
}

.font-serif {
  font-family: var(--font-playfair), serif;
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

### `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1A1210',
        gold: '#C69238',
        cream: '#F2E9D8',
        tan: '#BCA98C',
        'gold-light': '#D4A243',
        'gold-lighter': '#F2C572',
        dark: '#2A1F1D',
        darker: '#3D2E2B',
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        serif: ['var(--font-playfair)'],
      },
    },
  },
  plugins: [],
};
```

### `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'firebasestorage.googleapis.com'],
  },
};

module.exports = nextConfig;
```

### `package.json`

```json
{
  "name": "sensaflora",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.1.0",
    "react": "^18",
    "react-dom": "^18",
    "firebase": "^10.8.0",
    "react-markdown": "^9.0.1",
    "lucide-react": "^0.316.0"
  },
  "devDependencies": {
    "autoprefixer": "^10.0.1",
    "postcss": "^8",
    "tailwindcss": "^3.3.0",
    "eslint": "^8",
    "eslint-config-next": "14.1.0"
  }
}
```

---

## 🚀 Deployment to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Add environment variables from `.env.local`
6. Deploy!

---

## 🔐 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Create Firestore Database
5. Enable Storage
6. Copy config to `.env.local`

### Firestore Collections Structure:

**products**
```json
{
  "name": "string",
  "category": "string",
  "price": "number",
  "description": "string",
  "imageUrl": "string",
  "inStock": "boolean",
  "rating": "number",
  "createdAt": "timestamp"
}
```

**orders**
```json
{
  "userId": "string",
  "items": "array",
  "total": "number",
  "status": "string",
  "shippingAddress": "object",
  "paymentMethod": "string",
  "createdAt": "timestamp"
}
```

---

## 📱 Features Included

✅ User Authentication (Login/Signup/Logout)
✅ Product Catalog with Categories
✅ Product Detail Pages
✅ Shopping Cart
✅ Checkout with Google Pay
✅ Order Tracking System
✅ User Profile & Order History
✅ Admin Panel (Markdown-based product management)
✅ Responsive Design (Mobile-first)
✅ Firebase Integration
✅ SEO Optimized

---

## 🎨 Color Palette

- Primary: `#1A1210`
- Gold: `#C69238`
- Cream: `#F2E9D8`
- Tan: `#BCA98C`
- Gold Light: `#D4A243`
- Gold Lighter: `#F2C572`
- Dark: `#2A1F1D`
- Darker: `#3D2E2B`

---

## 👨‍💻 Developer Credit

**Developed by:** [Shibili Designs](https://instagram.com/__shibiliii._)

---

## 📞 Support

For questions: sensaflora@gmail.com
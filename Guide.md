# Sensaflora E-Commerce - Complete Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Git installed
- Firebase account
- Vercel account (for deployment)

---

## 📦 Step 1: Project Setup

### 1.1 Create Next.js Project

```bash
npx create-next-app@latest sensaflora
cd sensaflora
```

Select these options:
- TypeScript? **No**
- ESLint? **Yes**
- Tailwind CSS? **Yes**
- `src/` directory? **No**
- App Router? **Yes**
- Import alias? **Yes** (@/*)

### 1.2 Install Dependencies

```bash
npm install firebase react-markdown lucide-react
```

---

## 🔥 Step 2: Firebase Setup

### 2.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: **sensaflora**
4. Disable Google Analytics (optional)
5. Click "Create project"

### 2.2 Enable Authentication

1. In Firebase Console, go to **Build** → **Authentication**
2. Click "Get started"
3. Enable **Email/Password** sign-in method
4. Click "Save"

### 2.3 Create Firestore Database

1. Go to **Build** → **Firestore Database**
2. Click "Create database"
3. Select **Start in production mode**
4. Choose location closest to you
5. Click "Enable"

### 2.4 Update Firestore Rules

Go to **Rules** tab and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products - read by all, write by admin only
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == 'sensaflora@gmail.com';
    }
    
    // Orders - users can read their own, admin can read all
    match /orders/{orderId} {
      allow read: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         request.auth.token.email == 'sensaflora@gmail.com');
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null && request.auth.token.email == 'sensaflora@gmail.com';
    }
  }
}
```

### 2.5 Enable Storage

1. Go to **Build** → **Storage**
2. Click "Get started"
3. Start in **production mode**
4. Click "Done"

### 2.6 Update Storage Rules

Go to **Rules** tab and paste:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == 'sensaflora@gmail.com';
    }
  }
}
```

### 2.7 Get Firebase Config

1. Go to Project Settings (gear icon)
2. Scroll to "Your apps"
3. Click Web icon (</>) to add web app
4. Register app with name: **sensaflora-web**
5. Copy the config values

---

## 🔐 Step 3: Environment Variables

Create `.env.local` in project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=sensaflora-xxxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=sensaflora-xxxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=sensaflora-xxxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:xxxxx
NEXT_PUBLIC_ADMIN_EMAIL=sensaflora@gmail.com
```

---

## 📁 Step 4: File Structure

Copy all the files from the artifacts into your project:

```
sensaflora/
├── app/
│   ├── login/
│   │   └── page.jsx
│   ├── signup/
│   │   └── page.jsx
│   ├── shop/
│   │   └── page.jsx
│   ├── product/
│   │   └── [id]/
│   │       └── page.jsx
│   ├── cart/
│   │   └── page.jsx
│   ├── checkout/
│   │   └── page.jsx
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
│   └── ProductCard.jsx
├── context/
│   ├── AuthContext.jsx
│   └── CartContext.jsx
├── lib/
│   ├── firebase.js
│   ├── auth.js
│   ├── firestore.js
│   └── storage.js
├── public/
│   ├── logo.svg
│   └── favicon.ico
├── .env.local
├── next.config.js
├── tailwind.config.js
└── package.json
```

---

## 🎨 Step 5: Add Logo

Save the provided logo as `public/logo.svg` and update favicon:

1. Convert logo to favicon using [favicon.io](https://favicon.io/)
2. Replace `public/favicon.ico`

---

## 🧪 Step 6: Test Locally

```bash
npm run dev
```

Visit `http://localhost:3000`

### Test Admin Access

1. Create account with email: **sensaflora@gmail.com**
2. Visit `/admin` to access admin panel
3. Add test products

---

## 🌐 Step 7: Deploy to Vercel

### 7.1 Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sensaflora.git
git push -u origin main
```

### 7.2 Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repository
4. Click "Import"

### 7.3 Add Environment Variables

In Vercel dashboard:
1. Go to **Settings** → **Environment Variables**
2. Add all variables from `.env.local`
3. Click "Deploy"

### 7.4 Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your domain: `sensaflora.com`
3. Update DNS records as instructed

---

## 📊 Step 8: Add Sample Data

### Via Admin Panel

1. Login as admin (sensaflora@gmail.com)
2. Go to `/admin`
3. Click "Add Product"
4. Fill in product details with Markdown descriptions

### Example Product (Markdown):

```markdown
**Handcrafted Gold-Plated Necklace**

*Elegant and timeless*, this necklace features:
- Premium gold plating
- Adjustable chain length
- Hypoallergenic materials
- Perfect for special occasions

**Care Instructions:**
- Store in a cool, dry place
- Avoid contact with water and chemicals
- Clean gently with a soft cloth
```

---

## 🔍 Step 9: SEO Optimization

### Update `app/layout.jsx` metadata:

```javascript
export const metadata = {
  title: 'Sensaflora - Handcrafted Ornaments & Fragments',
  description: 'Discover our curated collection of handcrafted ornaments and artistic fragments. Shop necklaces, earrings, rings, and home decor.',
  keywords: 'jewelry, ornaments, handcrafted, fragments, home decor, necklaces, earrings',
  openGraph: {
    title: 'Sensaflora - Handcrafted Elegance',
    description: 'Curated collection of handcrafted ornaments',
    url: 'https://sensaflora.com',
    siteName: 'Sensaflora',
    images: [
      {
        url: '/logo.svg',
        width: 800,
        height: 600,
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};
```

---

## 💳 Step 10: Google Pay Integration

### For Production:

1. Get Google Pay merchant ID from [Google Pay Business Console](https://pay.google.com/business/console)
2. Update `app/checkout/page.jsx` with actual UPI integration

### UPI Integration Code:

```javascript
const initiateUPIPayment = (amount, orderId) => {
  const upiId = 'sensaflora@paytm'; // Your UPI ID
  const payeeName = 'Sensaflora';
  
  const upiUrl = `upi://pay?pa=${upiId}&pn=${payeeName}&am=${amount}&cu=INR&tn=Order${orderId}`;
  
  window.location.href = upiUrl;
};
```

---

## 📱 Step 11: Mobile Testing

Test on multiple devices:
- Chrome DevTools (F12 → Toggle device toolbar)
- Real mobile devices
- Different screen sizes: 320px, 375px, 768px, 1024px, 1440px

---

## 🔒 Step 12: Security Checklist

- [x] Firebase Security Rules configured
- [x] Environment variables secured
- [x] Admin email protected
- [x] Input validation on forms
- [x] XSS protection (React default)
- [x] HTTPS enabled (Vercel default)

---

## 📈 Step 13: Analytics (Optional)

### Add Google Analytics

1. Get tracking ID from [Google Analytics](https://analytics.google.com)
2. Add to `app/layout.jsx`:

```javascript
import Script from 'next/script';

// In  tag:
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
  strategy="afterInteractive"
/>

  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  `}

```

---

## 🐛 Troubleshooting

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Firebase Connection Issues

- Check `.env.local` values
- Verify Firebase project is active
- Check network/firewall settings

### Image Loading Issues

- Ensure images are in `public/` folder
- Check `next.config.js` image domains
- Verify Firebase Storage URLs

---

## 📝 Maintenance

### Regular Tasks

1. **Weekly**: Check order status and update tracking
2. **Monthly**: Review Firebase usage and optimize
3. **Quarterly**: Update dependencies: `npm update`

### Update Dependencies

```bash
npm outdated
npm update
```

---

## 🎯 Performance Optimization

### Image Optimization

- Use Next.js `Image` component (already implemented)
- Compress images before upload
- Use WebP format when possible

### Code Splitting

- Already implemented via Next.js App Router
- Components lazy-load automatically

### Caching

- Vercel Edge Network handles caching
- Firebase Firestore caches automatically

---

## 📞 Support & Contact

**Email**: sensaflora@gmail.com  
**Instagram**: [@sensaflora.online](https://instagram.com/sensaflora.online)  
**Facebook**: [Sensaflora](https://facebook.com/share/16j9vfFi48)

**Developer**: [Shibili Designs](https://instagram.com/__shibiliii._)

---

## ✅ Post-Deployment Checklist

- [ ] Website loads on all devices
- [ ] Admin panel accessible
- [ ] Products can be added/edited/deleted
- [ ] User registration works
- [ ] Login/logout functions properly
- [ ] Cart functionality works
- [ ] Checkout process completes
- [ ] Order tracking displays correctly
- [ ] Email notifications configured (optional)
- [ ] Custom domain connected (if applicable)
- [ ] SSL certificate active
- [ ] Analytics tracking (if setup)
- [ ] Social media links working
- [ ] Contact information correct

---

## 🚀 Go Live!

Once all checks pass, announce your launch:

1. Update Instagram/Facebook with launch post
2. Share website link
3. Promote initial products
4. Engage with first customers

**Congratulations! Your Sensaflora e-commerce store is now live! 🎉**
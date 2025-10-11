# Sensaflora E-commerce Website

A modern e-commerce website for Sensaflora, built with Next.js, Firebase, and Tailwind CSS.

## Features

- User Authentication (Login, Signup, Logout) via Firebase Auth
- Product browsing and filtering
- Shopping cart functionality
- Secure checkout with Google Pay integration
- Admin panel for product management
- Order tracking system
- Responsive design for all devices
- Markdown support for product descriptions

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS
- **Backend:** Firebase (Firestore, Auth, Storage)
- **Payment:** Google Pay
- **Hosting:** Vercel
- **UI Components:** Custom components with @headlessui/react
- **Icons:** Heroicons
- **Markdown:** react-markdown
- **Forms:** Custom form handling
- **Notifications:** react-hot-toast

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/sensaflora.git
   cd sensaflora
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a Firebase project and get your config:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Email/Password and Google)
   - Enable Firestore
   - Enable Storage
   - Get your Firebase config

4. Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # App router pages
│   ├── admin/             # Admin panel
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout process
│   ├── login/             # Authentication
│   ├── product/           # Product details
│   ├── profile/           # User profile
│   └── shop/              # Product listing
├── components/            # React components
│   ├── layout/           # Layout components
│   └── ui/               # UI components
└── lib/                  # Utilities and hooks
    ├── auth.ts           # Authentication helpers
    ├── cart-context.tsx  # Shopping cart context
    ├── firebase.ts       # Firebase configuration
    ├── orders.ts         # Order management
    └── products.ts       # Product management
```

## Deployment

1. Create a Vercel account and link it with your GitHub repository.
2. Add your environment variables in the Vercel dashboard.
3. Deploy your application.

## Admin Access

The admin panel is only accessible to users with the email: `sensaflora@gmail.com`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Credits

Developed by: [Shibili Designs](https://instagram.com/__shibiliii._)

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';
import { ShoppingBagIcon, UserIcon } from '@heroicons/react/24/outline';

export function Navbar() {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="Sensaflora" width={150} height={40} priority className="h-10 w-auto" />
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link href="/shop" className="text-dark hover:text-primary transition-colors">
            Shop
          </Link>
          <Link href="/about" className="text-dark hover:text-primary transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-dark hover:text-primary transition-colors">
            Contact
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/cart" className="text-dark hover:text-primary transition-colors">
            <ShoppingBagIcon className="h-6 w-6" />
          </Link>
          <Link href={user ? '/profile' : '/login'} className="text-dark hover:text-primary transition-colors">
            <UserIcon className="h-6 w-6" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
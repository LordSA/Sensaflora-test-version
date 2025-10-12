import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navigation() {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <img className="h-8 w-auto" src="/logo.svg" alt="Sensaflora" />
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/shop" className="text-gray-900 hover:text-primary">
                Shop
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <>
                <Link href="/cart" className="text-gray-900 hover:text-primary mx-4">
                  Cart
                </Link>
                <Link href="/profile" className="text-gray-900 hover:text-primary mx-4">
                  Profile
                </Link>
                <button
                  onClick={signOut}
                  className="text-gray-900 hover:text-primary"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-900 hover:text-primary mx-4">
                  Login
                </Link>
                <Link href="/signup" className="text-gray-900 hover:text-primary mx-4">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
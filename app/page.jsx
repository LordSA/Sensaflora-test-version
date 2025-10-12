import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../lib/firestore';

export default async function HomePage() {
  let featuredProducts = [];
  try {
    featuredProducts = await getProducts('products', [
      { field: 'featured', operator: '==', value: true }
    ], null, 4);
  } catch (error) {
    console.error('Error fetching featured products:', error);
  }

  return (
    <main>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="pb-80 pt-16 sm:pb-40 sm:pt-24 lg:pb-48 lg:pt-40">
          <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
            <div className="sm:max-w-lg">
              <h1 className="font-playfair-display text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Welcome to Sensaflora
              </h1>
              <p className="mt-4 text-xl text-gray-500">
                Discover our curated collection of beautiful plants and accessories for your home and garden.
              </p>
            </div>
            <div className="mt-10">
              <Link
                href="/shop"
                className="inline-flex items-center rounded-md border border-transparent bg-primary px-8 py-3 text-base font-medium text-white hover:bg-primary-dark"
              >
                Shop Now
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Featured Products</h2>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center text-base font-semibold text-primary hover:text-primary-dark"
            >
              View All Products
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}